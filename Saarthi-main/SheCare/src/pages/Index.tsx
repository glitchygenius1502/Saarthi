import React, { useState, useEffect } from 'react';
import { Bell, LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import WelcomeSection from '../components/WelcomeSection';
import PeriodTracker from '../components/PeriodTracker';
import CycleCalendar from '../components/CycleCalendar';
import CycleStatistics from '../components/CycleStatistics';
import CycleTips from '../components/CycleTips';
import QuickLog from '../components/QuickLog';
import TodayStatus from '../components/TodayStatus';
import Reminders from '../components/Reminders';
import { getToken, getUser, logout, goToLogin, shecareApi, Summary } from '../lib/api';

const Index = () => {
  const authed = !!getToken();
  const user = getUser();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reminders, setReminders] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('shecycle_reminders') || '[]');
    } catch {
      return [];
    }
  });

  const load = async () => {
    try {
      const s = await shecareApi.summary();
      setSummary(s);
    } catch {
      /* 401 redirects to the hub inside the api helper */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authed) {
      setLoading(false);
      goToLogin(); // open the hub "Get Started" popup, then return here
      return;
    }
    load();
    // Ask for notification permission so we can alert when a period is due.
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire an OS notification for each data-driven alert (when allowed).
  useEffect(() => {
    if (summary?.notifications?.length && 'Notification' in window && Notification.permission === 'granted') {
      summary.notifications.forEach((n) =>
        new Notification(`SheCycle+ · ${n.title}`, { body: n.message })
      );
    }
  }, [summary]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#fefaf6] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-[#9b7d65]">Taking you to sign in…</p>
        </div>
      </div>
    );
  }

  const periodStartDate = summary?.lastPeriodStart ? new Date(summary.lastPeriodStart) : null;
  const previousPeriodDate = null; // calendar highlights from the latest start
  const nextPeriodDate = summary?.nextPeriodDate ? new Date(summary.nextPeriodDate) : null;
  const currentDay = summary?.currentCycleDay ?? 0;
  const daysUntilNext = summary?.daysUntilNext ?? 0;
  const cycleHealth = summary?.regularityScore ?? 0;
  const currentPhase = summary?.phase ?? 'Unknown';
  const cycleLength = summary?.avgCycleLength ?? 28;
  const avgPeriodLength = summary?.avgPeriodLength ?? 5;
  const periodsLogged = summary?.totalPeriodsLogged ?? 0;

  // Logging a period start (from the calendar or Quick Log).
  const handleDateSelect = async (date: Date) => {
    try {
      await shecareApi.logPeriod({ startDate: new Date(date).toISOString() });
      await load();
    } catch {
      /* ignore */
    }
  };

  // Logging a mood (Quick Log / Today status).
  const handleLog = async (logData: any) => {
    if (!logData?.mood) return;
    try {
      await shecareApi.logMood({
        date: new Date(logData.date || Date.now()).toISOString(),
        mood: logData.mood,
        temperature: logData.temperature,
      });
      await load();
    } catch {
      /* ignore */
    }
  };

  const addReminder = (reminderData: any) => {
    const next = [...reminders, { id: Date.now(), ...reminderData }];
    setReminders(next);
    localStorage.setItem('shecycle_reminders', JSON.stringify(next));
  };

  const scrollToCalendar = () => {
    document.getElementById('calendar-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fefaf6]">
      <Navbar
        onCalendarClick={scrollToCalendar}
        userName={user?.name}
        onLogout={() => {
          logout();
          goToLogin();
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <WelcomeSection userName={user?.name} />

        {/* Data-driven notifications */}
        {summary?.notifications?.length ? (
          <div className="space-y-2">
            {summary.notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#fff2ea] border border-orange-200 rounded-xl px-4 py-3">
                <Bell className="w-5 h-5 text-[#9b5f42] mt-0.5" />
                <div>
                  <div className="font-semibold text-[#5c3b28]">{n.title}</div>
                  <div className="text-sm text-[#9b7d65]">{n.message}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {loading ? (
          <div className="text-center text-[#9b7d65] py-16">Loading your cycle…</div>
        ) : !summary?.hasData ? (
          <div className="bg-[#fff7f2] rounded-2xl p-8 border border-orange-100 text-center">
            <h3 className="text-xl font-semibold text-[#5c3b28] mb-2">Let’s start tracking 🌸</h3>
            <p className="text-[#9b7d65]">
              Log your most recent period below to see predictions, cycle progress and insights.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <PeriodTracker
              currentDay={currentDay}
              daysUntilNext={daysUntilNext}
              cycleHealth={cycleHealth}
              currentPhase={currentPhase}
              periodStartDate={periodStartDate}
              cycleLength={cycleLength}
            />

            <div id="calendar-section">
              <CycleCalendar
                periodStartDate={periodStartDate}
                previousPeriodDate={previousPeriodDate}
                onDateSelect={handleDateSelect}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                cycleLength={cycleLength}
              />
            </div>

            <CycleStatistics
              cycleHealth={cycleHealth}
              periodsLogged={periodsLogged}
              currentPhase={currentPhase}
              avgCycleLength={cycleLength}
              avgPeriodLength={avgPeriodLength}
            />

            <CycleTips currentPhase={currentPhase} />
          </div>

          <div className="space-y-6">
            <QuickLog onLog={handleLog} onDateSelect={handleDateSelect} cycleHealth={cycleHealth} />

            <TodayStatus
              currentDay={currentDay}
              cycleHealth={cycleHealth}
              currentPhase={currentPhase}
              onAddNote={handleLog}
            />

            <Reminders reminders={reminders} onAddReminder={addReminder} nextPeriodDate={nextPeriodDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
