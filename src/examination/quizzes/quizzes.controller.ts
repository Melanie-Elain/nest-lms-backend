import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizzesService } from './quizzes.service';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/iam/auth/guards/roles.guard';
import { Roles } from 'src/iam/auth/decorators/roles.decorator';
import { AddBankQuestionsDto } from './dto/add-bank-questions.dto';
import { QuizValidationPipe } from './pipes/quiz-validation.pipe';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Quizzes - Quản lý Đề thi') // Gom nhóm trong Swagger
@ApiBearerAuth() // Hiện nút Authorize trong Swagger
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles ('ADMIN', 'INSTRUCTOR') 
  @ApiOperation({ summary: 'Tạo đề thi mới (Kèm câu hỏi & đáp án)' })
  create(@Body(new QuizValidationPipe()) createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor) // Bật Cache cho API này (Mặc định 60 giây, cấu hình ở AppModule)
  @CacheKey('list_all_quizzes') // Đặt tên key Cache riêng cho API này
  @CacheTTL(120) // Ghi đè TTL riêng cho API này: 120 giây (2 phút)
  @ApiOperation({ summary: 'Lấy danh sách tất cả đề thi' })
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một đề thi' })
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles ('ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Cập nhật đề thi (Sửa tên, thời gian, mô tả...)' })
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles ('ADMIN', 'INSTRUCTOR')
  @ApiOperation({ summary: 'Xóa đề thi' })
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(+id);
  }

  

  @Post(':id/questions/from-bank')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR') 
  @ApiOperation({ summary: 'Thêm nhiều câu hỏi từ Ngân hàng vào Đề thi' })
  addQuestionsFromBank(
    @Param('id') id: string, 
    @Body() dto: AddBankQuestionsDto
  ) {
    return this.quizzesService.addQuestionsFromBank(+id, dto);
  }
}