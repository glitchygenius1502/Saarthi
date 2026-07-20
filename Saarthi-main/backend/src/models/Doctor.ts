import mongoose, { Schema, InferSchemaType } from 'mongoose';

// A gynecologist with a geospatial location for "near me" queries.
const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    speciality: { type: String, default: 'Obstetrician & Gynecologist' },
    clinic: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    address: { type: String },
    phone: { type: String },
    rating: { type: Number, default: 4.5 },
    experienceYears: { type: Number },
    timing: { type: String, default: '10 AM - 6 PM' },
    // GeoJSON Point: [longitude, latitude]
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

doctorSchema.index({ location: '2dsphere' });

export type DoctorDoc = InferSchemaType<typeof doctorSchema>;
export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
