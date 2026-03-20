import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';

import { Submission } from './entities/submission.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from 'src/iam/users/entities/user.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectQueue('email-queue') private readonly emailQueue: Queue,
  ) {}

  async startQuiz(quizId: number, userId: number) {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Không tìm thấy đề thi');

    const submission = this.submissionRepo.create({
      quizId: quizId,
      userId: userId,
    });
    
    return await this.submissionRepo.save(submission);
  }


  async submitQuiz(quizId: number, submissionId: number, dto: SubmitQuizDto) {
    const submission = await this.submissionRepo.findOne({ where: { id: submissionId } });
    if (!submission) throw new NotFoundException('Phiên làm bài không tồn tại');
    
    if (submission.completedAt) throw new BadRequestException('Bài này đã được nộp rồi!');

    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['questions', 'questions.options'],
    });
    if (!quiz) throw new NotFoundException('Không tìm thấy đề thi để chấm điểm!');

    const now = new Date();
    const timeTakenMinutes = (now.getTime() - submission.startedAt.getTime()) / 60000;
    
    if (timeTakenMinutes > quiz.timeLimit) {
      throw new BadRequestException(`Nộp bài quá hạn! Thời gian cho phép: ${quiz.timeLimit} phút. Bạn đã dùng: ${Math.floor(timeTakenMinutes)} phút.`);
    }

    let totalScore = 0;
    const submissionAnswersToSave: any[] = []; 

    for (const studentAnswer of dto.answers) {
      const question = quiz.questions.find(q => q.id === studentAnswer.questionId);
      if (!question) continue;

      const correctOptionIds = question.options
        .filter(opt => opt.isCorrect === true)
        .map(opt => opt.id);

      const isCorrect = 
        correctOptionIds.length === studentAnswer.optionIds.length &&
        correctOptionIds.every(id => studentAnswer.optionIds.includes(id));

      if (isCorrect) {
        totalScore += question.points;
      }

      submissionAnswersToSave.push({
        questionId: question.id,
        selectedOptionId: studentAnswer.optionIds.join(','), 
        isCorrect: isCorrect
      });
    }

    submission.score = totalScore;
    submission.completedAt = now;
    submission.answers = submissionAnswersToSave as any; 

    await this.submissionRepo.save(submission);

    // ==========================================
    // TÍCH HỢP TÌM EMAIL USER THẬT (MỚI THÊM)
    // ==========================================
    // Lưu ý: Mình giả định trong entity Submission của bạn có cột 'userId'. 
    // Nếu bạn đặt tên khác (như studentId), hãy sửa lại chữ 'userId' cho khớp nhé.
    const user = await this.userRepo.findOne({ where: { id: submission.userId } });
    
    if (user && user.email) {
      // Nếu tìm thấy user và user có email, ném job gửi mail vào Hàng đợi
      await this.emailQueue.add('send-score-email', {
        email: user.email, // Lấy email động từ Database
        submissionId: submissionId,
        score: totalScore,
        message: 'Chúc mừng bạn đã hoàn thành bài thi!',
      });
    } else {
      // Nếu không tìm thấy, có thể in ra log để debug chứ không chặn việc trả kết quả nộp bài
      console.warn(`Không tìm thấy email cho userId: ${submission.userId} để gửi thông báo điểm.`);
    }

    return {
      message: 'Nộp bài thành công! Email thông báo đang được gửi.',
      score: totalScore,
      isPassed: totalScore >= quiz.passScore, 
      timeTaken: Math.floor(timeTakenMinutes) + ' phút'
    };
  }


  async getStudentHistory(userId: number) {
    const history = await this.submissionRepo.find({
      where: { userId: userId },
      relations: ['quiz'], 
      order: { startedAt: 'DESC' }, 
      select: {
        id: true,
        score: true,
        // ĐÃ XÓA isPassed Ở ĐÂY CHO KHỎI BÁO LỖI
        startedAt: true,
        completedAt: true,
        quiz: {
          id: true,
          title: true, 
          passScore: true,
        }
      }
    });

    if (!history || history.length === 0) {
      return {
        message: 'Bạn chưa tham gia bài thi nào.',
        data: []
      };
    }

    // TÍNH TOÁN ĐẬU/RỚT ĐỘNG (Dynamic calculation)
    const formattedHistory = history.map(sub => {
      // Lấy điểm chuẩn của đề thi (nếu không có thì mặc định là 0)
      const passScore = sub.quiz?.passScore || 0;
      
      return {
        ...sub,
        // Nếu điểm của học sinh lớn hơn hoặc bằng điểm chuẩn -> Đậu (true)
        isPassed: sub.score !== null ? (sub.score >= passScore) : false
      };
    });

    return {
      message: 'Lấy lịch sử làm bài thành công!',
      total: formattedHistory.length,
      data: formattedHistory // Trả về mảng đã được thêm isPassed
    };
  }

  // ==========================================================
  // 4. XEM CHI TIẾT BÀI LÀM (Đúng/Sai từng câu)
  // ==========================================================
  async getSubmissionDetail(submissionId: number, userId: number) {
    // 1. Lấy bài làm của học sinh (Kèm theo danh sách các câu đã chọn)
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId, userId: userId }, // Bắt buộc check userId để không xem trộm bài người khác
      relations: ['quiz', 'answers'], // Bảng answers của bạn đã được map OneToMany
    });

    if (!submission) {
      throw new NotFoundException('Không tìm thấy bài làm này hoặc bạn không có quyền xem!');
    }

    // 2. Lấy bộ đề thi gốc (Kèm câu hỏi và đáp án chuẩn)
    const quiz = await this.quizRepo.findOne({
      where: { id: submission.quiz.id },
      relations: ['questions', 'questions.options'],
    });

    if (!quiz) {
      throw new NotFoundException('Không tìm thấy đề thi gốc để so sánh!');
    }

    // 3. THUẬT TOÁN "XÀO NẤU" DỮ LIỆU
    // Trộn câu hỏi gốc với đáp án học sinh đã chọn
    const detailedResults = quiz.questions.map((question) => {
      const studentAnswer = submission.answers.find(a => a.questionId === question.id);

      const correctOptionIds = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);

      // SỬA TẠI ĐÂY: Ép kiểu về String trước khi split để hết báo đỏ
      let selectedIds: number[] = [];
      if (studentAnswer && studentAnswer.selectedOptionId) {
        selectedIds = String(studentAnswer.selectedOptionId)
          .split(',')
          .map(Number);
      }

      return {
        questionId: question.id,
        content: question.content,
        points: question.points,
        selectedOptionIds: selectedIds,
        correctOptionIds: correctOptionIds,
        // SỬA TẠI ĐÂY: Dùng dấu hỏi chấm (?) để an toàn hơn
        isCorrect: studentAnswer?.isCorrect ?? false,
        options: question.options.map(opt => ({
          id: opt.id,
          content: opt.content,
        }))
      };
    });

    // 4. Gói ghém tất cả trả về
    return {
      message: 'Lấy chi tiết bài làm thành công',
      overview: {
        submissionId: submission.id,
        score: submission.score,
        isPassed: submission.score !== null ? submission.score >= quiz.passScore : false,
        timeTakenMinutes: submission.completedAt 
          ? Math.floor((submission.completedAt.getTime() - submission.startedAt.getTime()) / 60000)
          : 0
      },
      details: detailedResults
    };
  }

  // ==========================================================
  // 5. GIÁO VIÊN XEM DANH SÁCH BÀI NỘP CỦA 1 ĐỀ THI
  // ==========================================================
  async getQuizSubmissions(quizId: number) {
    // 1. Kiểm tra đề thi có tồn tại không
    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException('Không tìm thấy đề thi này!');
    }

    // 2. Lấy toàn bộ bài nộp của đề thi này (Sắp xếp điểm cao nhất lên đầu)
    const submissions = await this.submissionRepo.find({
      where: { quiz: { id: quizId } },
      order: { score: 'DESC' }, 
      // relations: ['user'], // Bỏ comment dòng này nếu Entity Submission của bạn đã có @ManyToOne với bảng User
    });

    // 3. Tính toán thống kê lớp học
    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter(sub => sub.score !== null && sub.score >= quiz.passScore).length;
    
    // Tính điểm trung bình an toàn (Tránh chia cho 0)
    const averageScore = totalSubmissions > 0 
      ? (submissions.reduce((sum, sub) => sum + Number(sub.score), 0) / totalSubmissions).toFixed(2)
      : 0;

    // 4. Định dạng lại dữ liệu trả về
    return {
      message: `Lấy danh sách bài nộp của đề thi: ${quiz.title}`,
      statistics: {
        totalSubmissions: totalSubmissions,
        passedCount: passedCount,
        failedCount: totalSubmissions - passedCount,
        averageScore: Number(averageScore),
      },
      data: submissions.map(sub => ({
        submissionId: sub.id,
        userId: sub.userId, 
        score: sub.score,
        isPassed: sub.score !== null ? sub.score >= quiz.passScore : false,
        timeTakenMinutes: sub.completedAt 
          ? Math.floor((sub.completedAt.getTime() - sub.startedAt.getTime()) / 60000)
          : 0,
        submittedAt: sub.completedAt,
      }))
    };
  }
}