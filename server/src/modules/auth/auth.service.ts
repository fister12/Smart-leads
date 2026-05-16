import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { User } from '../../models/User.model.js';
import { IUser, IUserResponse, JWTPayload, UserRole } from '../../types/user.types.js';
import { AppError } from '../../utils/AppError.js';

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
    role: UserRole = 'salesUser'
  ): Promise<IUserResponse> {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      refreshToken: null,
    });

    return this.formatUserResponse(user);
  }

  static async login(email: string, password: string): Promise<{ user: IUserResponse; accessToken: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      config.jwtSecret as string,
      { expiresIn: config.jwtExpiry as any }
    );

    const refreshToken = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      config.jwtRefreshSecret as string,
      { expiresIn: config.jwtRefreshExpiry as any }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: this.formatUserResponse(user),
      accessToken,
    };
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as JWTPayload;

      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const accessToken = jwt.sign(
        { userId: user._id.toString(), email: user.email, role: user.role },
        config.jwtSecret as string,
        { expiresIn: config.jwtExpiry as any }
      );

      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  static async getCurrentUser(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.formatUserResponse(user);
  }

  private static formatUserResponse(user: IUser): IUserResponse {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
