import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';


export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null
    })
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};


export const addComment = async (req, res, next) => {
  try {
    const { content, parentComment } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null
    });

    
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      });
    }

    
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });

    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
