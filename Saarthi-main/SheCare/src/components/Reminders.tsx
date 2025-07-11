import React, { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '../hooks/use-toast';

const Reminders = ({ reminders, onAddReminder, nextPeriodDate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [daysBefore, setDaysBefore] = useState(3);
  const { toast } = useToast();

  const handleAddReminder = () => {
    if (reminderTitle && reminderDate) {
      const newReminder = {
        title: reminderTitle,
        date: reminderDate,
        daysBefore: daysBefore
      };
      
      onAddReminder(newReminder);
      
      toast({
        title: "Reminder added! 🔔",
        description: `You'll be notified ${daysBefore} days before ${reminderTitle}.`,
      });
      
      // Reset form
      setReminderTitle('');
      setReminderDate('');
      setDaysBefore(3);
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Bell className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-[#5c3b28]">Reminders</h3>
      </div>

      <div className="space-y-4">
        {/* Next Period Prediction */}
        {nextPeriodDate && (
          <div className="bg-gradient-to-r from-pink-50 to-red-50 border border-pink-100 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-[#5c3b28]">Period Prediction</h4>
                <p className="text-sm text-[#9b7d65]">
                  {format(nextPeriodDate, 'dd/MM/yyyy')} at 3 days before
                </p>
              </div>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                3 days before
              </span>
            </div>
          </div>
        )}

        {/* Existing Reminders */}
        {reminders.map((reminder) => (
          <div key={reminder.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-[#5c3b28]">{reminder.title}</h4>
                <p className="text-sm text-[#9b7d65]">
                  {format(new Date(reminder.date), 'dd/MM/yyyy')}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {reminder.daysBefore} days before
              </span>
            </div>
          </div>
        ))}

        {/* Add Reminder Section */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-[#9b7d65] hover:text-[#5c3b28] hover:border-gray-400 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Reminder</span>
          </button>
        ) : (
          <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-white">
            <input
              type="text"
              value={reminderTitle}
              onChange={(e) => setReminderTitle(e.target.value)}
              placeholder="Reminder title (e.g., Doctor appointment)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b5f42] text-[#5c3b28]"
            />
            
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b5f42] text-[#5c3b28]"
            />
            
            <select
              value={daysBefore}
              onChange={(e) => setDaysBefore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b5f42] text-[#5c3b28]"
            >
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>1 week before</option>
              <option value={14}>2 weeks before</option>
            </select>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddReminder}
                className="px-4 py-2 bg-[#9b5f42] text-white rounded-lg hover:bg-[#8b4f32] text-sm font-medium transition-colors"
              >
                Add Reminder
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
