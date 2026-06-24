import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCompanyAccount } from '../controllers/companyApiController.js';

const router = express.Router();

router.use(protect);

// GET /api/company/account/:loginId
router.get('/account/:loginId', getCompanyAccount);

export default router;
