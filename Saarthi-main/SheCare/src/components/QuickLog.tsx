
import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../hooks/use-toast';

const QuickLog = ({ onLog, onDateSelect, cycleHealth }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTemp, setSelectedTemp] = useState('');
  const { toast } = useToast();

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '🥰', label: 'Lovely' },
    { emoji: '😤', label: 'Angry' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😰', label: 'Anxious' }
  ];

  const temperatures = ['Low', 'Normal', 'High'];

  const handleLogPeriodToday = () => {
    const today = new Date();
    onDateSelect(today);
    onLog({
      type: 'period',
      date: today,
      mood: selectedMood,
      temperature: selectedTemp
    });
    
    toast({
      title: "Period logged successfully! 🩸",
      description: `Today's period has been recorded with ${cycleHealth}% cycle health.`,
    });
  };

  const handleDateSubmit = () => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      onDateSelect(date);
      onLog({
        type: 'period',
        date: date,
        mood: selectedMood,
        temperature: selectedTemp
      });
      
      toast({
        title: "Period date logged! 📅",
        description: `Period logged for ${format(date, 'MMMM d, yyyy')}`,
      });
      
      setSelectedDate('');
    }
  };

  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Plus className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-[#5c3b28]">Quick Log</h3>
      </div>

      <div className="space-y-4">
        {/* Log Period Today Button */}
        <button 
          onClick={handleLogPeriodToday}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Calendar className="w-5 h-5" />
          <span>Log Period Today</span>
        </button>

        {/* Or select specific date */}
        <div>
          <p className="text-[#9b7d65] text-sm mb-2">Or select a specific date:</p>
          <div className="flex space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b5f42] text-[#5c3b28]"
              placeholder="Select period date"
            />
            <button
              onClick={handleDateSubmit}
              disabled={!selectedDate}
              className="px-4 py-2 bg-[#9b5f42] text-white rounded-lg hover:bg-[#8b4f32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Log
            </button>
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <p className="text-[#9b7d65] text-sm mb-2">Mood:</p>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedMood === mood.label
                    ? 'border-[#9b5f42] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-[#9b7d65]">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Selection */}
        <div>
          <p className="text-[#9b7d65] text-sm mb-2">Temperature:</p>
          <div className="grid grid-cols-3 gap-2">
            {temperatures.map((temp) => (
              <button
                key={temp}
                onClick={() => setSelectedTemp(temp)}
                className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                  selectedTemp === temp
                    ? 'border-[#9b5f42] bg-orange-50 text-[#9b5f42]'
                    : 'border-gray-200 text-[#9b7d65] hover:border-gray-300'
                }`}
              >
                {temp}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLog;
