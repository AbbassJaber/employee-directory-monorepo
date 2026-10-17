import { Request, Response } from 'express';
import AssetService from '@/services/assetService';
import { asyncHandler } from '@/utils/errors';

class AssetController {
    static getAsset = asyncHandler(async (req: Request, res: Response) => {
        const asset = await AssetService.getDatabaseAsset(req.params['key']!);

        res.set('Content-Type', asset.mimeType);
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.status(200).send(Buffer.from(asset.data));
    });
}

export default AssetController;
