import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';

import { Submission } from './entities/submission.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
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

    return {
      message: 'Nộp bài thành công!',
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
}