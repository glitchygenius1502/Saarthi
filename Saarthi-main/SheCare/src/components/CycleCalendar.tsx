
import React from 'react';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, differenceInDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Droplet, Leaf, Sun, Moon } from 'lucide-react';

const CycleCalendar = ({ 
  periodStartDate, 
  previousPeriodDate,
  onDateSelect, 
  currentMonth, 
  onMonthChange 
}) => {
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayType = (date) => {
    if (periodStartDate && isSameMonth(date, periodStartDate)) {
      const daysSinceStart = Math.floor((date - periodStartDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceStart >= 0 && daysSinceStart <= 6) return 'current-period';
      if (daysSinceStart >= 7 && daysSinceStart <= 13) return 'fertile';
      if (daysSinceStart === 14) return 'ovulation';
    }
    
    // Check for next month's predicted period
    if (periodStartDate) {
      const nextPeriodStart = addDays(periodStartDate, 28);
      if (isSameMonth(date, nextPeriodStart)) {
        const daysSinceNextStart = Math.floor((date - nextPeriodStart) / (1000 * 60 * 60 * 24));
        if (daysSinceNextStart >= 0 && daysSinceNextStart <= 6) return 'next-period';
      }
    }
    
    if (previousPeriodDate && !isSameMonth(date, currentMonth) && 
        isSameMonth(date, previousPeriodDate)) {
      const daysSinceStart = Math.floor((date - previousPeriodDate) / (1000 * 60 * 60 * 24));
      if (daysSinceStart >= 0 && daysSinceStart <= 6) return 'previous-period';
    }
    
    return null;
  };

  const getDayStyle = (dayType) => {
    switch (dayType) {
      case 'current-period':
        return 'bg-red-100 border-red-200 text-red-700';
      case 'fertile':
        return 'bg-green-100 border-green-200 text-green-700';
      case 'ovulation':
        return 'bg-blue-100 border-blue-200 text-blue-700';
      case 'next-period':
        return 'bg-pink-100 border-pink-200 text-pink-700';
      case 'previous-period':
        return 'bg-yellow-100 border-yellow-200 text-yellow-700';
      default:
        return 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50';
    }
  };

  const getDayIcon = (dayType) => {
    switch (dayType) {
      case 'current-period':
        return <Droplet className="w-3 h-3" />;
      case 'fertile':
        return <Leaf className="w-3 h-3" />;
      case 'ovulation':
        return <Sun className="w-3 h-3" />;
      case 'next-period':
        return <Droplet className="w-3 h-3" />;
      case 'previous-period':
        return <Moon className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const previousMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100 w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#5c3b28]">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={previousMonth}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
          <Droplet className="w-3 h-3 text-red-500" />
          <span className="text-red-700">Current Period</span>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
          <Moon className="w-3 h-3 text-yellow-600" />
          <span className="text-yellow-700">Previous Period</span>
        </div>
        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
          <Leaf className="w-3 h-3 text-green-600" />
          <span className="text-green-700">Fertile Window</span>
        </div>
        <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
          <Sun className="w-3 h-3 text-blue-600" />
          <span className="text-blue-700">Ovulation</span>
        </div>
        <div className="flex items-center space-x-1 bg-pink-100 px-2 py-1 rounded-full">
          <Droplet className="w-3 h-3 text-pink-500" />
          <span className="text-pink-700">Next Period</span>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-[#9b7d65] py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month start */}
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12"></div>
        ))}
        
        {/* Month days */}
        {monthDays.map(date => {
          const dayType = getDayType(date);
          const isToday = isSameDay(date, today);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`
                h-12 w-full rounded-lg border-2 transition-all duration-200 
                flex items-center justify-center relative
                ${getDayStyle(dayType)}
                ${isToday ? 'ring-2 ring-[#9b5f42] ring-offset-1' : ''}
                hover:scale-105 active:scale-95
              `}
            >
              <span className={`text-sm font-medium ${isToday ? 'font-bold' : ''}`}>
                {format(date, 'd')}
              </span>
              {dayType && (
                <div className="absolute top-0.5 right-0.5">
                  {getDayIcon(dayType)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CycleCalendar;
