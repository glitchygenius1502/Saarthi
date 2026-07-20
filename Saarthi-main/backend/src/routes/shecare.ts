import { Router } from 'express';
import PeriodEntry from '../models/PeriodEntry';
import MoodEntry from '../models/MoodEntry';
import { requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// ---- Periods ----

// GET /api/shecare/periods
router.get('/periods', async (req: AuthedRequest, res) => {
  const periods = await PeriodEntry.find({ userId: req.user!.id }).sort({ startDate: -1 });
  res.json({ periods });
});

// POST /api/shecare/periods  { startDate, endDate?, flow?, notes? }
router.post('/periods', async (req: AuthedRequest, res) => {
  const { startDate, endDate, flow, notes } = req.body ?? {};
  if (!startDate) return res.status(400).json({ error: 'startDate is required' });
  const entry = await PeriodEntry.create({
    userId: req.user!.id,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : undefined,
    flow,
    notes,
  });
  res.status(201).json({ period: entry });
});

// DELETE /api/shecare/periods/:id
router.delete('/periods/:id', async (req: AuthedRequest, res) => {
  await PeriodEntry.deleteOne({ _id: req.params.id, userId: req.user!.id });
  res.json({ ok: true });
});

// ---- Moods ----

// GET /api/shecare/moods
router.get('/moods', async (req: AuthedRequest, res) => {
  const moods = await MoodEntry.find({ userId: req.user!.id }).sort({ date: -1 }).limit(180);
  res.json({ moods });
});

// POST /api/shecare/moods  { date, mood, note? }  (one per day, upserts)
router.post('/moods', async (req: AuthedRequest, res) => {
  const { date, mood, note } = req.body ?? {};
  if (!date || !mood) return res.status(400).json({ error: 'date and mood are required' });
  const day = startOfDay(new Date(date));
  const entry = await MoodEntry.findOneAndUpdate(
    { userId: req.user!.id, date: day },
    { userId: req.user!.id, date: day, mood, note },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ mood: entry });
});

// ---- Summary / prediction ----

// GET /api/shecare/summary
router.get('/summary', async (req: AuthedRequest, res) => {
  const periods = await PeriodEntry.find({ userId: req.user!.id }).sort({ startDate: 1 });

  if (periods.length === 0) {
    return res.json({ hasData: false, notifications: [], recentMoods: [] });
  }

  // Average cycle length from consecutive start dates.
  const starts = periods.map((p: any) => new Date(p.startDate).getTime());
  let avgCycle = 28;
  let regularityScore = 70; // neutral default until we have enough history
  if (starts.length >= 2) {
    const gaps: number[] = [];
    for (let i = 1; i < starts.length; i++) gaps.push((starts[i] - starts[i - 1]) / DAY);
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    if (mean >= 18 && mean <= 45) avgCycle = Math.round(mean);
    // Regularity: lower spread between cycles => higher score.
    const variance = gaps.reduce((a, b) => a + (b - mean) ** 2, 0) / gaps.length;
    const stdev = Math.sqrt(variance);
    regularityScore = Math.max(45, Math.min(98, Math.round(100 - stdev * 6)));
  }

  // Average period (bleeding) length where endDate is known.
  const lengths = periods
    .filter((p: any) => p.endDate)
    .map((p: any) => (new Date(p.endDate).getTime() - new Date(p.startDate).getTime()) / DAY + 1);
  const avgPeriodLength = lengths.length
    ? Math.max(1, Math.round(lengths.reduce((a: number, b: number) => a + b, 0) / lengths.length))
    : 5;

  const last = periods[periods.length - 1] as any;
  const lastStart = startOfDay(new Date(last.startDate));
  const today = startOfDay(new Date());

  const nextPeriodDate = new Date(lastStart.getTime() + avgCycle * DAY);
  const daysUntilNext = Math.round((nextPeriodDate.getTime() - today.getTime()) / DAY);
  const currentCycleDay = Math.floor((today.getTime() - lastStart.getTime()) / DAY) + 1;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentCycleDay / avgCycle) * 100)));

  // Cycle phase.
  const ovulationDay = avgCycle - 14;
  let phase = 'Follicular';
  if (currentCycleDay <= avgPeriodLength) phase = 'Menstrual';
  else if (Math.abs(currentCycleDay - ovulationDay) <= 1) phase = 'Ovulation';
  else if (currentCycleDay > ovulationDay + 1) phase = 'Luteal';

  // Fertile window (approx): ovulation +/- a few days.
  const fertileStart = new Date(lastStart.getTime() + (ovulationDay - 4) * DAY);
  const fertileEnd = new Date(lastStart.getTime() + (ovulationDay + 1) * DAY);

  // Notifications derived from the data.
  const notifications: { type: string; title: string; message: string }[] = [];
  if (daysUntilNext < 0) {
    notifications.push({
      type: 'period',
      title: 'Period overdue',
      message: `Your period is ${Math.abs(daysUntilNext)} day(s) late. Consider logging it or checking in with a doctor if this is unusual.`,
    });
  } else if (daysUntilNext === 0) {
    notifications.push({ type: 'period', title: 'Period expected today', message: 'Your next period is expected today. Take care! 🌸' });
  } else if (daysUntilNext <= 3) {
    notifications.push({ type: 'period', title: 'Period coming soon', message: `Your period is expected in ${daysUntilNext} day(s). Keep supplies handy.` });
  }
  if (today >= startOfDay(fertileStart) && today <= startOfDay(fertileEnd)) {
    notifications.push({ type: 'fertile', title: 'Fertile window', message: 'You are likely in your fertile window.' });
  }

  const recentMoods = await MoodEntry.find({ userId: req.user!.id }).sort({ date: -1 }).limit(7);

  res.json({
    hasData: true,
    avgCycleLength: avgCycle,
    avgPeriodLength,
    regularityScore,
    lastPeriodStart: lastStart,
    nextPeriodDate,
    daysUntilNext,
    currentCycleDay: Math.max(1, currentCycleDay),
    progressPercent,
    phase,
    fertileWindow: { start: fertileStart, end: fertileEnd },
    totalPeriodsLogged: periods.length,
    notifications,
    recentMoods,
  });
});

export default router;
