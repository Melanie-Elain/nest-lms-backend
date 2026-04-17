import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    // 1. Lấy và làm sạch dữ liệu từ .env (xóa dấu cách thừa)
    const cloudName = this.configService.get<string>('CLOUDINARY_NAME')?.trim();
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY')?.trim();
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')?.trim();

    // 2. In log để Hồng kiểm tra (Chỉ in 4 số cuối API_KEY để bảo mật)
    this.logger.log(`Cloudinary Config: Name=${cloudName}, Key=...${apiKey?.slice(-4)}`);

    // 3. Cấu hình Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          access_mode: 'public',
          type: 'upload',
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            return reject(error);
          }
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Không nhận được phản hồi từ Cloudinary'));
          }
        },
      );

      // Đẩy file buffer lên Cloudinary
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}