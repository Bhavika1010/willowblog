import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      savedPosts: user.savedPosts,
      followedTopics: user.followedTopics,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      savedPosts: user.savedPosts,
      followedTopics: user.followedTopics,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};


export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedPosts', 'title excerpt tags createdAt');
    res.json(user);
  } catch (error) {
    next(error);
  }
};


export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = hashToken(rawToken);
      user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
      // TODO: send this via a real email provider. Logged for now since no email service is wired up.
      console.log(`Password reset link for ${email}: ${resetUrl}`);
    }

    // Always respond the same way so existing emails can't be enumerated.
    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};
