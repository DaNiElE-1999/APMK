import { NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { UserModel } from '../database/models/userModel';
import { AuthRequest } from '../models/User';

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token found in the request' });
      return;
    }

    try {
      const token   = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const user = await UserModel.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      req.user = {
        _id:       user._id.toString(),
        username:  user.username,
        firstname: user.firstname,
        lastname:  user.lastname,
        email:     user.email,
        role:      user.role,
      };
      next();
    } catch (err) {
      console.error('[protect] token error:', err);
      res.status(401).json({ message: 'Token invalid' });
    }
  }
);

