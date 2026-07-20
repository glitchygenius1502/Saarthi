import { Router } from 'express';
import Doctor from '../models/Doctor';

const router = Router();

// GET /api/gyno/doctors?lat=..&lng=..&radius=50
// Returns gynecologists nearest to the given coordinates (with distance),
// or a general list if no coordinates are provided. Public (browsing).
router.get('/doctors', async (req, res) => {
  const lat = parseFloat(String(req.query.lat));
  const lng = parseFloat(String(req.query.lng));
  const radiusKm = req.query.radius ? parseFloat(String(req.query.radius)) : 100;
  const limit = req.query.limit ? Math.min(50, parseInt(String(req.query.limit), 10)) : 30;

  if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
    const doctors = await Doctor.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distanceMeters',
          spherical: true,
          maxDistance: radiusKm * 1000,
        },
      },
      { $limit: limit },
      {
        $addFields: {
          distanceKm: { $round: [{ $divide: ['$distanceMeters', 1000] }, 1] },
          lat: { $arrayElemAt: ['$location.coordinates', 1] },
          lng: { $arrayElemAt: ['$location.coordinates', 0] },
        },
      },
    ]);
    return res.json({ doctors, count: doctors.length, near: { lat, lng }, radiusKm });
  }

  // No coordinates: return a general list.
  const docs = await Doctor.find().limit(limit).lean();
  const doctors = docs.map((d: any) => ({
    ...d,
    lat: d.location?.coordinates?.[1],
    lng: d.location?.coordinates?.[0],
  }));
  return res.json({ doctors, count: doctors.length });
});

export default router;
