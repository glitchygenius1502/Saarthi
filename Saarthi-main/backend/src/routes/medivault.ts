import { Router } from 'express';
import Report from '../models/Report';
import HealthMetric from '../models/HealthMetric';
import Prescription from '../models/Prescription';
import { requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// ---------- Classification logic (authoritative, server-side) ----------

export function classifyBmi(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function classifyBp(systolic: number, diastolic: number): string {
  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive Crisis';
  if (systolic >= 140 || diastolic >= 90) return 'Hypertension Stage 2';
  if (systolic >= 130 || diastolic >= 80) return 'Hypertension Stage 1';
  if (systolic >= 120 && diastolic < 80) return 'Elevated';
  if (systolic < 120 && diastolic < 80) return 'Normal';
  return 'Elevated';
}

export function classifySugar(sugar: number, context: string): string {
  if (context === 'fasting') {
    if (sugar < 70) return 'Low';
    if (sugar < 100) return 'Normal';
    if (sugar < 126) return 'Prediabetes';
    return 'Diabetes';
  }
  // postmeal / random (post-load style thresholds)
  if (sugar < 70) return 'Low';
  if (sugar < 140) return 'Normal';
  if (sugar < 200) return 'Prediabetes';
  return 'Diabetes';
}

// ---------- Reports (uploaded files) ----------

const MAX_DATA_LEN = 5_200_000; // ~3.8MB file as base64

// POST /api/medivault/reports
router.post('/reports', async (req: AuthedRequest, res) => {
  const { name, category, mimeType, size, data, notes } = req.body ?? {};
  if (!name || !data) return res.status(400).json({ error: 'File name and data are required.' });
  if (typeof data !== 'string' || data.length > MAX_DATA_LEN) {
    return res.status(413).json({ error: 'File is too large. Please upload a file under ~3.5 MB.' });
  }
  const report = await Report.create({
    userId: req.user!.id,
    name,
    category: category || 'report',
    mimeType,
    size,
    data,
    notes,
  });
  // Don't echo the base64 back.
  const { data: _omit, ...meta } = report.toObject();
  return res.status(201).json({ report: meta });
});

// GET /api/medivault/reports  — metadata only (no file bytes)
router.get('/reports', async (req: AuthedRequest, res) => {
  const reports = await Report.find({ userId: req.user!.id }).select('-data').sort({ createdAt: -1 });
  return res.json({ reports });
});

// GET /api/medivault/reports/:id  — full file (for view/download)
router.get('/reports/:id', async (req: AuthedRequest, res) => {
  const report = await Report.findOne({ _id: req.params.id, userId: req.user!.id });
  if (!report) return res.status(404).json({ error: 'Not found' });
  return res.json({ report });
});

// DELETE /api/medivault/reports/:id
router.delete('/reports/:id', async (req: AuthedRequest, res) => {
  await Report.deleteOne({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

// ---------- Health metrics (readings for the dashboard) ----------

// POST /api/medivault/metrics
router.post('/metrics', async (req: AuthedRequest, res) => {
  const { type, weightKg, heightCm, systolic, diastolic, sugar, sugarContext, date } = req.body ?? {};
  if (!['weight', 'bp', 'sugar'].includes(type)) {
    return res.status(400).json({ error: 'type must be weight, bp or sugar.' });
  }

  const doc: any = { userId: req.user!.id, type, date: date ? new Date(date) : new Date() };

  if (type === 'weight') {
    if (weightKg == null) return res.status(400).json({ error: 'weightKg is required.' });
    doc.weightKg = Number(weightKg);
    if (heightCm) {
      doc.heightCm = Number(heightCm);
      const m = Number(heightCm) / 100;
      doc.bmi = Math.round((Number(weightKg) / (m * m)) * 10) / 10;
      doc.category = classifyBmi(doc.bmi);
    }
  } else if (type === 'bp') {
    if (systolic == null || diastolic == null) return res.status(400).json({ error: 'systolic and diastolic are required.' });
    doc.systolic = Number(systolic);
    doc.diastolic = Number(diastolic);
    doc.category = classifyBp(doc.systolic, doc.diastolic);
  } else {
    if (sugar == null) return res.status(400).json({ error: 'sugar is required.' });
    doc.sugar = Number(sugar);
    doc.sugarContext = sugarContext || 'random';
    doc.category = classifySugar(doc.sugar, doc.sugarContext);
  }

  const metric = await HealthMetric.create(doc);
  return res.status(201).json({ metric });
});

// GET /api/medivault/metrics?type=weight|bp|sugar
router.get('/metrics', async (req: AuthedRequest, res) => {
  const filter: any = { userId: req.user!.id };
  if (req.query.type) filter.type = String(req.query.type);
  const metrics = await HealthMetric.find(filter).sort({ date: 1 });
  return res.json({ metrics });
});

// ---------- Prescriptions / consultations ----------

// POST /api/medivault/prescriptions
router.post('/prescriptions', async (req: AuthedRequest, res) => {
  const { doctorName, speciality, date, medications, notes, reportId, reportName } = req.body ?? {};
  if (!doctorName) return res.status(400).json({ error: 'Doctor name is required.' });
  const rx = await Prescription.create({
    userId: req.user!.id,
    doctorName,
    speciality,
    date,
    medications: Array.isArray(medications) ? medications.filter(Boolean) : [],
    notes,
    reportId: reportId || undefined,
    reportName,
  });
  return res.status(201).json({ prescription: rx });
});

// GET /api/medivault/prescriptions
router.get('/prescriptions', async (req: AuthedRequest, res) => {
  const prescriptions = await Prescription.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  return res.json({ prescriptions });
});

// DELETE /api/medivault/prescriptions/:id
router.delete('/prescriptions/:id', async (req: AuthedRequest, res) => {
  await Prescription.deleteOne({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

export default router;
