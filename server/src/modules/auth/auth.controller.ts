import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { apiResponse } from '../../utils/apiResponse.js';
import { config } from '../../config/env.js';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body;
    const user = await AuthService.register(name, email, password, role);
    res.status(201).json(apiResponse.success(user));
  });

  static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.cookie('refreshToken', result.user._id, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      apiResponse.success({
        user: result.user,
        accessToken: result.accessToken,
      })
    );
  });

  static refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json(apiResponse.error('No refresh token provided'));
      return;
    }

    const result = await AuthService.refresh(refreshToken);
    res.status(200).json(apiResponse.success({ accessToken: result.accessToken }));
  });

  static logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
      await AuthService.logout(req.user.userId);
    }
    res.clearCookie('refreshToken');
    res.status(200).json(apiResponse.success({ message: 'Logged out successfully' }));
  });

  static getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json(apiResponse.error('User not authenticated'));
      return;
    }

    const user = await AuthService.getCurrentUser(req.user.userId);
    res.status(200).json(apiResponse.success(user));
  });
}
