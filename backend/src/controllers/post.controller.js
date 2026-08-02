import Post from '../models/Post.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';


export const getPosts = async (req, res, next) => {
  try {
    const { tag, search, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (tag) query.tags = tag.toLowerCase();
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};


export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar bio');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    next(error);
  }
};


export const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, tags, isFeatured } = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      coverImage,
      tags: tags || [],
      isFeatured: isFeatured || false,
      author: req.user._id
    });

    
    if (tags && tags.length > 0) {
      const followers = await User.find({ followedTopics: { $in: tags } });
      const notifications = followers.map(user => ({
        recipient: user._id,
        type: 'new_post',
        message: `New post in "${tags[0]}": ${title}`,
        post: post._id
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    const populated = await post.populate('author', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};


export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { title, content, excerpt, coverImage, tags, isPublished, isFeatured } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) post.tags = tags;
    if (isPublished !== undefined) post.isPublished = isPublished;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;

    const updated = await post.save();
    await updated.populate('author', 'name avatar');
    res.json(updated);
  } catch (error) {
    next(error);
  }
};


export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};


export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }
    post.likeCount = post.likes.length;
    await post.save();

    res.json({ liked: !alreadyLiked, likeCount: post.likeCount });
  } catch (error) {
    next(error);
  }
};


export const toggleSave = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;
    const alreadySaved = user.savedPosts.includes(postId);

    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
      user.savedPosts.push(postId);
    }
    await user.save();

    res.json({ saved: !alreadySaved, savedPosts: user.savedPosts });
  } catch (error) {
    next(error);
  }
};


export const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isPublished: true, isFeatured: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
