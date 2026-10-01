import { Router } from 'express';
import { createSession, sendMessage, getSession, getSessions, renameSession, deleteSession } from '../controllers/chat.controller';
import { requireAuth } from '@career-platform/shared';

const router = Router();

router.post('/sessions', requireAuth, createSession);
router.get('/sessions', requireAuth, getSessions);
router.get('/sessions/:id', requireAuth, getSession);
router.put('/sessions/:id', requireAuth, renameSession);
router.delete('/sessions/:id', requireAuth, deleteSession);
router.post('/sessions/:id/messages', requireAuth, sendMessage);

export default router;
