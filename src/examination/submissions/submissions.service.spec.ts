import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { User } from '../../iam/users/entities/user.entity';
import { SectionsService } from '../../learning/sections/sections.service';
import { BadRequestException } from '@nestjs/common';

// 1. TẠO CÁC BẢN SAO "GIẢ" (MOCK) CỦA REPOSITORY VÀ SERVICE
const mockSubmissionRepo = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockQuizRepo = {
  findOne: jest.fn(),
};

const mockUserRepo = {
  findOne: jest.fn(),
};

const mockSectionsService = {
  evaluateSectionCompletion: jest.fn(),
};

const mockEmailQueue = {
  add: jest.fn(),
};

describe('SubmissionsService - Logic Tính Điểm', () => {
  let service: SubmissionsService;

  beforeEach(async () => {
    // 2. KHỞI TẠO MODULE TEST VÀ TIÊM CÁC BẢN MOCK VÀO
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        { provide: getRepositoryToken(Submission), useValue: mockSubmissionRepo },
        { provide: getRepositoryToken(Quiz), useValue: mockQuizRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: SectionsService, useValue: mockSectionsService },
        { provide: 'BullQueue_email-queue', useValue: mockEmailQueue }, // Tên queue của bạn
      ],
    }).compile();

    service = module.get<SubmissionsService>(SubmissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Xóa lịch sử test sau mỗi lần chạy
  });

  //test case 1
  it('phải tính đúng điểm và cho qua môn nếu học sinh chọn đúng đáp án', async () => {
    // 1. Chuẩn bị dữ liệu GIẢ (Mock Data)
    const mockStartedAt = new Date(); // Vừa mới bắt đầu thi
    
    // Giả lập tìm thấy Submission
    mockSubmissionRepo.findOne.mockResolvedValue({
      id: 1,
      userId: 5,
      startedAt: mockStartedAt,
      completedAt: null, // Chưa nộp
    });

    // Giả lập tìm thấy Quiz có 1 câu hỏi, đáp án đúng là Option 100
    mockQuizRepo.findOne.mockResolvedValue({
      id: 1,
      timeLimit: 15,
      passScore: 10,
      sectionId: 1,
      questions: [
        {
          id: 10,
          points: 10,
          options: [
            { id: 100, isCorrect: true },
            { id: 101, isCorrect: false },
          ],
        },
      ],
    });

    // 2. Hành động: Gọi hàm submitQuiz với đáp án của học sinh
    const dto = {
      answers: [{ questionId: 10, optionIds: [100] }], // Học sinh chọn đúng Option 100
    };

    const result = await service.submitQuiz(1, 1, dto as any);

    // 3. Khẳng định (Assert): Kỳ vọng kết quả phải như ý muốn
    expect(result.score).toBe(10); // Phải được 10 điểm
    expect(result.isPassed).toBe(true); // Phải đậu
    
    // Kiểm tra xem hàm save() có được gọi để lưu điểm vào DB không
    expect(mockSubmissionRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ score: 10, completedAt: expect.any(Date) })
    );

    // Kiểm tra bẫy Section có được kích hoạt không
    expect(mockSectionsService.evaluateSectionCompletion).toHaveBeenCalledWith(5, 1);
  });


  //test case 2: Học sinh nộp bài quá thời gian cho phép
  it('phải văng lỗi BadRequestException nếu học sinh nộp bài quá thời gian cho phép', async () => {
    // 1. Chuẩn bị dữ liệu: Giả lập thời gian bắt đầu từ 60 phút trước
    const pastDate = new Date();
    pastDate.setMinutes(pastDate.getMinutes() - 60); // Bắt đầu từ 1 tiếng trước

    mockSubmissionRepo.findOne.mockResolvedValue({
      id: 1,
      userId: 5,
      startedAt: pastDate, // Đã ngâm bài rất lâu
    });

    mockQuizRepo.findOne.mockResolvedValue({
      id: 1,
      timeLimit: 15, // Thời gian làm bài chỉ có 15 phút
      questions: [],
    });

    const dto = { answers: [] };

    // 2 & 3. Hành động và Khẳng định: Kỳ vọng hàm sẽ ném ra lỗi
    await expect(service.submitQuiz(1, 1, dto as any)).rejects.toThrow(BadRequestException);
    
    // Đảm bảo không có lệnh lưu nào được chạy nếu bị lỗi
    expect(mockSubmissionRepo.save).not.toHaveBeenCalled(); 
  });

  it('phải tính 0 điểm và đánh trượt nếu học sinh chọn sai đáp án', async () => {
    // 1. Chuẩn bị dữ liệu
    mockSubmissionRepo.findOne.mockResolvedValue({
      id: 1, userId: 5, startedAt: new Date(), completedAt: null,
    });

    mockQuizRepo.findOne.mockResolvedValue({
      id: 1, timeLimit: 15, passScore: 50, // Cần 50 điểm để đậu
      questions: [
        {
          id: 10, points: 50,
          options: [
            { id: 100, isCorrect: true },  // Đáp án đúng
            { id: 101, isCorrect: false }, // Đáp án sai
          ],
        },
      ],
    });

    // 2. Học sinh nộp đáp án SAI
    const dto = { answers: [{ questionId: 10, optionIds: [101] }] }; 
    const result = await service.submitQuiz(1, 1, dto as any);

    // 3. Khẳng định: Điểm 0 và Rớt
    expect(result.score).toBe(0);
    expect(result.isPassed).toBe(false);
  });

  it('phải không cộng điểm câu Multiple Choice nếu chọn thiếu hoặc dư đáp án', async () => {
    mockSubmissionRepo.findOne.mockResolvedValue({
      id: 1, userId: 5, startedAt: new Date(), completedAt: null,
    });

    mockQuizRepo.findOne.mockResolvedValue({
      id: 1, timeLimit: 15, passScore: 10,
      questions: [
        {
          id: 20, points: 10,
          options: [
            { id: 1, isCorrect: true },   // Đúng
            { id: 2, isCorrect: true },   // Đúng
            { id: 3, isCorrect: false },  // Sai
          ],
        },
      ],
    });

    // Chọn thiếu: Chỉ chọn [1] (đáp án đúng là cả 1 và 2)
    const dtoThieu = { answers: [{ questionId: 20, optionIds: [1] }] };
    const resultThieu = await service.submitQuiz(1, 1, dtoThieu as any);
    expect(resultThieu.score).toBe(0); // Không được điểm nào

    // Chọn dư: Chọn [1, 2, 3] (đáp án đúng chỉ là 1, 2)
    mockSubmissionRepo.findOne.mockResolvedValue({ id: 2, userId: 5, startedAt: new Date(), completedAt: null }); // Reset lại bài nộp
    const dtoDu = { answers: [{ questionId: 20, optionIds: [1, 2, 3] }] };
    const resultDu = await service.submitQuiz(1, 2, dtoDu as any);
    expect(resultDu.score).toBe(0); // Vẫn không được điểm nào
  });
});