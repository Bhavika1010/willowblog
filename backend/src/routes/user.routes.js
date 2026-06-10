import express from 'express';
import {
  getProfile,
  updateProfile,
  toggleFollowTopic,
  getSavedPosts,
  getAllUsers
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/follow-topic', protect, toggleFollowTopic);
router.get('/saved', protect, getSavedPosts);
router.get('/', protect, adminOnly, getAllUsers);

export default router;
