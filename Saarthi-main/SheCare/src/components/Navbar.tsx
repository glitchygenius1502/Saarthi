
import React from 'react';
import { Calendar, Bell, Settings } from 'lucide-react';

const Navbar = ({ onCalendarClick }) => {
  return (
    <nav className="bg-gradient-to-r from-[#9b5f42] to-[#b07456] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#9b5f42]" strokeWidth={1.5} />
            </div>
            <h1 className="text-white text-xl font-bold">SheCare</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={onCalendarClick}
              className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors"
            >
              <Calendar className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Calendar</span>
            </button>
            
            <button className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Reminders</span>
            </button>
            
            <button className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors">
              <Settings className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
