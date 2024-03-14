import mongoose, { Schema, Document } from 'mongoose';

export interface UserDoc extends Document {
  chatId: number;
  userId?: number;
  userName?: string;
  firstName: string;
  lastName?: string;
}

export const userSchema: Schema = new mongoose.Schema<UserDoc>(
  {
    chatId: { type: Number, required: true },
    userId: { type: Number, required: false },
    userName: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
  },
  { timestamps: true },
);

export const User = mongoose.model<UserDoc>('User', userSchema);
