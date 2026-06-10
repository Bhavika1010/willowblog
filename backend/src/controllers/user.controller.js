import User from '../models/User.model.js';
import Post from '../models/Post.model.js';
import Notification from '../models/Notification.model.js';


export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedPosts', 'title excerpt tags likeCount commentCount createdAt');
    res.json(user);
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, bio, avatar } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};


export const toggleFollowTopic = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic required' });

    const user = await User.findById(req.user._id);
    const normalizedTopic = topic.toLowerCase();
    const isFollowing = user.followedTopics.includes(normalizedTopic);

    if (isFollowing) {
      user.followedTopics = user.followedTopics.filter(t => t !== normalizedTopic);
    } else {
      user.followedTopics.push(normalizedTopic);
    }
    await user.save();

    res.json({
      following: !isFollowing,
      followedTopics: user.followedTopics
    });
  } catch (error) {
    next(error);
  }
};


export const getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedPosts',
        populate: { path: 'author', select: 'name avatar' }
      });
    res.json(user.savedPosts);
  } catch (error) {
    next(error);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};
