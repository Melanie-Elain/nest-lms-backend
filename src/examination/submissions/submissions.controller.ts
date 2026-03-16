import { Controller, Post, Param, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { SubmissionsService } from './submissions.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

// Nhớ import đúng đường dẫn Guard của bạn nhé (tùy cấu trúc thư mục)
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';

@ApiTags('Submissions - Nộp bài thi')
@ApiBearerAuth()
@Controller('submissions')
export class SubmissionsController {
  // Tiêm anh Đầu bếp (Service) vào
  constructor(private readonly submissionsService: SubmissionsService) {}

  // ==========================================================
  // API 1: Bắt đầu làm bài
  // ==========================================================
  @Post('quiz/:quizId/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT') // Chỉ cho phép Học sinh
  @ApiOperation({ summary: 'Bắt đầu làm bài thi (Bắt đầu tính giờ)' })
  startQuiz(@Param('quizId') quizId: string, @Req() req: any) {
    return this.submissionsService.startQuiz(+quizId, req.user.sub);
  }

  // ==========================================================
  // API 2: Nộp bài và nhận điểm
  // ==========================================================
  @Post('quiz/:quizId/submit/:submissionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT') // Chỉ cho phép Học sinh
  @ApiOperation({ summary: 'Nộp bài trắc nghiệm và nhận điểm tự động' })
  submitQuiz(
    @Param('quizId') quizId: string,
    @Param('submissionId') submissionId: string,
    @Body() dto: SubmitQuizDto
  ) {
    return this.submissionsService.submitQuiz(+quizId, +submissionId, dto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT') // Chỉ học sinh mới xem được lịch sử của chính mình
  @ApiOperation({ summary: 'Xem lịch sử các bài thi đã làm của học sinh' })
  getStudentHistory(@Req() req: any) {
    return this.submissionsService.getStudentHistory(req.user.sub);
  }
}