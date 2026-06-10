import express from 'express';
import {
  getProfile,
  updateProfile,
  toggleFollowTopic,
  getSavedPosts,
  getAllUsers
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema, followTopicSchema } from '../validators/user.validator.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/follow-topic', protect, validate(followTopicSchema), toggleFollowTopic);
router.get('/saved', protect, getSavedPosts);
router.get('/', protect, adminOnly, getAllUsers);

export default router;
