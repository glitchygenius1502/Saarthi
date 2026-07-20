import mongoose, { Schema, InferSchemaType } from 'mongoose';

// One mood log for a user on a given day.
const moodEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    // Free-form mood label (e.g. "Happy", "Calm") so the UI can use its own set.
    mood: { type: String, required: true },
    emoji: { type: String },
    temperature: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

// One mood per user per day (upsert on re-log).
moodEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export type MoodEntryDoc = InferSchemaType<typeof moodEntrySchema>;
export const MoodEntry =
  mongoose.models.MoodEntry || mongoose.model('MoodEntry', moodEntrySchema);
export default MoodEntry;
