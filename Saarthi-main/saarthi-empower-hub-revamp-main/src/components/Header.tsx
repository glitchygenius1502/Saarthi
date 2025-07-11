
import { useState } from 'react';
import { Menu, X, ChevronDown, User, Settings, LogOut, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExploreModal from './ExploreModal';
import AboutModal from './AboutModal';
import AuthModal from './AuthModal';
import HelpPopup from './HelpPopup';
import SaarthiLogo from './SaarthiLogo';

interface HeaderProps {
  isLoggedIn: boolean;
  userDashboard?: boolean;
  userName?: string;
  onLogin: (name: string) => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, userDashboard = false, userName = 'User', onLogin, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'signup' = 'login') => {
    if (isLoggedIn) {
      setUserDropdownOpen(!userDropdownOpen);
    } else {
      setAuthMode(mode);
      setIsAuthOpen(true);
    }
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  const handleHomeClick = () => {
    if (userDashboard) {
      window.location.reload();
    }
  };

  const handleHelpClick = () => {
    setIsHelpOpen(true);
  };

  const handleSettingsClick = () => {
    setSettingsDropdownOpen(!settingsDropdownOpen);
  };

  const handleExploreLogin = () => {
    onLogin("User"); // Default name for explore modal login
  };

  const handleAuthLogin = (name: string) => {
    onLogin(name);
  };

  const handleAboutSignUp = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation - Left aligned */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer">
                <SaarthiLogo size="md" />
                <span className="font-bold text-xl text-foreground hidden sm:block">Saarthi</span>
              </div>

              {/* Desktop Navigation - Left aligned */}
              <nav className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={handleHomeClick}
                  className="nav-link font-medium flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsExploreOpen(true)}
                    className="nav-link font-medium flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Explore <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={() => setIsAboutOpen(true)}
                  className="nav-link font-medium hover:text-primary transition-colors"
                >
                  About
                </button>

                {userDashboard && (
                  <button className="nav-link font-medium hover:text-primary transition-colors">
                    Dashboard
                  </button>
                )}
              </nav>
            </div>

            {/* Right side - Auth and Settings */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleAuthClick('login')}
                    className="text-foreground hover:text-primary"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleSignUpClick}
                    className="btn-hero"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={handleSettingsClick}
                      className="flex items-center gap-2 relative"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    {settingsDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-elegant py-2 z-50">
                        <button 
                          onClick={onLogout}
                          className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-destructive"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => handleAuthClick('login')}
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Account</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-elegant py-2 z-50">
                        <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={handleHomeClick}
                  className="text-left nav-link font-medium flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button 
                  onClick={() => setIsExploreOpen(true)}
                  className="text-left nav-link font-medium"
                >
                  Explore
                </button>
                <button 
                  onClick={() => setIsAboutOpen(true)}
                  className="text-left nav-link font-medium"
                >
                  About
                </button>
                
                {!isLoggedIn ? (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button variant="ghost" onClick={() => handleAuthClick('login')}>
                      Login
                    </Button>
                    <Button onClick={handleSignUpClick} className="btn-hero">
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button variant="ghost">Profile</Button>
                    <Button variant="ghost" onClick={onLogout} className="text-destructive">
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <ExploreModal isOpen={isExploreOpen} onClose={() => setIsExploreOpen(false)} onLogin={handleExploreLogin} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} onOpenAuth={handleAboutSignUp} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleAuthLogin} defaultMode={authMode} />
      <HelpPopup isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Header;
