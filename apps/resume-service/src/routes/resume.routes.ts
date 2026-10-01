import { Router } from 'express';
import { getResumes, createResume, getResumeById, generateAIResume } from '../controllers/resume.controller';
import { requireAuth } from '@career-platform/shared';

const router = Router();

router.get('/', requireAuth, getResumes);
router.post('/', requireAuth, createResume);
router.get('/:id', requireAuth, getResumeById);
router.post('/generate', requireAuth, generateAIResume); // Fulfills AI Generation Flow

export default router;