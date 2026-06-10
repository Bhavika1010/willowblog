import express from 'express';
import { getComments, addComment, deleteComment } from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { addCommentSchema } from '../validators/comment.validator.js';

const router = express.Router();

router.get('/:postId', getComments);
router.post('/:postId', protect, validate(addCommentSchema), addComment);
router.delete('/:id', protect, deleteComment);

export default router;
