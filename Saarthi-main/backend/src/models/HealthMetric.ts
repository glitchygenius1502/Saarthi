import mongoose, { Schema, InferSchemaType } from 'mongoose';

// A single health reading a user logged. `type` decides which fields matter:
//   weight -> weightKg (+ optional heightCm, bmi)
//   bp     -> systolic, diastolic
//   sugar  -> sugar (mg/dL), sugarContext (fasting/random/postmeal)
const healthMetricSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['weight', 'bp', 'sugar'], required: true },
    date: { type: Date, default: Date.now },

    weightKg: Number,
    heightCm: Number,
    bmi: Number,

    systolic: Number,
    diastolic: Number,

    sugar: Number,
    sugarContext: { type: String, enum: ['fasting', 'random', 'postmeal'] },

    category: String, // computed classification label
  },
  { timestamps: true }
);

healthMetricSchema.index({ userId: 1, type: 1, date: 1 });

export type HealthMetricDoc = InferSchemaType<typeof healthMetricSchema>;
export const HealthMetric =
  mongoose.models.HealthMetric || mongoose.model('HealthMetric', healthMetricSchema);
export default HealthMetric;
