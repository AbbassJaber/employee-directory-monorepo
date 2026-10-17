import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import S3Service from './s3Service';
import { NotFoundError } from '@/utils/errors';
import { STORAGE_DRIVER } from '@/utils/constants';

const prisma = new PrismaClient();

const ASSETS_PATH = '/api/v1/assets';

class AssetService {
    static createAsset = async (file: Express.Multer.File) => {
        if (process.env['STORAGE_DRIVER'] === STORAGE_DRIVER.DATABASE) {
            return AssetService.createDatabaseAsset(file);
        }

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

    // Keeps the image bytes in the database and serves them from the API,
    // for deployments without S3 (e.g. the live demo)
    static createDatabaseAsset = async (file: Express.Multer.File) => {
        const key = `${uuidv4()}${extname(file.originalname)}`;
        const url = `${ASSETS_PATH}/${key}`;

        return prisma.asset.create({
            data: {
                s3Key: key,
                s3Bucket: STORAGE_DRIVER.DATABASE,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                data: file.buffer,
                url,
                cloudFrontUrl: url,
            },
            select: { id: true },
        });
    };

    static getDatabaseAsset = async (key: string) => {
        const asset = await prisma.asset.findUnique({
            where: { s3Key: key },
            select: { mimeType: true, data: true },
        });

        if (!asset?.data) {
            throw new NotFoundError('Asset not found');
        }

        return { mimeType: asset.mimeType, data: asset.data };
    };

    static deleteAsset = async (assetId: number) => {
        const asset = await prisma.asset.findUnique({
            where: { id: assetId },
            select: { s3Key: true, s3Bucket: true },
        });

        if (!asset) {
            throw new NotFoundError('Asset not found');
        }

        if (asset.s3Bucket !== STORAGE_DRIVER.DATABASE) {
            await S3Service.deleteFile(asset.s3Key);
        }

        await prisma.asset.delete({
            where: { id: assetId },
        });
    };
}

export default AssetService;
