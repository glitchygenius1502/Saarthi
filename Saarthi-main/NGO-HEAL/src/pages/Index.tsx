
import { ArrowLeft, Droplet, Baby, Shield, House, BellRing, Heart, Users, HelpingHand, Building2,MapPin, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ConnectCard } from "@/components/ConnectCard";
// import { EmergencyBanner } from "@/components/EmergencyBanner";
import { VolunteerSection } from "@/components/VolunteerSection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { NGOModal } from "@/components/NGOModal";
import { EmergencyModal } from "@/components/EmergencyModal";
import { VolunteerModal } from "@/components/VolunteerModal";

const Index = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);

  const connectCards = [
    {
      id: "menstrual",
      title: "Menstrual Aid",
      description: "Free sanitary pads, hygiene kits & health camps",
      icon: Droplet,
      color: "from-red-400 to-pink-500",
      bgColor: "bg-red-50 hover:bg-red-100"
    },
    {
      id: "maternity", 
      title: "Maternity Help",
      description: "Pregnancy care, checkups & maternity kits",
      icon: Baby,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50 hover:bg-blue-100"
    },
    {
      id: "crisis",
      title: "Crisis Support", 
      description: "Immediate help for abuse, harassment & mental health",
      icon: HeartHandshake,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    },
    {
      id: "shelter",
      title: "Shelter & Volunteer",
      description: "Safe shelter homes & volunteer opportunities",
      icon: House,
      color: "from-green-400 to-emerald-500", 
      bgColor: "bg-green-50 hover:bg-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-earth-warm">
      {/* Navigation with Go Back Button */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-earth-brown shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-earth-brown hover:bg-earth-cream transition-colors duration-200"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-earth-brown" />
              <span className="font-poppins font-bold text-4xl text-earth-brown">NGO Heal </span>
              
      --Your Bridge to Support, Health, and Hope.
            </div>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      {/* Emergency Banner - Fixed at top */}
      {/* <EmergencyBanner onEmergencyClick={() => setShowEmergency(true)} /> */}

      {/* Main Content */}
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Connect Cards */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" id="connect">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-earth-brown mb-4 font-poppins">
                Quick Connect to Support
              </h2>
              <p className="text-lg text-earth-brown/80 max-w-2xl mx-auto">
                Choose your area of need and instantly connect with verified NGOs near you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {connectCards.map((card, index) => (
                <ConnectCard 
                  key={card.id}
                  card={card}
                  index={index}
                  onClick={() => setSelectedCard(card.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Section */}
        <VolunteerSection onVolunteerClick={() => setShowVolunteerForm(true)} />

        {/* Testimonials Carousel */}
        <TestimonialsCarousel />

        {/* Trust Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-earth-cream/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-earth-brown rounded-full mb-6">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-earth-brown mb-4 font-poppins">
              Your Location & Data is Secure
            </h3>
            <p className="text-earth-brown/80 text-lg max-w-2xl mx-auto">
              We use encrypted connections and never store personal information without your consent. 
              Your safety and privacy are our top priorities.
            </p>
          </div>
        </section>
      </main>

      {/* Modals */}
      <NGOModal 
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        cardType={selectedCard}
      />

      <EmergencyModal 
        isOpen={showEmergency}
        onClose={() => setShowEmergency(false)}
      />

      <VolunteerModal 
        isOpen={showVolunteerForm}
        onClose={() => setShowVolunteerForm(false)}
      />
    </div>
  );
};

export default Index;
