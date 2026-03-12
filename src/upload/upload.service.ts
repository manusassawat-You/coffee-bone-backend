import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.service';
import type { Express } from 'express';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'coffee-bone' },
          (error, res) => {
            if (error) {
              reject(new Error(error.message));
              return;
            }

            resolve(res as { secure_url: string });
          },
        );

        // ใช้ buffer ตรง ๆ
        stream.end(file.buffer);
      },
    );

    return {
      imageUrl: result.secure_url,
    };
  }
}
