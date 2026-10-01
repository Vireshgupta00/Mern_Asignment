import { Router } from 'express';
import { requireAuth } from '@career-platform/shared';
import { getConsultants, createBooking } from '../controllers/booking.controller';

const router = Router();

router.get('/consultants', requireAuth, getConsultants);
router.post('/', requireAuth, createBooking);

export default router;
