import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
