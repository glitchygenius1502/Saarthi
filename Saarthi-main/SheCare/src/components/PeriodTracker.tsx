
import React from 'react';
import { Droplet, Calendar, Clock, Heart } from 'lucide-react';
import { format, addDays } from 'date-fns';

const PeriodTracker = ({ 
  currentDay, 
  daysUntilNext, 
  cycleHealth, 
  currentPhase,
  periodStartDate 
}) => {
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'Menstrual': return '🩸';
      case 'Follicular': return '🌱';
      case 'Ovulation': return '🌕';
      case 'Luteal': return '🌙';
      default: return '💗';
    }
  };

  const getPhaseMessage = (phase) => {
    switch (phase) {
      case 'Menstrual': return "You're in your menstrual phase";
      case 'Follicular': return "You're in your follicular phase";
      case 'Ovulation': return "You're in your ovulation phase";
      case 'Luteal': return "You're in your luteal phase";
      default: return "Track your cycle to see insights";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Period Tracker Card */}
      <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Droplet className="w-6 h-6 text-red-500" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#5c3b28]">Period Tracker</h3>
            <p className="text-[#9b7d65] text-sm">Track your menstrual cycle</p>
          </div>
          {currentDay > 28 && (
            <div className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              ⚠️ {Math.abs(currentDay - 28)} days late
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">{currentDay}</div>
            <div className="text-[#9b7d65] text-sm">Current Day</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">{daysUntilNext}</div>
            <div className="text-[#9b7d65] text-sm">Days Until Next</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">{cycleHealth}%</div>
            <div className="text-[#9b7d65] text-sm">Cycle Health</div>
          </div>
        </div>
      </div>

      {/* Your Cycle Health Card */}
      <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-[#5c3b28]">Your Cycle Health</h3>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-3">{getPhaseIcon(currentPhase)}</div>
          <p className="text-[#9b7d65]">{getPhaseMessage(currentPhase)}</p>
        </div>
      </div>

      {/* Current Cycle Card */}
      <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-[#5c3b28]">Current Cycle</h3>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm text-[#9b7d65]">
            Day {currentDay} of 28 
            <span className="ml-2 inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
              {currentPhase} Phase
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#9b7d65]">Cycle Progress</span>
              <span className="text-[#5c3b28] font-medium">{Math.min(Math.round((currentDay / 28) * 100), 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#8d6e63] h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentDay / 28) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Period Card */}
      <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-[#5c3b28]">Next Period</h3>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-[#9b5f42] mb-2">{daysUntilNext}</div>
          <div className="text-[#9b7d65] mb-3">days remaining</div>
          {periodStartDate && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-[#5c3b28]">
              Expected: {format(addDays(periodStartDate, 28), 'dd/MM/yyyy')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;
