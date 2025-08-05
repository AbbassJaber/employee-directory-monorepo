import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import MiscellaneousController from '@/controllers/miscellaneousController';

const router = Router();

router.get(
    '/permissions',
    authenticate,
    MiscellaneousController.getPermissions
);

router.get(
    '/departments',
    authenticate,
    MiscellaneousController.getDepartments
);

router.get('/locations', authenticate, MiscellaneousController.getLocations);

export default router;
