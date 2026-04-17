import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Giúp LessonsModule mượn được Service này
})
export class CloudinaryModule {}