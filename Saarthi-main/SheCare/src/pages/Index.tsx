import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WelcomeSection from '../components/WelcomeSection';
import PeriodTracker from '../components/PeriodTracker';
import CycleCalendar from '../components/CycleCalendar';
import CycleStatistics from '../components/CycleStatistics';
import CycleTips from '../components/CycleTips';
import QuickLog from '../components/QuickLog';
import TodayStatus from '../components/TodayStatus';
import Reminders from '../components/Reminders';
import { differenceInDays, addDays, format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

const Index = () => {
  const [periodStartDate, setPeriodStartDate] = useState(null);
  const [previousPeriodDate, setPreviousPeriodDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPeriodDate = localStorage.getItem('periodStartDate');
    const savedPreviousDate = localStorage.getItem('previousPeriodDate');
    const savedLogs = localStorage.getItem('periodLogs');
    const savedReminders = localStorage.getItem('reminders');

    if (savedPeriodDate) {
      setPeriodStartDate(new Date(savedPeriodDate));
    }
    if (savedPreviousDate) {
      setPreviousPeriodDate(new Date(savedPreviousDate));
    }
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (periodStartDate) {
      localStorage.setItem('periodStartDate', periodStartDate.toISOString());
    }
  }, [periodStartDate]);

  useEffect(() => {
    if (previousPeriodDate) {
      localStorage.setItem('previousPeriodDate', previousPeriodDate.toISOString());
    }
  }, [previousPeriodDate]);

  useEffect(() => {
    localStorage.setItem('periodLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const getCurrentPhase = () => {
    if (!periodStartDate) return 'Unknown';
    const today = new Date();
    const daysSinceStart = differenceInDays(today, periodStartDate);

    if (daysSinceStart >= 0 && daysSinceStart <= 6) return 'Menstrual';
    if (daysSinceStart >= 7 && daysSinceStart <= 13) return 'Follicular';
    if (daysSinceStart === 14) return 'Ovulation';
    if (daysSinceStart >= 15 && daysSinceStart <= 28) return 'Luteal';
  
    const cycleDay = (daysSinceStart % 28) + 1;

    if (cycleDay >= 1 && cycleDay <= 7) return 'Menstrual';
    if (cycleDay >= 8 && cycleDay <= 13) return 'Follicular';
    if (cycleDay === 14) return 'Ovulation';
    if (cycleDay >= 15 && cycleDay <= 28) return 'Luteal';

    return 'Follicular'; // Default fallback
  };

  const getCycleDay = () => {
    if (!periodStartDate) return 0;
    const today = new Date();
     return differenceInDays(today, periodStartDate) + 1;
    const daysSinceStart = differenceInDays(today, periodStartDate);
    return (daysSinceStart % 28) + 1;
  };

  const getDaysUntilNext = () => {
    if (!periodStartDate) return 0;
    const nextPeriod = addDays(periodStartDate, 28);
    const today = new Date();
    const daysUntil = differenceInDays(nextPeriod, today);
    return daysUntil > 0 ? daysUntil : 0;
  };

  const getCycleHealth = () => {
    const regularityScore = logs.length > 3 ? 92 : 60;
    return regularityScore;
  };

  const handleDateSelect = (date) => {
    // If selecting a date in a different month, save current period as previous
    if (periodStartDate && !isSameMonth(date, periodStartDate)) {
      setPreviousPeriodDate(periodStartDate);
    }
    
    setPeriodStartDate(date);
  };

  const addLog = (logData) => {
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...logData
    };
    setLogs([...logs, newLog]);
  };

  const addReminder = (reminderData) => {
    const newReminder = {
      id: Date.now(),
      ...reminderData
    };
    setReminders([...reminders, newReminder]);
  };

  const scrollToCalendar = () => {
    document.getElementById('calendar-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-[#fefaf6]">
      <Navbar onCalendarClick={scrollToCalendar} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <WelcomeSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <PeriodTracker 
              currentDay={getCycleDay()}
              daysUntilNext={getDaysUntilNext()}
              cycleHealth={getCycleHealth()}
              currentPhase={getCurrentPhase()}
              periodStartDate={periodStartDate}
            />
            
            <div id="calendar-section">
              <CycleCalendar 
                periodStartDate={periodStartDate}
                previousPeriodDate={previousPeriodDate}
                onDateSelect={handleDateSelect}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            </div>
            
            <CycleStatistics 
              cycleHealth={getCycleHealth()}
              periodsLogged={logs.length}
              currentPhase={getCurrentPhase()}
            />
            
            <CycleTips currentPhase={getCurrentPhase()} />
          </div>
          
          <div className="space-y-6">
            <QuickLog 
              onLog={addLog}
              onDateSelect={handleDateSelect}
              cycleHealth={getCycleHealth()}
            />
            
            <TodayStatus 
              currentDay={getCycleDay()}
              cycleHealth={getCycleHealth()}
              currentPhase={getCurrentPhase()}
              onAddNote={addLog}
            />
            
            <Reminders 
              reminders={reminders}
              onAddReminder={addReminder}
              nextPeriodDate={periodStartDate ? addDays(periodStartDate, 28) : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
