import { Router } from 'express';
import cms from './cms';

const router = new Router();

router.use('/cms', cms);

export default router;
