
import { useState } from 'react';
import { ExternalLink, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  fullDescription: string;
  users: string;
  color: string;
  link: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  fullDescription, 
  users, 
  color, 
  link 
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGoToFeature = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="card-feature p-6 text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      
      <p className="text-muted-foreground mb-4">
        {isHovered ? fullDescription : description}
      </p>
      
      <div className="text-sm text-accent-foreground mb-4 font-medium">
        {users}
      </div>
      
      {isHovered ? (
        <Button 
          onClick={handleGoToFeature}
          className="btn-feature w-full group-hover:scale-105 transition-transform duration-300"
        >
          Go to Feature
          <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
      ) : (
        <div className="h-10 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Hover to learn more</span>
        </div>
      )}
    </Card>
  );
};

export default FeatureCard;
