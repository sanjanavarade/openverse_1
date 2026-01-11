import { Router } from 'express';
import practiceController from '../controllers/practice.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', practiceController.getPracticeProblems);
router.get('/:id', practiceController.getPracticeProblem);
router.post('/:id/submit', authenticateToken, practiceController.submitPracticeSolution);

export default router;
