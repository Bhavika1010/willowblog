import User from '../models/User.model.js';
import Post from '../models/Post.model.js';
import Notification from '../models/Notification.model.js';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedPosts', 'title excerpt tags likeCount commentCount createdAt');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, bio, avatar } = req.body;
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow / Unfollow a topic
// @route   POST /api/users/follow-topic
export const toggleFollowTopic = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved posts
// @route   GET /api/users/saved
export const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedPosts',
        populate: { path: 'author', select: 'name avatar' }
      });
    res.json(user.savedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
