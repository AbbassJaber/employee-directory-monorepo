import { Router } from 'express';
import AssetController from '@/controllers/assetController';

const router = Router();

// Public, like the CloudFront URLs: <img> tags cannot send the access token
router.get('/:key', AssetController.getAsset);

export default router;
