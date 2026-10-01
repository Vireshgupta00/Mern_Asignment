import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
  };
  summary: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  experience: Array<{ title: string; company: string; duration: string; description: string }>;
  skills: string[];
  projects: Array<{ title: string; description: string; link?: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'My Resume' },
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    linkedIn: { type: String }
  },
  summary: { type: String },
  education: [{ degree: String, institution: String, year: String }],
  experience: [{ title: String, company: String, duration: String, description: String }],
  skills: [{ type: String }],
  projects: [{ title: String, description: String, link: String }]
}, { timestamps: true });

export default mongoose.model<IResume>('Resume', ResumeSchema);
