import { X, Users, Heart, Award, Target, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import aboutDrives from '@/assets/about-drives.jpg';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

const AboutModal = ({ isOpen, onClose, onOpenAuth }: AboutModalProps) => {
  if (!isOpen) return null;

  const handleJoinMission = () => {
    onClose();
    onOpenAuth();
  };

  const stats = [
    { icon: Users, value: "50,000+", label: "Women Served" },
    { icon: Heart, value: "25+", label: "Health Services" },
    { icon: Award, value: "98%", label: "Satisfaction Rate" },
    { icon: MapPin, value: "200+", label: "Cities Covered" }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Saarthi Digital Hub Founded",
      description: "Started with a mission to revolutionize women's healthcare through technology"
    },
    {
      year: "2024 Q2",
      title: "First 10,000 Users",
      description: "Reached our first major milestone with incredible user feedback"
    },
    {
      year: "2024 Q3",
      title: "Government Partnership",
      description: "Partnered with state governments to provide scheme navigation"
    },
    {
      year: "2024 Q4",
      title: "50,000+ Community",
      description: "Built a thriving community of women supporting each other"
    }
  ];

  const drives = [
    {
      title: "Rural Health Awareness Campaign",
      location: "Rajasthan Villages",
      date: "October 2024",
      participants: "2,500+ women",
      description: "Conducted health checkups and digital literacy programs in 15 villages"
    },
    {
      title: "Urban Women Wellness Drive",
      location: "Mumbai Corporate Offices",
      date: "September 2024", 
      participants: "1,800+ professionals",
      description: "Workplace wellness sessions focusing on mental and reproductive health"
    },
    {
      title: "Teen Health Education Program",
      location: "Delhi Schools",
      date: "August 2024",
      participants: "3,200+ students",
      description: "Comprehensive health education for teenage girls across 25 schools"
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-5xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-bold text-foreground">About Saarthi Digital Hub</h2>
            <p className="text-muted-foreground mt-1">Empowering women through technology and community</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Mission Statement */}
        <div className="p-6 border-b border-border/50">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-foreground mb-4 leading-relaxed">
                Saarthi Digital Hub is dedicated to revolutionizing women's healthcare through innovative 
                technology solutions. We believe every woman deserves access to comprehensive health 
                information, quality healthcare services, and a supportive community.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2024, we've grown from a simple idea to a comprehensive platform serving 
                over 50,000 women across India, providing everything from period tracking to 
                government scheme navigation.
              </p>
            </div>
            <img 
              src={aboutDrives} 
              alt="Saarthi health awareness drive"
              className="rounded-xl shadow-elegant w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-border/50">
          <h3 className="text-xl font-semibold mb-6 text-center">Our Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="card-feature p-4 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Drives */}
        <div className="p-6 border-b border-border/50">
          <h3 className="text-xl font-semibold mb-6">Our Community Drives</h3>
          <div className="space-y-4">
            {drives.map((drive, index) => (
              <div key={index} className="card-elegant p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{drive.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {drive.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {drive.date}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {drive.participants}
                  </span>
                </div>
                <p className="text-foreground">{drive.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="p-6 border-b border-border/50">
          <h3 className="text-xl font-semibold mb-6">Our Journey</h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{milestone.title}</h4>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 bg-gradient-warm">
          <h3 className="text-xl font-semibold mb-4 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="card-elegant p-4">
              <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium">24/7 Support</p>
              <p className="text-sm text-muted-foreground">1800-SAARTHI</p>
            </div>
            <div className="card-elegant p-4">
              <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium">Email Us</p>
              <p className="text-sm text-muted-foreground">hello@saarthi.health</p>
            </div>
            <div className="card-elegant p-4">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium">Our Vision</p>
              <p className="text-sm text-muted-foreground">Healthier women, stronger communities</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button className="btn-hero hover:scale-105 transition-transform duration-300" onClick={handleJoinMission}>
              Join Our Mission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
