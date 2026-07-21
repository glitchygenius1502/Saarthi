import mongoose, { Schema, InferSchemaType } from 'mongoose';

// An uploaded medical file (report / prescription / scan / x-ray), stored as a
// base64 data URL directly in MongoDB. Kept small (capped in the route) so it
// fits a document and the serverless request limit.
const reportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['report', 'prescription', 'scan', 'xray', 'other'],
      default: 'report',
    },
    mimeType: { type: String },
    size: { type: Number },
    data: { type: String, required: true }, // base64 data URL
    notes: { type: String },
  },
  { timestamps: true }
);

reportSchema.index({ userId: 1, createdAt: -1 });

export type ReportDoc = InferSchemaType<typeof reportSchema>;
export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
