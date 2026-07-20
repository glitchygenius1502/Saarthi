import { Router } from 'express';
import Appointment from '../models/Appointment';
import { requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();

// Live gynecologist search — no seeding, no hardcoded doctors.
// Primary source: Google Places (real data + ratings) when GOOGLE_MAPS_API_KEY
// is configured. Fallback: OpenStreetMap Overpass (keyless) otherwise.

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface DoctorResult {
  id: string;
  name: string;
  clinic: string;
  speciality: string;
  isGyn: boolean;
  city: string;
  address: string;
  phone: string;
  timing: string;
  website: string;
  rating?: number;
  ratingCount?: number;
  lat: number;
  lng: number;
  distanceKm: number;
}

function isGynText(...parts: string[]): boolean {
  const s = parts.join(' ').toLowerCase();
  return /gyn|obstet|women|maternit|matern|prasuti|matru|fertil|ivf/.test(s);
}

async function geoapify(lat: number, lng: number, radiusM: number): Promise<DoctorResult[]> {
  const key = process.env.GEOAPIFY_API_KEY as string;
  const url =
    `https://api.geoapify.com/v2/places?categories=healthcare.clinic_or_praxis,healthcare.hospital` +
    `&filter=circle:${lng},${lat},${radiusM}&bias=proximity:${lng},${lat}&limit=80&apiKey=${key}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Geoapify ${resp.status}: ${await resp.text()}`);
  const json: any = await resp.json();
  return (json.features || [])
    .map((f: any): DoctorResult | null => {
      const p = f.properties || {};
      const plat = p.lat ?? f.geometry?.coordinates?.[1];
      const plng = p.lon ?? f.geometry?.coordinates?.[0];
      const name = p.name || p.address_line1;
      if (plat == null || plng == null || !name) return null;
      const raw = p.datasource?.raw || {};
      const spec = String(raw['healthcare:speciality'] || '');
      const isGyn = isGynText(name, spec, raw.healthcare || '');
      const isHospital = String(raw.amenity || raw.healthcare || '').includes('hospital');
      return {
        id: String(p.place_id || p.osm_id || `${plat},${plng}`),
        name,
        clinic: name,
        speciality: isGyn ? 'Obstetrician & Gynaecologist' : isHospital ? 'Hospital' : 'Clinic',
        isGyn,
        city: p.city || '',
        address: p.formatted || p.address_line2 || '',
        phone: raw.phone || raw['contact:phone'] || '',
        timing: raw.opening_hours || '',
        website: p.website || raw.website || raw['contact:website'] || '',
        lat: plat,
        lng: plng,
        distanceKm: Math.round(haversineKm(lat, lng, plat, plng) * 10) / 10,
      };
    })
    .filter((d: DoctorResult | null): d is DoctorResult => !!d)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 60);
}

async function googlePlaces(lat: number, lng: number, radiusM: number): Promise<DoctorResult[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY as string;
  const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.regularOpeningHours.weekdayDescriptions,places.websiteUri',
    },
    body: JSON.stringify({
      textQuery: 'gynecologist',
      locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: Math.min(radiusM, 50000) } },
      maxResultCount: 20,
    }),
  });
  if (!resp.ok) throw new Error(`Google Places ${resp.status}: ${await resp.text()}`);
  const json: any = await resp.json();
  return (json.places || [])
    .map((p: any): DoctorResult | null => {
      const plat = p.location?.latitude;
      const plng = p.location?.longitude;
      if (plat == null || plng == null) return null;
      const name = p.displayName?.text || 'Gynaecologist';
      return {
        id: p.id,
        name,
        clinic: name,
        speciality: 'Obstetrician & Gynaecologist',
        isGyn: true,
        city: '',
        address: p.formattedAddress || '',
        phone: p.nationalPhoneNumber || '',
        timing: p.regularOpeningHours?.weekdayDescriptions?.[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] || '',
        website: p.websiteUri || '',
        rating: p.rating,
        ratingCount: p.userRatingCount,
        lat: plat,
        lng: plng,
        distanceKm: Math.round(haversineKm(lat, lng, plat, plng) * 10) / 10,
      };
    })
    .filter(Boolean)
    .sort((a: DoctorResult, b: DoctorResult) => a.distanceKm - b.distanceKm);
}

async function overpass(lat: number, lng: number, radiusM: number): Promise<DoctorResult[]> {
  const q = `[out:json][timeout:20];
(
  nwr(around:${radiusM},${lat},${lng})["healthcare"="gynaecology"];
  nwr(around:${radiusM},${lat},${lng})["healthcare:speciality"~"gyn",i];
  nwr(around:${radiusM},${lat},${lng})["amenity"="doctors"]["name"];
  nwr(around:${radiusM},${lat},${lng})["amenity"="clinic"]["name"];
  nwr(around:${radiusM},${lat},${lng})["amenity"="hospital"]["name"];
);
out center 80;`;
  const resp = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'User-Agent': 'Saarthi-Health/1.0 (women health platform)',
    },
    body: 'data=' + encodeURIComponent(q),
  });
  if (!resp.ok) throw new Error(`Overpass ${resp.status}`);
  const json: any = await resp.json();
  const seen = new Set<string>();
  return (json.elements || [])
    .map((el: any): DoctorResult | null => {
      const dLat = el.lat ?? el.center?.lat;
      const dLng = el.lon ?? el.center?.lon;
      const tags = el.tags || {};
      if (dLat == null || dLng == null || !tags.name) return null;
      const spec = (tags['healthcare:speciality'] || '').toLowerCase();
      const isGyn = tags.healthcare === 'gynaecology' || spec.includes('gyn') || spec.includes('obstet');
      return {
        id: `${el.type}/${el.id}`,
        name: tags.name,
        clinic: tags.name,
        speciality: isGyn ? 'Obstetrician & Gynaecologist' : tags.amenity === 'hospital' ? 'Hospital' : 'Clinic',
        isGyn,
        city: tags['addr:city'] || '',
        address: tags['addr:full'] || [tags['addr:street'], tags['addr:city']].filter(Boolean).join(', '),
        phone: tags.phone || tags['contact:phone'] || '',
        timing: tags.opening_hours || '',
        website: tags.website || tags['contact:website'] || '',
        lat: dLat,
        lng: dLng,
        distanceKm: Math.round(haversineKm(lat, lng, dLat, dLng) * 10) / 10,
      };
    })
    .filter((d: DoctorResult | null): d is DoctorResult => {
      if (!d) return false;
      const key = d.name + d.lat;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 60);
}

// GET /api/gyno/doctors?lat=..&lng=..&radius=8
router.get('/doctors', async (req, res) => {
  const lat = parseFloat(String(req.query.lat));
  const lng = parseFloat(String(req.query.lng));
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: 'Share your location to find gynecologists near you.', doctors: [] });
  }
  const radiusKm = Math.min(50, req.query.radius ? parseFloat(String(req.query.radius)) : 10);
  const radiusM = Math.round(radiusKm * 1000);
  const source = process.env.GEOAPIFY_API_KEY
    ? 'geoapify'
    : process.env.GOOGLE_MAPS_API_KEY
      ? 'google'
      : 'osm';

  try {
    const doctors =
      source === 'geoapify'
        ? await geoapify(lat, lng, radiusM)
        : source === 'google'
          ? await googlePlaces(lat, lng, radiusM)
          : await overpass(lat, lng, radiusM);
    return res.json({ doctors, count: doctors.length, source, near: { lat, lng }, radiusKm });
  } catch (err: any) {
    console.error('[gyno] search error', err?.message || err);
    // If the primary provider fails, try the keyless fallback before giving up.
    if (source !== 'osm') {
      try {
        const doctors = await overpass(lat, lng, radiusM);
        return res.json({ doctors, count: doctors.length, source: 'osm-fallback', near: { lat, lng }, radiusKm });
      } catch {
        /* fall through */
      }
    }
    return res.status(502).json({ error: 'Could not reach the live directory right now. Please try again.', doctors: [] });
  }
});

// POST /api/gyno/appointments  (auth) — persist a booking request.
router.post('/appointments', requireAuth, async (req: AuthedRequest, res) => {
  const { doctorId, doctorName, clinic, address, date, time, mode } = req.body ?? {};
  if (!doctorName || !date || !time) {
    return res.status(400).json({ error: 'Doctor, date and time are required.' });
  }
  const appt = await Appointment.create({
    userId: req.user!.id,
    doctorId,
    doctorName,
    clinic,
    address,
    date,
    time,
    mode: mode || 'appointment',
  });
  return res.status(201).json({ appointment: appt });
});

// GET /api/gyno/appointments  (auth) — the user's booking requests.
router.get('/appointments', requireAuth, async (req: AuthedRequest, res) => {
  const appointments = await Appointment.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  return res.json({ appointments });
});

export default router;
