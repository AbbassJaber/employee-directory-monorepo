import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

const s3 = new AWS.S3({
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] as string,
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] as string,
    region: process.env['AWS_REGION'] as string,
});

const BUCKET_NAME = process.env['AWS_S3_BUCKET']!;
const CLOUDFRONT_DOMAIN = process.env['AWS_CLOUDFRONT_DOMAIN']!;

export interface UploadResult {
    s3Key: string;
    url: string;
    cloudFrontUrl: string;
}

class S3Service {
    static uploadFile = async (
        file: Express.Multer.File,
        folder: string = 'uploads'
    ): Promise<UploadResult> => {
        const fileExtension = extname(file.originalname);
        const fileName = `${folder}/${uuidv4()}${fileExtension}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const result = await s3.upload(uploadParams).promise();

        return {
            s3Key: fileName,
            url: result.Location,
            cloudFrontUrl: `https://${CLOUDFRONT_DOMAIN}/${fileName}`,
        };
    };

    static deleteFile = async (s3Key: string): Promise<void> => {
        const deleteParams = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
        };

        await s3.deleteObject(deleteParams).promise();
    };
}

export default S3Service;
