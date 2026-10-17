import express from 'express';
import authRouter from './auth';
import employeeRouter from './employees';
import miscRouter from './miscellaneous';
import assetRouter from './assets';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/employees', employeeRouter);
router.use('/misc', miscRouter);
router.use('/assets', assetRouter);

export default router;
