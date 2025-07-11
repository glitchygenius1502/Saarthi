
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpingHand, Heart, Users } from "lucide-react";

interface VolunteerSectionProps {
  onVolunteerClick: () => void;
}

export const VolunteerSection = ({ onVolunteerClick }: VolunteerSectionProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-earth-cream/50 to-earth-warm">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden warm-glow border-0 bg-white/90">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0 items-stretch">
              {/* Left side - Community illustration */}
              <div className="relative bg-gradient-to-br from-earth-cream/30 to-earth-warm p-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/acf5df28-a7ac-4435-9535-04c217319824.png"
                  alt="Diverse women holding supportive signs showing unity and care in the community"
                  className="w-full h-full object-contain rounded-lg warm-glow max-h-96"
                />
                
                {/* Floating supportive elements */}
                <div className="absolute top-6 left-6 w-8 h-8 bg-earth-brown/20 rounded-full flex items-center justify-center icon-float">
                  <Heart className="h-4 w-4 text-earth-brown" />
                </div>
                <div className="absolute bottom-6 right-6 w-8 h-8 bg-earth-brown/30 rounded-full flex items-center justify-center icon-float" style={{animationDelay: '1s'}}>
                  <Users className="h-4 w-4 text-earth-brown" />
                </div>
                <div className="absolute top-1/2 right-4 w-6 h-6 bg-earth-cream/80 rounded-full flex items-center justify-center icon-float" style={{animationDelay: '2s'}}>
                  <div className="w-3 h-3 bg-earth-brown rounded-full"></div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center gentle-fade" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-earth-brown to-earth-brown-light rounded-full flex items-center justify-center mr-4 icon-float">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-earth-brown font-poppins">
                    Join Our Community
                  </h2>
                </div>
                
                <p className="text-lg text-earth-brown/80 mb-8 leading-relaxed">
                  Become a volunteer and help other women in your community. Your support can make a real difference in someone's life.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-earth-brown/20 rounded-full flex items-center justify-center mt-1">
                      <Heart className="h-3 w-3 text-earth-brown" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-brown">Support women in crisis situations</h4>
                      <p className="text-earth-brown/70 text-sm">Provide immediate care and emotional support to those who need it most</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-earth-brown/20 rounded-full flex items-center justify-center mt-1">
                      <HelpingHand className="h-3 w-3 text-earth-brown" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-brown">Help distribute essential supplies</h4>
                      <p className="text-earth-brown/70 text-sm">Assist in providing menstrual products, maternity kits, and other necessities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-earth-brown/20 rounded-full flex items-center justify-center mt-1">
                      <Users className="h-3 w-3 text-earth-brown" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-earth-brown">Provide emotional support and guidance</h4>
                      <p className="text-earth-brown/70 text-sm">Be a caring presence and help build a stronger community network</p>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="bg-earth-brown hover:bg-earth-brown-light text-white px-8 py-4 text-lg font-semibold rounded-xl warm-glow hover:shadow-xl transition-all duration-500 btn-glow self-start"
                  onClick={onVolunteerClick}
                >
                  <Users className="mr-2 h-5 w-5 icon-float" />
                  Become a Volunteer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
