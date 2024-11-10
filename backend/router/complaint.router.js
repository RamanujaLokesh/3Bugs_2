import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { addComplaint, getComplaints } from '../controllers/complaint.controller.js';

const router = express.Router();

router.post('/add', protectRoute, addComplaint);

router.get('/fetch', protectRoute, getComplaints);

export default router;
