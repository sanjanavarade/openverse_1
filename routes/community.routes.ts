import { Router } from 'express';
import communityController from '../controllers/community.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/posts', communityController.getPosts);
router.get('/posts/:id', communityController.getPost);
router.post('/posts', authenticateToken, communityController.createPost);
router.post('/posts/:id/like', authenticateToken, communityController.likePost);
router.post('/posts/:id/comments', authenticateToken, communityController.addComment);
router.delete('/posts/:id', authenticateToken, communityController.deletePost);

router.get('/events', communityController.getEvents);
router.get('/events/:id', communityController.getEvent);

router.get('/mentors', communityController.getMentors);
router.post('/mentors/register', authenticateToken, communityController.registerMentor);
router.post('/mentors/:id/reviews', authenticateToken, communityController.addMentorReview);

export default router; // 🔥 THIS LINE IS CRITICAL
