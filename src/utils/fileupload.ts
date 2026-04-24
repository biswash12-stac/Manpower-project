import { NextRequest } from 'next/server';
import cloudinary from '@/src/config/cloudnary';

export interface UploadedFile {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  size: number;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'gulf-empire'
): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${fileName}`,
        resource_type: 'auto',
        allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadedFile);
      }
    ).end(fileBuffer);
  });
}

export async function uploadMultipleToCloudinary(
  files: { buffer: Buffer; originalName: string }[],
  folder: string = 'gulf-empire'
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file =>
    uploadToCloudinary(file.buffer, file.originalName, folder)
  );
  return Promise.all(uploadPromises);
}

export function parseFormData(req: NextRequest): Promise<Record<string, any>> {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = await req.formData();
      const data: Record<string, any> = {};
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          // Handle file
          const buffer = Buffer.from(await value.arrayBuffer());
          data[key] = {
            buffer,
            originalName: (value as File).name,
            mimeType: value.type,
            size: value.size,
          };
        } else {
          // Handle text field
          data[key] = value;
        }
      }
      
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}