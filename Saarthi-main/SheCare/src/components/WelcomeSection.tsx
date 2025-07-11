
import React from 'react';
import { Heart } from 'lucide-react';

const WelcomeSection = () => {
  return (
    <div className="bg-[#fff7f2] rounded-2xl p-6 shadow-sm border border-orange-100">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-pink-500" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#5c3b28] mb-2">
            Welcome back! 💗
          </h2>
          <p className="text-[#9b7d65] text-lg">
            Track your cycle, understand your body, and take control of your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
