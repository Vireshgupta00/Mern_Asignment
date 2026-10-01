import mongoose, { Document, Schema } from 'mongoose';

export interface IConsultant extends Document {
  name: string;
  email: string;
  specialty: string;
  hourlyRate: number;
}

const ConsultantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialty: { type: String, required: true },
  hourlyRate: { type: Number, required: true }
});

export default mongoose.model<IConsultant>('Consultant', ConsultantSchema);
