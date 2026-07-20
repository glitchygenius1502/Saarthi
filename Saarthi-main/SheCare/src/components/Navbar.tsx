
import React, { useState } from 'react';
import { Calendar, Settings, LogOut, User } from 'lucide-react';

const Navbar = ({
  onCalendarClick,
  userName,
  onLogout,
}: {
  onCalendarClick?: () => void;
  userName?: string;
  onLogout?: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = (userName || 'U').trim().charAt(0).toUpperCase();

  return (
    <nav className="bg-gradient-to-r from-[#9b5f42] to-[#b07456] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#9b5f42]" strokeWidth={1.5} />
            </div>
            <h1 className="text-white text-xl font-bold">SheCycle+</h1>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={onCalendarClick}
              className="hidden sm:flex items-center space-x-2 text-white hover:text-orange-100 transition-colors"
            >
              <Calendar className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Calendar</span>
            </button>

            <button className="hidden sm:flex items-center space-x-2 text-white hover:text-orange-100 transition-colors">
              <Settings className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Settings</span>
            </button>

            {/* Logged-in user profile beside settings */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center space-x-2 text-white hover:text-orange-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-white/90 text-[#9b5f42] flex items-center justify-center font-bold">
                  {initial}
                </div>
                <span className="font-medium hidden sm:block">{userName || 'Account'}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2 border-b">
                    <User className="w-4 h-4" /> {userName || 'Signed in'}
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
