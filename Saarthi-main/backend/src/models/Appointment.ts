import mongoose, { Schema, InferSchemaType } from 'mongoose';

// A booking request a user made with a gynecologist / clinic.
const appointmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorId: { type: String },
    doctorName: { type: String, required: true },
    clinic: { type: String },
    address: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: ['call', 'video', 'appointment'], default: 'appointment' },
    status: { type: String, default: 'requested' },
  },
  { timestamps: true }
);

export type AppointmentDoc = InferSchemaType<typeof appointmentSchema>;
export const Appointment =
  mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
export default Appointment;
