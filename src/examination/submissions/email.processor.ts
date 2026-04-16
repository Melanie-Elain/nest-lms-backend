import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`\n📬 [BullMQ] Nhận được job mới: Tên = ${job.name}, ID = ${job.id}`);

    try {
      // ==========================================
      // LOẠI 1: GỬI EMAIL BÁO ĐIỂM TRẮC NGHIỆM
      // ==========================================
      if (job.name === 'send-score-email') { // Tên này phải khớp với bên SubmissionsService
        const { email, submissionId, score } = job.data;
        this.logger.log(`Đang soạn Email báo điểm gửi tới: ${email}...`);

        await this.mailerService.sendMail({
          to: email, 
          subject: `[LMS] Kết quả bài thi trắc nghiệm (ID: ${submissionId})`,
          html: `
            <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #4CAF50;">Chúc mừng bạn đã hoàn thành bài thi!</h2>
              <h3 style="font-size: 24px;">Điểm số của bạn là: <span style="color: red;">${score}</span></h3>
              <p>Cảm ơn bạn đã sử dụng nền tảng học tập của chúng tôi.</p>
            </div>
          `,
        });
        this.logger.log(`[✅] Đã gửi Email báo điểm thành công tới ${email}!`);
      }

      // ==========================================
      // LOẠI 2: GỬI EMAIL CẤP CHỨNG CHỈ (BẠN VỪA THÊM)
      // ==========================================
      else if (job.name === 'send-certificate') {
        // Rút trích dữ liệu (Lưu ý: Bạn phải đảm bảo lúc .add() bên CoursesService có truyền email vào)
        const { email, courseId } = job.data; 
        
        this.logger.log(`Đang soạn Email cấp chứng chỉ gửi tới: ${email}...`);

        await this.mailerService.sendMail({
          to: email, 
          subject: `[LMS] 🎓 Chúc mừng bạn đã hoàn thành khóa học!`,
          html: `
            <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
              <h1 style="color: #FF9800;">🏆 CHÚC MỪNG BẠN! 🏆</h1>
              <p>Bạn đã hoàn thành xuất sắc 100% tiến độ của khóa học (ID: ${courseId}).</p>
              <p>Hệ thống đã ghi nhận kết quả và cấp chứng chỉ cho bạn.</p>
              <br/>
              <a href="http://localhost:3000/certificates" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xem Chứng Chỉ Của Bạn</a>
            </div>
          `,
        });
        this.logger.log(`[✅] Đã gửi Email chứng chỉ thành công tới ${email}!`);
      }

      // Có thể thêm nhiều else if khác sau này (Gửi mã OTP, Gửi thông báo quên mật khẩu...)
      else {
        this.logger.warn(`[⚠️] Không nhận diện được loại Job: ${job.name}`);
      }

      return true; 
      
    } catch (error) {
      this.logger.error(`[❌] Lỗi khi gửi email: ${error.message}`);
      throw error; 
    }
  }
}