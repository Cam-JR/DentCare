import express from 'express';
import { createAdmin } from '../controllers/superAdminController.js';
import { verifyToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/crear-admin', verifyToken, isSuperAdmin, createAdmin);

export default router;
