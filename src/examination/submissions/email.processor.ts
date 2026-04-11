import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('email-queue') // Lắng nghe các đơn hàng từ 'email-queue'
export class EmailProcessor extends WorkerHost {
  // Công cụ in Log đẹp của NestJS
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  // Hàm này sẽ tự động chạy khi có ai đó ném Data vào Queue
  async process(job: Job<any, any, string>): Promise<any> {
    // Rút trích dữ liệu mà file Service ném sang
    const { email, submissionId, score } = job.data;
    
    this.logger.log(`\n Đang soạn Email báo điểm gửi tới: ${email}...`);

    try {
      // Gọi lệnh gửi Email thật
      await this.mailerService.sendMail({
        to: email, 
        subject: `[LMS] Kết quả bài thi trắc nghiệm (ID bài nộp: ${submissionId})`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #4CAF50;">Chúc mừng bạn đã hoàn thành bài thi!</h2>
            <p>Hệ thống đã chấm điểm tự động bài làm của bạn.</p>
            <h3 style="font-size: 24px;">Điểm số của bạn là: <span style="color: red;">${score}/10</span></h3>
            <p>Cảm ơn bạn đã sử dụng nền tảng học tập của chúng tôi. Chúc bạn một ngày học tập hiệu quả!</p>
            <hr>
            <p style="font-size: 12px; color: #888;">* Đây là email gửi tự động từ hệ thống, vui lòng không trả lời thư này.</p>
          </div>
        `,
      });

      this.logger.log(`[✅] Đã gửi Email báo điểm thành công tới ${email}!`);
      return true; // Báo cho BullMQ biết là Job này đã hoàn thành (Completed)
      
    } catch (error) {
      this.logger.error(`[❌] Lỗi khi gửi email: ${error.message}`);
      throw error; // Nếu lỗi, báo cho BullMQ để nó đưa vào trạng thái Failed (thất bại)
    }
  }
}