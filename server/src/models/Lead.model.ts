import { Schema, model } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types/lead.types.js';

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
      trim: true,
      match: /^[a-zA-Z\s]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      match: /^\+91\d{10}$/,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'lost'] as const,
      default: 'new',
      required: true,
    } as { type: typeof String; enum: LeadStatus[]; default: LeadStatus; required: true },
    source: {
      type: String,
      enum: ['website', 'instagram', 'referral'] as const,
      required: true,
    } as { type: typeof String; enum: LeadSource[]; required: true },
    notes: {
      type: String,
      maxlength: 500,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ name: 'text', email: 'text' });

export const Lead = model<ILead>('Lead', leadSchema);
