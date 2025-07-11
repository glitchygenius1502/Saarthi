
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TodayStatus = ({ currentDay, cycleHealth, currentPhase, onAddNote }) => {
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const { toast } = useToast();

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Menstrual': return 'bg-red-100 text-red-700';
      case 'Follicular': return 'bg-green-100 text-green-700';
      case 'Ovulation': return 'bg-blue-100 text-blue-700';
      case 'Luteal': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote({
        type: 'note',
        content: note,
        date: new Date()
      });
      
      toast({
        title: "Note saved! 📝",
        description: "Your symptom note has been recorded successfully.",
      });
      
      setNote('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
      <h3 className="text-lg font-semibold text-[#5c3b28] mb-4">Today's Status</h3>

      <div className="space-y-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor(currentPhase)}`}>
            {currentPhase === 'Menstrual' ? `Period Day ${currentDay}` : `${currentPhase} Day ${currentDay}`}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            Cycle Health: {cycleHealth}%
          </span>
        </div>

        {/* Cycle Health Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#9b7d65]">Today's Cycle Health</span>
            <span className="text-[#5c3b28] font-medium">{cycleHealth}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${cycleHealth}%` }}
            ></div>
          </div>
        </div>

        {/* Add Note Section */}
        <div className="border-t border-gray-200 pt-4">
          {!showNoteInput ? (
            <button
              onClick={() => setShowNoteInput(true)}
              className="w-full flex items-center justify-center space-x-2 text-[#9b7d65] hover:text-[#5c3b28] py-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add symptoms or notes</span>
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add symptoms, mood, or any notes..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b5f42] text-[#5c3b28] text-sm resize-none"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-[#9b5f42] text-white rounded-lg hover:bg-[#8b4f32] text-sm font-medium transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNote('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayStatus;
