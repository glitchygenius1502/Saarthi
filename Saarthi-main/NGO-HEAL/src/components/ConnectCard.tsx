
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ConnectCardProps {
  card: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
  };
  index: number;
  onClick: () => void;
}

export const ConnectCard = ({ card, index, onClick }: ConnectCardProps) => {
  const Icon = card.icon;
  
  return (
    <Card 
      className={`cursor-pointer card-hover ${card.bgColor} border-0 shadow-lg group animate-slide-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-earth-brown mb-2 font-poppins">
          {card.title}
        </h3>
        
        <p className="text-earth-brown/70 text-sm leading-relaxed">
          {card.description}
        </p>
        
        <div className="mt-4 text-xs text-earth-brown/60 font-medium">
          Click to connect →
        </div>
      </CardContent>
    </Card>
  );
};
