import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Module } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dopahdm3o',
      api_key: '361276384266578',
      api_secret: '1PvudQjBoG02CKeCjL6EYecJrPs',
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
        if (error) return reject(error);
        if (result && result.secure_url) {
           resolve(result?.secure_url);
        } else {
          reject(new Error('Không nhận được phản hồi từ Cloudinary'));
        }
      },
    );
    streamifier.createReadStream(file.buffer).pipe(upload);
  });
}
}