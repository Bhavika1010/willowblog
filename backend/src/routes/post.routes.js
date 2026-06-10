import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  getFeaturedPosts
} from '../controllers/post.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:id', getPost);

router.post('/', protect, adminOnly, createPost);
router.put('/:id', protect, adminOnly, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);

export default router;
