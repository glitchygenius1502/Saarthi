
import React from 'react';
import { Leaf } from 'lucide-react';

const CycleTips = ({ currentPhase }) => {
  const getCurrentPhaseAdvice = () => {
    switch (currentPhase) {
      case 'Menstrual':
        return {
          title: 'Currently: Menstrual Phase 🩸',
          description: 'You are in your menstrual phase',
          advice: {
            diet: 'Iron-rich foods (spinach, red meat), warm drinks, avoid caffeine',
            exercise: 'Light yoga, walking, gentle stretching',
            precautions: 'Rest well, use heat therapy, stay hydrated, manage cramps'
          },
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'Follicular':
        return {
          title: 'Currently: Follicular Phase 🌱',
          description: 'You are in your follicular phase',
          advice: {
            diet: 'Fresh fruits, vegetables, lean proteins, complex carbs',
            exercise: 'High-intensity workouts, strength training, cardio',
            precautions: 'Great time for new projects, energy is high'
          },
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'Ovulation':
        return {
          title: 'Currently: Ovulation Phase 🌕',
          description: 'You are in your ovulation phase',
          advice: {
            diet: 'Antioxidant-rich foods, berries, nuts, stay well hydrated',
            exercise: 'Peak performance time - any exercise is great',
            precautions: 'Peak fertility window, skin may be clearer, confidence high'
          },
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'Luteal':
        return {
          title: 'Currently: Luteal Phase 🌙',
          description: 'You are in your luteal phase',
          advice: {
            diet: 'Complex carbs, magnesium-rich foods, limit sugar and salt',
            exercise: 'Moderate exercise, avoid overexertion, focus on consistency',
            precautions: 'PMS symptoms may appear, prioritize self-care and sleep'
          },
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          title: 'Track Your Cycle 💗',
          description: 'Start tracking to see personalized insights',
          advice: {
            diet: 'Maintain a balanced diet with all nutrients',
            exercise: 'Regular exercise routine',
            precautions: 'Log your period to get personalized advice'
          },
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const currentAdvice = getCurrentPhaseAdvice();
  
  const allTips = [
    {
      phase: 'Menstrual Phase',
      icon: '🩸',
      description: 'Stay hydrated, rest well, use heat therapy.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100'
    },
    {
      phase: 'Follicular Phase',
      icon: '🌱',
      description: 'Best for high-energy activities, new projects.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100'
    },
    {
      phase: 'Ovulation',
      icon: '🌕',
      description: 'Peak fertility – ideal for important decisions.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      phase: 'Luteal Phase',
      icon: '🌙',  
      description: 'Focus on self-care and prep for next cycle.',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100'
    }
  ];

  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Leaf className="w-6 h-6 text-green-500" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold text-[#5c3b28]">Cycle Tips & Insights</h3>
      </div>

      {/* Current Phase Advice */}
      <div className={`${currentAdvice.bgColor} ${currentAdvice.borderColor} border-2 rounded-lg p-4 mb-6`}>
        <h4 className="font-bold text-[#5c3b28] mb-2 text-lg">{currentAdvice.title}</h4>
        <p className="text-[#9b7d65] text-sm mb-4">{currentAdvice.description}</p>
        
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-[#5c3b28] text-sm">🍎 Diet: </span>
            <span className="text-[#9b7d65] text-sm">{currentAdvice.advice.diet}</span>
          </div>
          <div>
            <span className="font-semibold text-[#5c3b28] text-sm">💪 Exercise: </span>
            <span className="text-[#9b7d65] text-sm">{currentAdvice.advice.exercise}</span>
          </div>
          <div>
            <span className="font-semibold text-[#5c3b28] text-sm">⚠️ Precautions: </span>
            <span className="text-[#9b7d65] text-sm">{currentAdvice.advice.precautions}</span>
          </div>
        </div>
      </div>

      {/* All Phase Tips */}
      <div className="space-y-4">
        <h4 className="font-semibold text-[#5c3b28] text-sm mb-3">All Cycle Phases Overview:</h4>
        {allTips.map((tip, index) => (
          <div 
            key={index}
            className={`${tip.bgColor} ${tip.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{tip.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#5c3b28] mb-1">{tip.phase}</h4>
                <p className="text-[#9b7d65] text-sm">{tip.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleTips;
