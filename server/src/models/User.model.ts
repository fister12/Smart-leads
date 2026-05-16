import { Schema, model } from 'mongoose';
import { IUser, UserRole } from '../types/user.types.js';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 80,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'salesUser'] as const,
      default: 'salesUser',
      required: true,
    } as { type: typeof String; enum: UserRole[]; default: UserRole; required: true },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>('User', userSchema);
