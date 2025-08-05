import { PrismaClient } from '@prisma/client';
import S3Service from './s3Service';
import { NotFoundError } from '@/utils/errors';

const prisma = new PrismaClient();

class AssetService {
    static createAsset = async (file: Express.Multer.File) => {
        const uploadResult = await S3Service.uploadFile(file, 'profile-photos');
        const asset = await prisma.asset.create({
            data: {
                s3Key: uploadResult.s3Key,
                s3Bucket: process.env['AWS_S3_BUCKET']!,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: uploadResult.url,
                cloudFrontUrl: uploadResult.cloudFrontUrl,
            },
        });

        return asset;
    };

    static deleteAsset = async (assetId: number) => {
        const asset = await prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!asset) {
            throw new NotFoundError('Asset not found');
        }

        await S3Service.deleteFile(asset.s3Key);

        await prisma.asset.delete({
            where: { id: assetId },
        });
    };
}

export default AssetService;
