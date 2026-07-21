import mongoose, { Schema, InferSchemaType } from 'mongoose';

// A prescription / consultation record a user added. May link to an uploaded
// file (the scanned prescription) via reportId.
const prescriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    doctorName: { type: String, required: true },
    speciality: { type: String },
    date: { type: String },
    medications: [{ type: String }],
    notes: { type: String },
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
    reportName: { type: String },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

prescriptionSchema.index({ userId: 1, createdAt: -1 });

export type PrescriptionDoc = InferSchemaType<typeof prescriptionSchema>;
export const Prescription =
  mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
