// // services/imageService.ts
// import { bucket } from './firebase.js';
// import sharp from 'sharp';
// import { v4 as uuidv4 } from 'uuid';

// // Define the Multer file interface explicitly if needed
// interface MulterFile {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   buffer: Buffer;
//   size: number;
// }

// export class ImageService {

//   async uploadImage(file: MulterFile): Promise<string> {
//     try {
//       // Generate unique filename
//       const fileName = `${uuidv4()}_${Date.now()}.jpg`;
//       const filePath = `images/${fileName}`;

//       // Process image (optional - compress and resize)
//       const processedImage = await sharp(file.buffer)
//         .resize(1200, 1200, { 
//           fit: 'inside', 
//           withoutEnlargement: true 
//         })
//         .jpeg({ quality: 85 })
//         .toBuffer();

//       // Create file reference
//       const fileRef = bucket.file(filePath);

//       // Upload the file
//       await fileRef.save(processedImage, {
//         metadata: {
//           contentType: 'image/jpeg',
//         }
//       });

//       // Make the file publicly accessible
//       await fileRef.makePublic();

//       // Return the public URL
//       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
//       return publicUrl;

//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw new Error('Failed to upload image');
//     }
//   }

//   async uploadMultipleImages(files: MulterFile[]): Promise<string[]> {
//     const uploadPromises = files.map(file => this.uploadImage(file));
//     return Promise.all(uploadPromises);
//   }

//   async deleteImage(imageUrl: string): Promise<void> {
//     try {
//       // Extract file path from URL
//       // Handle both formats: Firebase Storage URLs
//       let filePath = '';
      
//       if (imageUrl.includes('storage.googleapis.com')) {
//         // Format: https://storage.googleapis.com/bucket-name/images/filename
//         const urlParts = imageUrl.split('/');
//         const bucketIndex = urlParts.findIndex(part => part === bucket.name);
//         if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
//           filePath = urlParts.slice(bucketIndex + 1).join('/');
//         }
//       } else if (imageUrl.includes('firebasestorage.googleapis.com')) {
//         // Format: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Ffilename?alt=media&token=...
//         const url = new URL(imageUrl);
//         const pathParam = url.searchParams.get('o') || url.pathname.split('/o/')[1];
//         if (pathParam) {
//           filePath = decodeURIComponent(pathParam.split('?')[0]);
//         }
//       }

//       if (!filePath) {
//         throw new Error('Could not extract file path from URL');
//       }

//       await bucket.file(filePath).delete();
//     } catch (error) {
//       console.error('Error deleting image:', error);
//       if (error instanceof Error) {
//         throw new Error(`Failed to delete image: ${error.message}`);
//       } else {
//         throw new Error('Failed to delete image: Unknown error');
//       }
//     }
//   }

//   async deleteMultipleImages(imageUrls: string[]): Promise<void> {
//     const deletePromises = imageUrls.map(url => this.deleteImage(url));
    
//     // Use Promise.allSettled to handle individual failures
//     const results = await Promise.allSettled(deletePromises);
    
//     results.forEach((result, index) => {
//       if (result.status === 'rejected') {
//         console.error(`Failed to delete image ${imageUrls[index]}:`, result.reason);
//       }
//     });
//   }

//   // Method to validate image file types
//   validateImageFile(file: MulterFile): boolean {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     return allowedTypes.includes(file.mimetype);
//   }

//   // Method to validate file size (e.g., max 5MB)
//   validateFileSize(file: MulterFile, maxSizeInMB: number = 5): boolean {
//     const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
//     return file.size <= maxSizeInBytes;
//   }

//   // Method to validate multiple files
//   validateFiles(files: MulterFile[]): { valid: boolean; errors: string[] } {
//     const errors: string[] = [];
    
//     files.forEach((file, index) => {
//       if (!this.validateImageFile(file)) {
//         errors.push(`File ${index + 1}: Invalid file type. Only JPEG, PNG, and WebP are allowed.`);
//       }
      
//       if (!this.validateFileSize(file)) {
//         errors.push(`File ${index + 1}: File size too large. Maximum 5MB allowed.`);
//       }
//     });

//     return {
//       valid: errors.length === 0,
//       errors
//     };
//   }

//   // Method to get image metadata
//   async getImageMetadata(imageUrl: string): Promise<any> {
//     try {
//       let filePath = '';
      
//       if (imageUrl.includes('storage.googleapis.com')) {
//         const urlParts = imageUrl.split('/');
//         const bucketIndex = urlParts.findIndex(part => part === bucket.name);
//         if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
//           filePath = urlParts.slice(bucketIndex + 1).join('/');
//         }
//       }

//       if (!filePath) {
//         throw new Error('Could not extract file path from URL');
//       }

//       const fileRef = bucket.file(filePath);
//       const [metadata] = await fileRef.getMetadata();
      
//       return metadata;
//     } catch (error) {
//       console.error('Error getting image metadata:', error);
//       throw new Error('Failed to get image metadata');
//     }
//   }

//   // Method to check if image exists
//   async imageExists(imageUrl: string): Promise<boolean> {
//     try {
//       let filePath = '';
      
//       if (imageUrl.includes('storage.googleapis.com')) {
//         const urlParts = imageUrl.split('/');
//         const bucketIndex = urlParts.findIndex(part => part === bucket.name);
//         if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
//           filePath = urlParts.slice(bucketIndex + 1).join('/');
//         }
//       }

//       if (!filePath) {
//         return false;
//       }

//       const fileRef = bucket.file(filePath);
//       const [exists] = await fileRef.exists();
      
//       return exists;
//     } catch (error) {
//       console.error('Error checking if image exists:', error);
//       return false;
//     }
//   }
// }