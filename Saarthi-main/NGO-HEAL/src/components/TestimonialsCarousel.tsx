
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, HelpingHand, HeartHandshakeIcon, Droplet, Baby, HeartPulse, PhoneCall } from "lucide-react";

export const TestimonialsCarousel = () => {
  const testimonials = [
    {
      name: "Priya S.",
      location: "Mumbai",
      text: "Found immediate help during my pregnancy complications. The NGO connected me to a hospital within minutes.",
      type: "maternity",
      icon: Heart
    },
    {
      name: "Anita K.",
      location: "Delhi", 
      text: "The crisis support team helped me find courage and connected me to legal aid. I'm safe now because of them.",
      type: "crisis",
      icon: PhoneCall
    },
    {
      name: "Meera R.",
      location: "Bangalore",
      text: "As a volunteer, I've helped distribute hygiene kits to 200+ women. It's the most fulfilling work I've ever done.",
      type: "volunteer",
      icon: Users
    }
  ];

  const partnerLogos = [
    { name: "Women's Safety Foundation", icon: HeartHandshakeIcon },
    { name: "Menstrual Health Alliance", icon: Droplet },
    { name: "Maternity Care Network", icon: Baby },
    { name: "Crisis Support India", icon: HelpingHand }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Testimonials */}
        <div className="text-center mb-12 gentle-fade">
          <h2 className="text-3xl sm:text-4xl font-bold text-earth-brown mb-4 font-poppins">
            Real Stories, Real Impact
          </h2>
          <p className="text-lg text-earth-brown/80">
            Hear from women whose lives have been transformed through our network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
              <Card 
                key={index} 
                className="bg-white warm-glow border-0 hover:shadow-xl transition-all duration-500 gentle-fade card-hover"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-earth-brown to-earth-brown-light rounded-full flex items-center justify-center mr-3 icon-float">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-earth-brown">{testimonial.name}</div>
                      <div className="text-sm text-earth-brown/60">{testimonial.location}</div>
                    </div>
                  </div>
                  
                  <p className="text-earth-brown/80 italic leading-relaxed mb-4">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center text-earth-brown">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="h-4 w-4 fill-current mr-1" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Partner Logos */}
        <div className="text-center mb-8 gentle-fade">
          <h3 className="text-2xl font-bold text-earth-brown mb-4 font-poppins">
            Trusted Partners
          </h3>
          <p className="text-earth-brown/70">
            Working with verified NGOs and organizations across India
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partnerLogos.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <Card 
                key={index}
                className="bg-earth-cream/50 border-0 hover:bg-white hover:shadow-md transition-all duration-500 cursor-pointer card-hover gentle-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-earth-brown/20 to-earth-brown/10 rounded-full flex items-center justify-center mx-auto mb-3 icon-float">
                    <Icon className="h-6 w-6 text-earth-brown" />
                  </div>
                  <div className="text-sm font-medium text-earth-brown">
                    {partner.name}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
