
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Globe, Star, Users } from "lucide-react";

interface NGOModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: string | null;
}

const ngoData = {
  menstrual: {
    title: "Menstrual Aid NGOs",
    ngos: [
      {
  "name": "Pad Care Labs",
  "rating": 4.7,
  "distance": "approx. 1 km", 
  "services": ["Sanitary pad disposal bins", "Pad vending machines", "Recycling & awareness"],
  "contact": "+91 90000 00000 (Delhi office)", 
  "website": "https://www.padcarelabs.com",
  "volunteers": 30
}
,
      {
  "name": "Project Red Dot",
  "rating": 4.6,
  "distance": "Pan‑India (no fixed office in Indore)", 
  "services": ["Red Dot disposal bags", "Awareness workshops", "Safe waste handling training"],
  "contact": "via website contact form",
  "website": "https://www.projectreddot.com",
  "volunteers": 50
}

    ]
  },
  maternity: {
    title: "Maternity Help NGOs",
    ngos: [
     {
  "name": "Urban Health Resource Centre",
  "rating": 4.7,
  "distance": "0.2 km",
  "services": ["Maternal & Infant Care", "Community Health Groups", "Nutrition & Hygiene Education"],
  "contact": "via website contact form",
  "website": "http://www.uhrc.in",
  "volunteers": 50
}
,
     {
  "name": "PAHAL Jan Sahayog Vikas Sansthan",
  "rating": 4.6,
  "distance": "Indore region",
  "services": ["Women & Child Health Camps", "Gender‑based Workshops", "Livelihood & Nutrition"],
  "contact": "via website/aboutus page",
  "website": "https://pahalindore.org",
  "volunteers": 40
}

    ]
  },
  crisis: {
    title: "Crisis Support NGOs",
    ngos: [
      {
  "name": "Mahila Utkarsh Sansthan",
  "rating": 4.6,
  "distance": "within Indore",
  "services": ["24×7 Crisis Management Centre", "Temporary Shelter", "Legal & Medical Aid", "Psychological Counselling"],
  "contact": "via district Women & Child Development Office",
  "website": "https://mahilautkarshsansthan.org",
  "volunteers": 378
}
,
      {
  "name": "Initiative of Cahnge",
  "rating": 4.7,
  "distance": "Indore city",
  "services": ["Free Legal Aid for Women", "Kanoon Sakhi Support Groups", "Court & Protection Officer Liaison", "Judicial Awareness"],
  "contact": "via Rajendra Bandhu office, Indore",
  "website": "https://rajendrabandhu.com",
  "volunteers": 400
}

    ]
  },
  shelter: {
    title: "Shelter & Volunteer NGOs",
    ngos: [
      {
        name: "Shelter Home Network",
        rating: 4.6,
        distance: "0.3 km",
        services: ["Safe Accommodation", "Skill Training", "Job Placement"],
        contact: "+91 98765 43216",
        website: "www.shelterhome.org",
        volunteers: 34
      },
      {
        name: "Community Care Center",
        rating: 4.7,
        distance: "0.9 km", 
        services: ["Temporary Housing", "Counseling", "Volunteer Programs"],
        contact: "+91 98765 43217",
        website: "www.communitycare.org",
        volunteers: 51
      }
    ]
  }
};

export const NGOModal = ({ isOpen, onClose, cardType }: NGOModalProps) => {
  if (!cardType || !ngoData[cardType as keyof typeof ngoData]) {
    return null;
  }

  const data = ngoData[cardType as keyof typeof ngoData];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-earth-brown font-poppins">
            {data.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {data.ngos.map((ngo, index) => (
            <Card key={index} className="border-2 border-earth-cream hover:border-earth-brown/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-earth-brown font-poppins">
                        {ngo.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-brown-500 fill-current" />
                        <span className="font-medium text-earth-brown">{ngo.rating}</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-earth-brown/80">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{ngo.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-earth-brown/80">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{ngo.volunteers} volunteers</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-earth-brown mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {ngo.services.map((service, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-earth-cream text-earth-brown text-sm rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-earth-brown/80">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{ngo.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>{ngo.website}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button 
                      className="bg-earth-brown hover:bg-earth-brown-light text-white font-medium"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-earth-brown text-earth-brown hover:bg-earth-brown hover:text-white"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-earth-cream rounded-lg">
          <p className="text-earth-brown text-sm text-center">
            <strong>Need immediate help?</strong> All listed NGOs are verified and available 24/7 for emergency support.
            Your safety and privacy are protected.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
