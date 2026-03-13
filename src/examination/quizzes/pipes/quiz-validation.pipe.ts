import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QuizValidationPipe implements PipeTransform {
  transform(value: any) {
    // Chỉ chạy logic này nếu người dùng có gửi kèm danh sách câu hỏi
    if (value.questions && value.questions.length > 0) {
      let totalPoints = 0;

      // 1. Quét từng câu hỏi
      value.questions.forEach((question: any, index: number) => {
        totalPoints += question.points || 0;

        // Bắt lỗi: Câu hỏi mồ côi (không có đáp án nào được tick đúng)
        const hasCorrectOption = question.options.some((opt: any) => opt.isCorrect === true);
        if (!hasCorrectOption) {
          throw new BadRequestException(
            `Lỗi logic: Câu hỏi số ${index + 1} ("${question.content}") không có đáp án nào đúng! Vui lòng chọn ít nhất 1 đáp án đúng.`
          );
        }
      });

      // 2. Bắt lỗi: Điểm đỗ cao hơn điểm tổng
      // (Tránh trường hợp bài thi có 10 điểm mà bắt học sinh được 15 điểm mới đỗ)
      if (value.passScore > totalPoints) {
        throw new BadRequestException(
          `Lỗi logic: Điểm đỗ yêu cầu (${value.passScore}) đang lớn hơn tổng điểm của tất cả câu hỏi cộng lại (${totalPoints})!`
        );
      }
    }

    // Nếu vượt qua mọi bài test, trả dữ liệu nguyên vẹn cho Controller đi tiếp
    return value;
  }
}