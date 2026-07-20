import mongoose, { Schema, InferSchemaType } from 'mongoose';

// One logged menstrual period for a user.
const periodEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // optional; may still be ongoing
    flow: { type: String, enum: ['light', 'medium', 'heavy'], default: 'medium' },
    notes: { type: String },
  },
  { timestamps: true }
);

periodEntrySchema.index({ userId: 1, startDate: -1 });

export type PeriodEntryDoc = InferSchemaType<typeof periodEntrySchema>;
export const PeriodEntry =
  mongoose.models.PeriodEntry || mongoose.model('PeriodEntry', periodEntrySchema);
export default PeriodEntry;
