import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../database/models/userModel';
import { AuthRequest, LoginBody, RegisterBody } from '../models/User';

/** POST /api/users/register */
export const registerUser: RequestHandler<{}, {}, RegisterBody> = asyncHandler(
  async (req, res): Promise<void> => {
    const { username, firstname, lastname, email, password } = req.body;

    /* Basic input validation */
    if (!username || !firstname || !lastname || !email || !password) {
      res.status(400).json({ message: 'All fields are mandatory' });
      return;
    }

    /* Uniqueness check */
    try {
      const existing = await UserModel.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
    } catch (err) {
      console.error('[registerUser] findOne error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    /* Create user */
    let user;
    try {
      user = await UserModel.create({ username, firstname, lastname, email, password });
    } catch (err) {
      console.error('[registerUser] create error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    /* Response */
    res.status(201).json({
      _id:       user._id,
      username:  user.username,
      firstname: user.firstname,
      lastname:  user.lastname,
      email:     user.email,
      token:     UserModel.signToken(user._id.toString()),
    });
  }
);

/** POST /api/users/login */
export const loginUser: RequestHandler<{}, {}, LoginBody> = asyncHandler(
  async (req, res): Promise<void> => {
    const { username, password } = req.body;

    /* Fetch user */
    let user;
    try {
      user = await UserModel.findOne({ username }).select('+password');
    } catch (err) {
      console.error('[loginUser] findOne error:', err);
      res.status(500).json({ message: 'Database error' });
      return;
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    /* Verify password */
    let isMatch: boolean;
    try {
      isMatch = await user.comparePassword(password);
    } catch (err) {
      console.error('[loginUser] comparePassword error:', err);
      res.status(500).json({ message: 'Authentication error' });
      return;
    }

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    /* Response */
    res.json({
      _id:       user._id,
      username:  user.username,
      firstname: user.firstname,
      lastname:  user.lastname,
      email:     user.email,
      token:     UserModel.signToken(user._id.toString()),
    });
  }
);


/** GET /api/users/me */
export const getCurrentUser: RequestHandler = asyncHandler(
  async (req: AuthRequest, res): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    res.json(req.user);
  }
);
