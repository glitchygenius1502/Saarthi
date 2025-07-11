import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Calendar, MapPin, Clock, Shield, Users, Heart, Phone, Bell, CheckCircle, Star, ArrowRight, Activity, ThumbsUp, ThumbsDown } from "lucide-react";

// Import images
import vaccineHero from "@/assets/vaccine-hero.jpg";
import womenHealth from "@/assets/women-health.jpg";
import vaccineVials from "@/assets/vaccine-vials.jpg";
import maternalCare from "@/assets/maternal-care.jpg";

interface UserProfile {
  name: string;
  age: string;
  location: string;
  pregnancyStatus: string;
  medicalHistory: string;
  lastVaccination: string;
}

interface EligibilityResponse {
  field: string;
  answer: 'yes' | 'no' | '';
  recommendation: string;
  tagline: string;
}

interface Vaccine {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  doses: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  status: 'due' | 'upcoming' | 'completed';
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: '',
    location: '',
    pregnancyStatus: '',
    medicalHistory: '',
    lastVaccination: ''
  });
  const [eligibilityResponses, setEligibilityResponses] = useState<EligibilityResponse[]>([
    { field: 'age', answer: '', recommendation: '', tagline: '' },
    { field: 'pregnancy', answer: '', recommendation: '', tagline: '' },
    { field: 'medical', answer: '', recommendation: '', tagline: '' },
    { field: 'location', answer: '', recommendation: '', tagline: '' },
    { field: 'vaccination', answer: '', recommendation: '', tagline: '' }
  ]);
  const [currentVaccineIndex, setCurrentVaccineIndex] = useState(0);
  const [healthScore, setHealthScore] = useState(75);
  const [isFormValid, setIsFormValid] = useState(false);

  const vaccines = [
    {
      id: '1',
      name: 'Cervavac®',
      description: '🌟 Revolutionary cervical cancer prevention',
      fullDescription: 'The game-changing cervical cancer prevention vaccine that is rewriting the future of women&apos;s health — now accessible at just ₹200 via Government hospitals.',
      coverage: 'HPV 6, 11, 16, 18',
      availability: 'Pan India via Serum Institute',
      year: '2023',
      price: '₹200',
      status: 'Available',
      tagline: 'Your Shield Against Tomorrow&apos;s Worries',
      subtitle: 'Prevention is Your Superpower',
      image: vaccineVials
    },
    {
      id: '2',
      name: 'Vvax001',
      description: '🔬 Breakthrough therapeutic innovation',
      fullDescription: 'Revolutionary therapeutic vaccine that treats precancerous lesions without surgery — a medical miracle that transforms healing into hope.',
      coverage: '94% Lesion Reduction | 63% HPV Clearance',
      availability: 'Phase II complete',
      year: '2025 Trials',
      price: 'Trial Phase',
      status: 'Research',
      tagline: 'Where Science Meets Miracles',
      subtitle: 'Healing Without Surgery, Hope Without Limits',
      image: vaccineVials
    },
    {
      id: '3',
      name: 'Cecolin®',
      description: '🎯 WHO-approved single-dose simplicity',
      fullDescription: 'WHO-approved single-dose vaccine that simplifies HPV protection for rural communities — one shot that delivers a lifetime of confidence.',
      coverage: 'Single-dose HPV protection',
      availability: 'Approved in over 60 countries',
      year: '2024',
      price: 'Govt. Approved',
      status: 'Available',
      tagline: 'Simplicity Meets Excellence',
      subtitle: 'One Shot. Lifetime Confidence.',
      image: vaccineVials
    }
  ];

  const userVaccines: Vaccine[] = [
    {
      id: '1',
      name: 'HPV Vaccine (2nd dose)',
      description: 'Cervical cancer prevention',
      dueDate: '2024-08-15',
      doses: '2/3',
      location: 'Apollo Hospital, Delhi',
      priority: 'high',
      status: 'due'
    },
    {
      id: '2',
      name: 'Tetanus Booster',
      description: 'Pregnancy protection',
      dueDate: '2024-09-20',
      doses: '1/2',
      location: 'AIIMS, Delhi',
      priority: 'medium',
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Iron Deficiency Vaccine',
      description: 'Anemia prevention',
      dueDate: '2024-10-05',
      doses: '0/1',
      location: 'Max Healthcare, Gurgaon',
      priority: 'low',
      status: 'upcoming'
    }
  ];

  const newsItems = [
    {
      title: 'New TNBC Cancer Vaccine Shows Promising Results',
      source: 'WHO Health Updates',
      time: '2 hours ago',
      category: 'Research',
      tagline: 'Hope on the Horizon'
    },
    {
      title: 'Free HPV Vaccination Drive Launches Nationwide',
      source: 'Ministry of Health',
      time: '1 day ago',
      category: 'Government',
      tagline: 'Empowering Every Woman'
    },
    {
      title: 'Iron Supplements Now Available in Remote Areas',
      source: 'ICMR',
      time: '3 days ago',
      category: 'Availability',
      tagline: 'Health Reaches Every Corner'
    }
  ];

  // Check form validation and generate eligibility responses
  useEffect(() => {
    const filledFields = Object.values(userProfile).filter(value => value.trim() !== '');
    setIsFormValid(filledFields.length >= 3);
    
    // Update health score
    const completionPercentage = (filledFields.length / Object.keys(userProfile).length) * 100;
    setHealthScore(Math.min(95, 50 + completionPercentage * 0.5));

    // Generate eligibility responses
    const updatedResponses = eligibilityResponses.map(response => {
      switch (response.field) {
        case 'age':
          if (userProfile.age) {
            const age = parseInt(userProfile.age);
            if (age >= 18 && age <= 26) {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Perfect age for HPV vaccination - Maximum protection!',
                tagline: '✨ Prime Time for Protection'
              };
            } else if (age > 26 && age <= 45) {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Still beneficial for HPV and other vaccines.',
                tagline: '🛡️ Never Too Late to Protect'
              };
            } else {
              return {
                ...response,
                answer: 'no' as const,
                recommendation: 'Consult with healthcare provider for personalized advice.',
                tagline: '💡 Custom Care Needed'
              };
            }
          }
          break;
        case 'pregnancy':
          if (userProfile.pregnancyStatus) {
            if (userProfile.pregnancyStatus === 'pregnant') {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Tetanus and flu vaccines are essential during pregnancy.',
                tagline: '🤱 Protecting Two Lives'
              };
            } else if (userProfile.pregnancyStatus === 'planning') {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Pre-pregnancy vaccines recommended for optimal health.',
                tagline: '🌟 Planning for Perfection'
              };
            } else {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Regular vaccines like HPV are highly recommended.',
                tagline: '💪 Stay Strong, Stay Protected'
              };
            }
          }
          break;
        case 'medical':
          if (userProfile.medicalHistory) {
            const history = userProfile.medicalHistory.toLowerCase();
            if (history.includes('anemia') || history.includes('iron')) {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Iron supplementation vaccines highly recommended.',
                tagline: '🩸 Boost Your Blood Health'
              };
            } else if (history.includes('pcos') || history.includes('diabetes')) {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Regular health monitoring with vaccine updates needed.',
                tagline: '⚡ Manage with Confidence'
              };
            } else {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Standard preventive vaccines recommended.',
                tagline: '🎯 Prevention is Key'
              };
            }
          }
          break;
        case 'location':
          if (userProfile.location) {
            return {
              ...response,
              answer: 'yes' as const,
              recommendation: `Vaccines available in your area: ${userProfile.location}`,
              tagline: '📍 Healthcare at Your Doorstep'
            };
          }
          break;
        case 'vaccination':
          if (userProfile.lastVaccination) {
            const vaccination = userProfile.lastVaccination.toLowerCase();
            if (vaccination.includes('hpv') || vaccination.includes('cervical')) {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Continue with HPV vaccine series completion.',
                tagline: '🔄 Complete the Shield'
              };
            } else {
              return {
                ...response,
                answer: 'yes' as const,
                recommendation: 'Additional vaccines may be beneficial.',
                tagline: '➕ Expand Your Protection'
              };
            }
          }
          break;
      }
      return response;
    });
    setEligibilityResponses(updatedResponses);
  }, [userProfile]);

  // Auto-rotate vaccine carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVaccineIndex((prev) => (prev + 1) % vaccines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const getPersonalizedRecommendations = () => {
    if (!isFormValid) return [];
    
    const recommendations = [];
    
    if (userProfile.age && parseInt(userProfile.age) >= 18 && parseInt(userProfile.age) <= 26) {
      recommendations.push({
        vaccine: 'HPV Vaccine',
        reason: 'Optimal age for cervical cancer prevention',
        urgency: 'high',
        tagline: 'Prime Protection Period'
      });
    }
    
    if (userProfile.pregnancyStatus === 'pregnant') {
      recommendations.push({
        vaccine: 'Tetanus Toxoid',
        reason: 'Essential for pregnancy protection',
        urgency: 'high',
        tagline: 'Double Protection'
      });
    }
    
    if (userProfile.medicalHistory.toLowerCase().includes('anemia')) {
      recommendations.push({
        vaccine: 'Iron Supplementation',
        reason: 'Address iron deficiency',
        urgency: 'medium',
        tagline: 'Blood Health Boost'
      });
    }
    
    return recommendations;
  };

  const quickActions = [
    { 
      icon: Calendar, 
      label: 'Book Appointment', 
      tagline: 'Schedule Care',
      action: () => toast({ title: "Booking activated", description: "Connecting to appointment portal..." }) 
    },
    { 
      icon: MapPin, 
      label: 'Find Centers', 
      tagline: 'Locate Care',
      action: () => toast({ title: "Centers found", description: "Showing nearest vaccination centers..." }) 
    },
    { 
      icon: Bell, 
      label: 'Set Reminders', 
      tagline: 'Never Miss',
      action: () => toast({ title: "Reminders set", description: "You will receive timely notifications." }) 
    },
    { 
      icon: Phone, 
      label: 'Emergency Help', 
      tagline: 'Instant Support',
      action: () => toast({ title: "Help connected", description: "Connecting to medical helpline..." }) 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-light via-background to-beige-dark">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-brown-light/30 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-brown-dark" />
              <span className="text-2xl font-bold text-brown-dark">VaxAlert</span>
              <Badge variant="outline" className="ml-2 bg-brown-light/20 text-brown-dark border-brown-medium">
                Saarthi
              </Badge>
            </div>
            <div className="hidden md:flex space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('dashboard')}
                className={`hover:bg-brown-light/30 ${activeSection === 'dashboard' ? 'bg-brown-light/40 text-brown-dark' : 'text-brown-medium'}`}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('vaccines')}
                className={`hover:bg-brown-light/30 ${activeSection === 'vaccines' ? 'bg-brown-light/40 text-brown-dark' : 'text-brown-medium'}`}
              >
                Vaccines
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('eligibility')}
                className={`hover:bg-brown-light/30 ${activeSection === 'eligibility' ? 'bg-brown-light/40 text-brown-dark' : 'text-brown-medium'}`}
              >
                Eligibility
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('awareness')}
                className={`hover:bg-brown-light/30 ${activeSection === 'awareness' ? 'bg-brown-light/40 text-brown-dark' : 'text-brown-medium'}`}
              >
                Awareness
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brown-light/20 via-beige-light/40 to-brown-light/20"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
          <img 
            src={vaccineHero} 
            alt="Healthcare professional" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Badge className="mb-6 bg-brown-dark/10 text-brown-dark border-brown-medium/30" variant="outline">
            Be Informed. Be Protected. Be Empowered.
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-brown-dark mb-6 leading-tight">
            Stay Ahead with Every Shot That Matters
          </h1>
          <p className="text-xl text-brown-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            Your personalized vaccine journey starts here — verified information, timely alerts, and expert guidance for women&apos;s health protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => scrollToSection('dashboard')}
              className="text-lg px-8 py-3 shadow-xl"
            >
              Start My Health Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="warm" 
              size="lg"
              onClick={() => scrollToSection('eligibility')}
              className="text-lg px-8 py-3"
            >
              Quick Health Check
            </Button>
          </div>
        </div>
      </section>

      {/* Personalized Dashboard */}
      <section id="dashboard" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brown-dark mb-4">Your Personal Health Guardian</h2>
            <p className="text-brown-medium text-lg">Smart tracking, personalized insights, timely protection</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Health Score */}
            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Activity className="h-5 w-5 text-success" />
                  <span>Protection Level</span>
                </CardTitle>
                <CardDescription className="text-success font-medium">Shield Strength</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-success mb-2">{healthScore}%</div>
                  <Progress value={healthScore} className="mb-4" />
                  <p className="text-sm text-brown-medium">
                    {healthScore >= 80 ? '🌟 Outstanding protection!' : '📈 Building stronger protection...'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Area Stats */}
            <Card className="shadow-lg border-brown-light/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-warning" />
                  <span>Community Health</span>
                </CardTitle>
                <CardDescription className="text-brown-medium">Your Area Impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-brown-medium">HPV Coverage</span>
                    <Badge variant="secondary" className="bg-brown-light text-brown-dark">78%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-brown-medium">Active Centers</span>
                    <Badge variant="secondary" className="bg-brown-light text-brown-dark">12</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-brown-medium">Women Protected</span>
                    <Badge variant="secondary" className="bg-brown-light text-brown-dark">1.2K+</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-brown-light/30">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription className="text-brown-medium">One-click health care</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="h-auto p-3 flex flex-col items-center space-y-1 hover:bg-brown-light/20 border-brown-light/50"
                    >
                      <action.icon className="h-4 w-4 text-brown-dark" />
                      <span className="text-xs text-center text-brown-dark font-medium">{action.label}</span>
                      <span className="text-xs text-brown-medium">{action.tagline}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Vaccines */}
          <div className="grid lg:grid-cols-3 gap-6">
            {userVaccines.map((vaccine) => (
              <Card key={vaccine.id} className="hover:shadow-xl transition-all duration-300 border-brown-light/30 hover:border-brown-medium/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-brown-dark">{vaccine.name}</CardTitle>
                    <Badge 
                      variant={vaccine.priority === 'high' ? 'destructive' : 'secondary'}
                      className={vaccine.priority === 'high' ? '' : 'bg-brown-light text-brown-dark'}
                    >
                      {vaccine.priority} priority
                    </Badge>
                  </div>
                  <CardDescription className="text-brown-medium">{vaccine.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-brown-medium">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(vaccine.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-brown-medium">
                      <MapPin className="h-4 w-4" />
                      <span>{vaccine.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-brown-medium">
                      <Shield className="h-4 w-4" />
                      <span>Progress: {vaccine.doses}</span>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant={vaccine.status === 'due' ? 'default' : 'outline'}
                    >
                      {vaccine.status === 'due' ? '📅 Book Now' : '⏰ Schedule'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Recent Vaccines with Images */}
      <section id="vaccines" className="py-16 px-4 bg-brown-light/10 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute left-0 top-0 w-1/4 h-full opacity-10">
          <img 
            src={womenHealth} 
            alt="Women health empowerment" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-success/20 text-success border-success/30" variant="outline">
              💉 Medical Breakthroughs 2023-2025
            </Badge>
            <h2 className="text-4xl font-bold text-brown-dark mb-4">Revolutionary Vaccines Changing Lives</h2>
            <p className="text-brown-medium text-lg">Latest breakthroughs that are rewriting women&apos;s health protection</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge className="bg-brown-light/20 text-brown-dark border-brown-medium">✅ WHO Verified</Badge>
              <Badge className="bg-brown-light/20 text-brown-dark border-brown-medium">🔬 ICMR Approved</Badge>
              <Badge className="bg-brown-light/20 text-brown-dark border-brown-medium">🏛️ Gov Certified</Badge>
            </div>
          </div>

          <div className="relative">
            <Card className="max-w-5xl mx-auto bg-gradient-to-r from-card to-card/95 shadow-2xl border-brown-light/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Content Side */}
                  <div className="lg:w-2/3 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <Badge className="bg-success/20 text-success hover:bg-success/30 border-success/30 px-3 py-1">
                        🚀 {vaccines[currentVaccineIndex].year}
                      </Badge>
                      <Badge variant="outline" className="bg-brown-light/20 text-brown-dark border-brown-medium px-3 py-1">
                        {vaccines[currentVaccineIndex].tagline}
                      </Badge>
                    </div>
                    <h3 className="text-4xl font-bold text-brown-dark mb-3">
                      {vaccines[currentVaccineIndex].name}
                    </h3>
                    <p className="text-lg text-success font-semibold mb-4">
                      {vaccines[currentVaccineIndex].subtitle}
                    </p>
                    <p className="text-lg text-brown-medium mb-6 leading-relaxed">
                      {vaccines[currentVaccineIndex].fullDescription}
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="bg-gradient-to-r from-success/5 to-brown-light/10 p-4 rounded-lg border border-success/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <span className="font-semibold text-brown-dark">Coverage & Efficacy</span>
                        </div>
                        <span className="text-sm text-brown-dark">{vaccines[currentVaccineIndex].coverage}</span>
                      </div>
                      <div className="bg-gradient-to-r from-info/5 to-brown-light/10 p-4 rounded-lg border border-info/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-5 w-5 text-info" />
                          <span className="font-semibold text-brown-dark">Availability Status</span>
                        </div>
                        <span className="text-sm text-brown-dark">{vaccines[currentVaccineIndex].availability}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 px-3 py-1">
                          💰 {vaccines[currentVaccineIndex].price}
                        </Badge>
                        <Badge variant={vaccines[currentVaccineIndex].status === 'Available' ? 'default' : 'secondary'} className="px-3 py-1">
                          {vaccines[currentVaccineIndex].status === 'Available' ? '✅' : '🔬'} {vaccines[currentVaccineIndex].status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="default" className="w-full lg:w-auto bg-brown-dark hover:bg-brown-dark/90 px-8 py-3">
                      🔍 Explore Benefits & Book Now
                    </Button>
                  </div>
                  
                  {/* Image Side */}
                  <div className="lg:w-1/3 relative">
                    <div className="h-full min-h-[400px] bg-gradient-to-br from-brown-light/20 to-beige-light/40 flex flex-col justify-center items-center p-8 border-l border-brown-light/30">
                      <img 
                        src={vaccines[currentVaccineIndex].image} 
                        alt={vaccines[currentVaccineIndex].name}
                        className="w-full h-48 object-cover rounded-lg mb-6 shadow-lg"
                      />
                      <div className="text-center">
                        <Shield className="h-16 w-16 text-brown-dark mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-brown-dark mb-2">Verified Protection</h4>
                        <p className="text-brown-medium leading-relaxed text-sm">
                          Triple-verified by WHO, ICMR, and Ministry of Health for ultimate safety and trust.
                        </p>
                        <div className="mt-4 flex justify-center space-x-2">
                          <Badge className="bg-success/20 text-success border-success/30 text-xs">WHO ✓</Badge>
                          <Badge className="bg-info/20 text-info border-info/30 text-xs">ICMR ✓</Badge>
                          <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">MoHFW ✓</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Carousel Controls */}
            <div className="flex justify-center space-x-2 mt-8">
              {vaccines.map((vaccine, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVaccineIndex(index)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                    index === currentVaccineIndex 
                      ? 'bg-brown-dark text-white shadow-lg transform scale-105' 
                      : 'bg-brown-light/40 text-brown-dark hover:bg-brown-light/60'
                  }`}
                >
                  {vaccine.name.split('®')[0]}
                </button>
              ))}
            </div>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                {vaccines.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-2 rounded-full transition-all duration-300 ${
                      index === currentVaccineIndex ? 'bg-brown-dark' : 'bg-brown-light/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Eligibility Tool */}
      <section id="eligibility" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brown-dark mb-4">Smart Eligibility Assessment</h2>
            <p className="text-brown-medium text-lg">Get instant yes/no answers with personalized recommendations</p>
          </div>

          <Card className="mb-8 shadow-xl border-brown-light/30">
            <CardHeader className="bg-gradient-to-r from-brown-light/10 to-beige-light/20">
              <CardTitle className="text-brown-dark">Your Health Profile Assessment</CardTitle>
              <CardDescription className="text-brown-medium">
                Complete at least 3 fields for personalized yes/no recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-brown-dark font-medium">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={userProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 border-brown-light/50 focus:border-brown-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-brown-dark font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={userProfile.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="mt-1 border-brown-light/50 focus:border-brown-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-brown-dark font-medium">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={userProfile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-1 border-brown-light/50 focus:border-brown-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="pregnancy" className="text-brown-dark font-medium">Pregnancy Status</Label>
                  <Select value={userProfile.pregnancyStatus} onValueChange={(value) => handleInputChange('pregnancyStatus', value)}>
                    <SelectTrigger className="mt-1 border-brown-light/50 focus:border-brown-medium">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-pregnant">Not Pregnant</SelectItem>
                      <SelectItem value="pregnant">Pregnant</SelectItem>
                      <SelectItem value="planning">Planning Pregnancy</SelectItem>
                      <SelectItem value="breastfeeding">Breastfeeding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="medical" className="text-brown-dark font-medium">Medical History</Label>
                  <Input
                    id="medical"
                    placeholder="PCOS, anemia, allergies, etc."
                    value={userProfile.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    className="mt-1 border-brown-light/50 focus:border-brown-medium"
                  />
                </div>
                <div>
                  <Label htmlFor="vaccination" className="text-brown-dark font-medium">Last Vaccination</Label>
                  <Input
                    id="vaccination"
                    placeholder="e.g., HPV 1st dose in 2023"
                    value={userProfile.lastVaccination}
                    onChange={(e) => handleInputChange('lastVaccination', e.target.value)}
                    className="mt-1 border-brown-light/50 focus:border-brown-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yes/No Responses */}
          {isFormValid && (
            <Card className="mb-8 shadow-xl border-brown-light/30">
              <CardHeader className="bg-gradient-to-r from-success/5 to-brown-light/10">
                <CardTitle className="text-brown-dark">Instant Assessment Results</CardTitle>
                <CardDescription className="text-brown-medium">Your personalized yes/no recommendations</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {eligibilityResponses.map((response, index) => (
                    response.answer && (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-beige-light/30 to-brown-light/20 border border-brown-light/30">
                        <div className="flex items-center space-x-2">
                          {response.answer === 'yes' ? (
                            <ThumbsUp className="h-6 w-6 text-success" />
                          ) : (
                            <ThumbsDown className="h-6 w-6 text-warning" />
                          )}
                          <Badge 
                            variant={response.answer === 'yes' ? 'default' : 'secondary'}
                            className={response.answer === 'yes' ? 'bg-success text-white' : 'bg-warning/20 text-warning'}
                          >
                            {response.answer.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-brown-dark mb-1">{response.tagline}</h4>
                          <p className="text-sm text-brown-medium">{response.recommendation}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Recommendations */}
          {isFormValid ? (
            <Card className="bg-gradient-to-r from-success/5 to-brown-light/10 shadow-xl border-brown-light/30">
              <CardHeader>
                <CardTitle className="text-brown-dark flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Your Priority Vaccine Plan</span>
                </CardTitle>
                <CardDescription className="text-brown-medium">Based on your assessment, here are your recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPersonalizedRecommendations().map((rec, index) => (
                    <Alert key={index} className="border-brown-light/30 bg-beige-light/20">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription>
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-brown-dark">{rec.vaccine}</strong>
                            <p className="text-brown-medium mt-1">{rec.reason}</p>
                            <Badge variant="outline" className="mt-2 bg-brown-light/20 text-brown-dark border-brown-medium">
                              {rec.tagline}
                            </Badge>
                          </div>
                          <Badge className={`${rec.urgency === 'high' ? 'bg-destructive' : 'bg-warning'} text-white`}>
                            {rec.urgency} priority
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                  {getPersonalizedRecommendations().length === 0 && (
                    <Alert className="bg-success/10 border-success/30">
                      <Shield className="h-4 w-4 text-success" />
                      <AlertDescription className="text-brown-dark">
                        <strong>🌟 Excellent!</strong> You appear to be well-protected. Continue monitoring for new health recommendations.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="default" className="flex-1 bg-brown-dark hover:bg-brown-dark/90">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Recommended Vaccines
                  </Button>
                  <Button variant="outline" className="flex-1 border-brown-medium text-brown-dark hover:bg-brown-light/20">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Smart Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="bg-brown-light/10 border-brown-light/30">
              <Shield className="h-4 w-4 text-brown-dark" />
              <AlertDescription className="text-brown-medium">
                <strong>💡 Ready to start?</strong> Please fill at least 3 fields above to unlock your personalized yes/no recommendations and health insights.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </section>

      {/* Awareness Hub */}
      <section id="awareness" className="py-16 px-4 bg-brown-light/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brown-dark mb-4">Health Awareness Central</h2>
            <p className="text-brown-medium text-lg">Stay informed with verified health insights and community impact</p>
          </div>

          <Tabs defaultValue="news" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 bg-brown-light/20 border-brown-light/30">
              <TabsTrigger value="news" className="data-[state=active]:bg-brown-dark data-[state=active]:text-white">Latest Updates</TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-brown-dark data-[state=active]:text-white">Health Education</TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-brown-dark data-[state=active]:text-white">Community Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="news" className="mt-8">
              <div className="space-y-4">
                {newsItems.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-brown-light/30 hover:border-brown-medium/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="bg-brown-light/20 text-brown-dark border-brown-medium">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                            {item.tagline}
                          </Badge>
                        </div>
                        <span className="text-sm text-brown-medium">{item.time}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-brown-dark mb-2">{item.title}</h3>
                      <p className="text-brown-medium text-sm">Source: {item.source}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-brown-light/30 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-success/20 to-success/10 flex items-center justify-center">
                    <img 
                      src={vaccineVials} 
                      alt="HPV Vaccine education" 
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  <CardHeader className="bg-gradient-to-r from-brown-light/10 to-beige-light/20">
                    <CardTitle className="text-brown-dark">🛡️ Why HPV Vaccines Matter</CardTitle>
                    <Badge variant="outline" className="w-fit bg-success/10 text-success border-success/30">
                      💫 Prevention Excellence
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-brown-medium mb-4 leading-relaxed">
                      Discover how HPV vaccination is revolutionizing cervical cancer prevention and creating a shield of protection for generations of women.
                    </p>
                    <Button variant="outline" className="border-brown-medium text-brown-dark hover:bg-brown-light/20">
                      📚 Read Complete Guide
                    </Button>
                  </CardContent>
                </Card>
                <Card className="shadow-lg border-brown-light/30 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-warning/20 to-warning/10 flex items-center justify-center">
                    <img 
                      src={maternalCare} 
                      alt="Pregnancy and vaccination" 
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  <CardHeader className="bg-gradient-to-r from-brown-light/10 to-beige-light/20">
                    <CardTitle className="text-brown-dark">🤱 Pregnancy & Vaccination</CardTitle>
                    <Badge variant="outline" className="w-fit bg-warning/10 text-warning border-warning/30">
                      👶 Maternal Care Excellence
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-brown-medium mb-4 leading-relaxed">
                      Essential vaccines during pregnancy and family planning — protecting two lives with one decision, ensuring optimal health for mother and child.
                    </p>
                    <Button variant="outline" className="border-brown-medium text-brown-dark hover:bg-brown-light/20">
                      🔍 Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="community" className="mt-8">
              <Card className="shadow-xl border-brown-light/30">
                <CardHeader className="bg-gradient-to-r from-brown-light/10 to-beige-light/20">
                  <CardTitle className="flex items-center space-x-2 text-brown-dark">
                    <Users className="h-5 w-5" />
                    <span>Community Health Impact</span>
                  </CardTitle>
                  <CardDescription className="text-brown-medium">Making a difference together</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5">
                      <div className="text-4xl font-bold text-success mb-2">1.2M+</div>
                      <p className="text-brown-medium font-medium">Women Protected</p>
                      <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/30">
                        Lives Safeguarded
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5">
                      <div className="text-4xl font-bold text-warning mb-2">78%</div>
                      <p className="text-brown-medium font-medium">Coverage Rate</p>
                      <Badge variant="outline" className="mt-2 bg-warning/10 text-warning border-warning/30">
                        Growing Strong
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-info/10 to-info/5">
                      <div className="text-4xl font-bold text-info mb-2">500+</div>
                      <p className="text-brown-medium font-medium">Health Centers</p>
                      <Badge variant="outline" className="mt-2 bg-info/10 text-info border-info/30">
                        Accessible Care
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-brown-dark to-brown-medium text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-beige-light" />
                <span className="text-xl font-bold">VaxAlert</span>
                <Badge className="bg-beige-light text-brown-dark">Saarthi</Badge>
              </div>
              <p className="text-beige-light leading-relaxed">
                Empowering women with verified vaccine information, smart recommendations, and community support for better health protection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-beige-light">Quick Health Actions</h4>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start p-0 h-auto text-beige-light hover:text-white">
                  📄 Download Health Record
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto text-beige-light hover:text-white">
                  🔔 Smart Monthly Reminders
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto text-beige-light hover:text-white">
                  📞 Emergency Health Contacts
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-beige-light">Verified Trust Partners</h4>
              <div className="space-y-2">
                <Badge className="bg-beige-light/20 text-beige-light border-beige-light/30">✅ WHO Verified</Badge>
                <br />
                <Badge className="bg-beige-light/20 text-beige-light border-beige-light/30">🏛️ MoHFW Approved</Badge>
                <br />
                <Badge className="bg-beige-light/20 text-beige-light border-beige-light/30">🔬 ICMR Certified</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-beige-light">24/7 Health Support</h4>
              <div className="space-y-3">
                <p className="text-sm text-beige-light">Women&apos;s Health Helpline</p>
                <p className="text-lg font-bold text-beige-light">1800-XXX-HEALTH</p>
                <Button size="sm" className="mt-2 bg-beige-light text-brown-dark hover:bg-beige-light/90">
                  <Heart className="mr-2 h-4 w-4" />
                  Share Health Love
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-beige-light/30 mt-8 pt-8 text-center text-beige-light">
            <p>&copy; 2024 VaxAlert - Saarthi Platform. Securing women&apos;s health through verified information and smart technology.</p>
            <Badge className="mt-2 bg-beige-light/20 text-beige-light border-beige-light/30">
              🛡️ Be Informed. Be Protected. Be Empowered.
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;