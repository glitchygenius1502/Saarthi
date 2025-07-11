
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, MessageCircle, AlertTriangle, Shield } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  const emergencyContacts = [
    {
      name: "National Women's Helpline",
      number: "1091",
      description: "24/7 support for women in distress",
      type: "primary"
    },
    {
      name: "Police Emergency",
      number: "100", 
      description: "Immediate police assistance",
      type: "primary"
    },
    {
      name: "Crisis Support Helpline",
      number: "+91 98765 00911",
      description: "Mental health and crisis counseling",
      type: "secondary"
    },
    {
      name: "Domestic Violence Helpline",
      number: "181",
      description: "Support for domestic violence cases",
      type: "secondary"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600 font-poppins flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Emergency Support
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Immediate Action Section */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-700">
                  You are not alone. Help is available immediately.
                </h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <Button 
                  size="lg"
                  className="bg-red-600  text-white font-medium"
                  onClick={() => window.open('tel:1091')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 1091 Now
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  onClick={() => window.open('tel:100')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Police (100)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-earth-brown font-poppins">
              Emergency Contacts
            </h3>
            
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="border-earth-cream hover:border-earth-brown/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-earth-brown">{contact.name}</h4>
                      <p className="text-sm text-earth-brown/70">{contact.description}</p>
                      <div className="text-lg font-bold text-earth-brown mt-1">
                        {contact.number}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className={contact.type === 'primary' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-earth-brown-light'}
                        onClick={() => window.open(`tel:${contact.number}`)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Options */}
          <Card className="border-earth-cream">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-earth-brown mb-4 font-poppins">
                Additional Support Options
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="border-earth-brown text-earth-brown hover:bg-earth-brown hover:text-white p-4 h-auto flex-col"
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span className="font-medium">Emergency Chat</span>
                  <span className="text-sm opacity-70">Anonymous support chat</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-earth-brown text-earth-brown hover:bg-earth-brown hover:text-white p-4 h-auto flex-col"
                >
                  <MapPin className="h-6 w-6 mb-2" />
                  <span className="font-medium">Share Location</span>
                  <span className="text-sm opacity-70">Send location to trusted contacts</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Note */}
          <div className="p-4 bg-earth-cream rounded-lg">
            <p className="text-earth-brown text-sm text-center">
              <strong>Your Safety First:</strong> If you're in immediate danger, call 100 (Police) or 1091 (Women's Helpline). 
              Your location and personal information are kept secure and confidential.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
