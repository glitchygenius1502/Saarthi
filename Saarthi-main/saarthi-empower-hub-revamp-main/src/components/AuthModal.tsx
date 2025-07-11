
import { useState } from 'react';
import { X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SaarthiLogo from './SaarthiLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
  defaultMode?: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, onLogin, defaultMode = 'login' }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    city: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form mode when modal opens with different default
  useState(() => {
    if (isOpen) {
      setIsLogin(defaultMode === 'login');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Use the exact name entered, with proper capitalization preserved
      const userName = formData.name.trim() || 'User';
      onLogin(userName);
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      age: '',
      city: '',
      termsAccepted: false
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="card-elegant w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in hover:scale-105 transition-transform duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={handleClose} className="hover:scale-110 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClose} className="hover:scale-110 transition-transform">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4 animate-pulse">
              <SaarthiLogo size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
              {isLogin ? 'Welcome Back!' : 'Get Started with Saarthi'}
            </h2>
            <p className="text-muted-foreground animate-fade-in">
              {isLogin 
                ? 'Sign in to access your personalized health dashboard' 
                : 'Create your account to begin your health journey'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="animate-slide-in-right">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:scale-105 ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.age ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Your age"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Your city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                </div>
              </>
            )}

            <div className="animate-slide-in-right">
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:scale-105 ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${
                    errors.password ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <div className="text-sm">
                  <label className="text-foreground">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" className="btn-hero w-full py-3 text-lg hover:scale-105 transition-transform duration-300 animate-fade-in">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center mt-6 animate-fade-in">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={switchMode}
                className="text-primary hover:underline ml-1 font-medium hover:scale-105 transition-transform duration-300"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;
