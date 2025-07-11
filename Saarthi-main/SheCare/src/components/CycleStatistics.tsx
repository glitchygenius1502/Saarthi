
import React from 'react';
import { TrendingUp } from 'lucide-react';

const CycleStatistics = ({ cycleHealth, periodsLogged, currentPhase }) => {
  const getPatternStatus = () => {
    if (periodsLogged < 3) return { text: 'Building Cycle Pattern', color: 'text-green-600', bg: 'bg-green-100' };
    if (cycleHealth >= 80) return { text: 'Healthy Cycle Pattern', color: 'text-green-600', bg: 'bg-green-100' };
    return { text: 'Irregular Cycle Pattern', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  const pattern = getPatternStatus();

  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold text-[#5c3b28]">Cycle Statistics</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[#9b7d65]">Average Cycle Length</span>
          <span className="text-[#5c3b28] font-semibold">28 days</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#9b7d65]">Regularity Score</span>
            <span className="text-[#5c3b28] font-semibold">{cycleHealth}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#8d6e63] h-3 rounded-full transition-all duration-500"
              style={{ width: `${cycleHealth}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#9b7d65]">Period Length</span>
          <span className="text-[#5c3b28] font-semibold">5 days</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#9b7d65]">Periods Logged</span>
          <span className="text-[#5c3b28] font-semibold">{periodsLogged}</span>
        </div>

        <div className={`${pattern.bg} px-4 py-3 rounded-lg text-center`}>
          <span className={`${pattern.color} font-medium flex items-center justify-center space-x-2`}>
            <span className="w-2 h-2 bg-current rounded-full"></span>
            <span>{pattern.text}</span>
          </span>
        </div>

        {/* Phase-specific advice based on current phase */}
        {currentPhase !== 'Unknown' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
            <h4 className="font-semibold text-[#5c3b28] mb-2">Current Phase Advice:</h4>
            <div className="text-sm text-[#9b7d65] space-y-1">
              {currentPhase === 'Menstrual' && (
                <>
                  <p>• Stay hydrated and rest well</p>
                  <p>• Use heat therapy for cramps</p>
                  <p>• Eat iron-rich foods</p>
                </>
              )}
              {currentPhase === 'Follicular' && (
                <>
                  <p>• Great time for new projects</p>
                  <p>• High-energy activities recommended</p>
                  <p>• Focus on strength training</p>
                </>
              )}
              {currentPhase === 'Ovulation' && (
                <>
                  <p>• Peak fertility window</p>
                  <p>• Ideal for important decisions</p>
                  <p>• Stay active and social</p>
                </>
              )}
              {currentPhase === 'Luteal' && (
                <>
                  <p>• Focus on self-care</p>
                  <p>• Prepare for next cycle</p>
                  <p>• Practice stress management</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleStatistics;
