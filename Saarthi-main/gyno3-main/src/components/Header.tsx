
import { useState } from "react";
import { MapPin, Video, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/api";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ProfileCircle = () => {
  const [open, setOpen] = useState(false);
  const user = getUser();

  if (!user) {
    return (
      <Button
        onClick={() => (window.location.href = "/?auth=signup&next=" + encodeURIComponent("/gynoconnect"))}
        className="bg-[#e03131] hover:bg-[#e03131]/90 text-white rounded-full px-4 py-2 text-sm"
      >
        Sign in
      </Button>
    );
  }

  const initial = (user.name || "U").trim().charAt(0).toUpperCase();
  const logout = () => {
    localStorage.removeItem("saarthi_token");
    localStorage.removeItem("saarthi_user");
    window.location.href = "/";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-full bg-[#e03131] text-white flex items-center justify-center font-bold shadow"
        title={user.name}
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2 border-b">
            <User className="w-4 h-4" /> {user.name}
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Header = ({ activeSection, setActiveSection }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#fff7f2] shadow-sm z-50 border-b border-[#fde0e0]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-[#fde0e0] rounded-full">
              <span className="text-lg">🩺</span>
            </div>
            <span className="text-xl font-bold text-[#5c3b28] font-['Inter']">GynoConnect</span>
          </div>

          {/* Navigation + profile */}
          <div className="flex items-center space-x-2">
            <Button
              variant={activeSection === "nearby" ? "default" : "ghost"}
              onClick={() => setActiveSection("nearby")}
              className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeSection === "nearby"
                  ? "bg-[#e03131] text-white hover:bg-[#e03131]/90"
                  : "text-[#5c3b28] hover:bg-[#fde0e0]"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Nearest Doctors</span>
            </Button>

            <Button
              variant={activeSection === "consult" ? "default" : "ghost"}
              onClick={() => setActiveSection("consult")}
              className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeSection === "consult"
                  ? "bg-[#e03131] text-white hover:bg-[#e03131]/90"
                  : "text-[#5c3b28] hover:bg-[#fde0e0]"
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Online Consult</span>
            </Button>

            <ProfileCircle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
