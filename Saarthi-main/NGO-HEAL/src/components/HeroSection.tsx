
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, HelpingHand } from "lucide-react";

export const HeroSection = () => {
  const handleConnectClick = () => {
    const connectSection = document.getElementById('connect');
    if (connectSection) {
      connectSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-earth-warm via-earth-cream/30 to-earth-warm">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="gentle-fade">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-earth-brown mb-6 font-poppins leading-tight">
              Instantly Connect with
              <span className="block text-earth-brown-light">Trusted NGOs</span>
            </h1>
            
            <p className="text-xl text-earth-brown/80 mb-8 leading-relaxed">
              Get help for menstrual health, maternity care, shelter, or crisis support — quickly and safely.
            </p>
            
            <Button 
              size="lg"
              className="bg-earth-brown hover:bg-earth-brown-light text-white px-8 py-4 text-xl font-semibold rounded-xl warm-glow hover:shadow-xl transition-all duration-500 btn-glow"
              onClick={handleConnectClick}
            >
              <Heart className="mr-2 h-6 w-6 icon-float" />
              Connect Now
            </Button>
            
            <div className="mt-8 flex items-center space-x-6 text-earth-brown/70">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm">Verified NGOs</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                <span className="text-sm">Safe & Secure</span>
              </div>
            </div>
          </div>

          {/* Illustration Side */}
          <div className="relative gentle-fade" style={{animationDelay: '0.3s'}}>
            <Card className="overflow-hidden warm-glow border-0">
              <CardContent className="p-0">
                <div className=" bg-gradient-to-br from-earth-cream/30 to-earth-warm flex items-center justify-center relative">
                  {/* Supportive women illustration */}
                  <img 

                    src="/lovable-uploads/8677b0de-d5cc-49c9-b70c-e0016c2cc6fe.png"
                    alt="Two women embracing each other showing care and emotional support"
                    className="w-full h-full object-contain rounded-lg warm-glow max-h-80"
                  />
                  
                  {/* Floating supportive elements */}
                  <div className="absolute top-6 left-6 w-8 h-8 bg-earth-brown/20 rounded-full flex items-center justify-center icon-float">
                    <Heart className="h-4 w-4 text-earth-brown" />
                  </div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 bg-earth-brown/30 rounded-full flex items-center justify-center icon-float" style={{animationDelay: '1s'}}>
                    <Users className="h-4 w-4 text-earth-brown" />
                  </div>
                  <div className="absolute top-1/2 left-4 w-6 h-6 bg-earth-cream/80 rounded-full flex items-center justify-center icon-float" style={{animationDelay: '2s'}}>
                    <div className="w-3 h-3 bg-earth-brown rounded-full"></div>
                  </div>
                  <div className="absolute top-1/4 right-8 w-6 h-6 bg-earth-brown/10 rounded-full flex items-center justify-center icon-float" style={{animationDelay: '1.5s'}}>
                    <Heart className="h-3 w-3 text-earth-brown" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trust indicator */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 warm-glow">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-earth-brown" />
                <span className="text-sm font-medium text-earth-brown">Trusted & Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
