import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { requireAuth } from '@career-platform/shared';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);

export default router;
