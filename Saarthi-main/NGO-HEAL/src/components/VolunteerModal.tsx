
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpingHand, Heart, Users, Clock } from "lucide-react";
import { useState } from "react";

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerModal = ({ isOpen, onClose }: VolunteerModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    interests: [] as string[],
    availability: '',
    experience: '',
    motivation: ''
  });

  const volunteerAreas = [
    { id: 'menstrual', label: 'Menstrual Health Support', icon: Heart },
    { id: 'maternity', label: 'Maternity Care Assistance', icon: Users },
    { id: 'crisis', label: 'Crisis Support & Counseling', icon: HelpingHand },
    { id: 'shelter', label: 'Shelter & Rehabilitation', icon: HelpingHand },
    { id: 'education', label: 'Health Education & Awareness', icon: Users },
    { id: 'fundraising', label: 'Fundraising & Events', icon: Heart }
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Volunteer registration:', formData);
    
    // Show success message (in real app, would send to backend)
    alert('Thank you for your interest in volunteering! We will contact you within 48 hours.');
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      interests: [],
      availability: '',
      experience: '',
      motivation: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-earth-brown font-poppins flex items-center gap-2">
            <HelpingHand className="h-6 w-6" />
            Become a Volunteer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-earth-brown mb-4">Personal Information</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">City/Location *</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Areas of Interest */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-earth-brown mb-4">Areas of Interest</h3>
              <p className="text-sm text-earth-brown/70 mb-4">Select all areas where you'd like to volunteer</p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {volunteerAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div key={area.id} className="flex items-center space-x-3">
                      <Checkbox 
                        id={area.id}
                        checked={formData.interests.includes(area.id)}
                        onCheckedChange={(checked) => handleInterestChange(area.id, checked as boolean)}
                      />
                      <Label htmlFor={area.id} className="flex items-center space-x-2 cursor-pointer">
                        <Icon className="h-4 w-4 text-earth-brown" />
                        <span>{area.label}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-earth-brown mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Availability
              </h3>
              
              <div>
                <Label htmlFor="availability">How much time can you commit per week?</Label>
                <select 
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full mt-1 p-2 border border-earth-cream rounded-md focus:ring-2 focus:ring-earth-brown focus:border-transparent"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="1-3 hours">1-3 hours per week</option>
                  <option value="4-6 hours">4-6 hours per week</option>
                  <option value="7-10 hours">7-10 hours per week</option>
                  <option value="10+ hours">More than 10 hours per week</option>
                  <option value="flexible">Flexible based on need</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Experience & Motivation */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experience">Previous Volunteering Experience (Optional)</Label>
                  <Textarea 
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="mt-1"
                    placeholder="Describe any previous volunteering or relevant experience..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                  <Textarea 
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    className="mt-1"
                    placeholder="Tell us what motivates you to help women in need..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button 
              type="submit"
              size="lg"
              className="flex-1 bg-earth-brown hover:bg-earth-brown-light text-white font-medium"
            >
              <HelpingHand className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              className="border-earth-brown text-earth-brown hover:bg-earth-brown hover:text-white"
            >
              Cancel
            </Button>
          </div>

          {/* Note */}
          <div className="p-4 bg-earth-cream rounded-lg">
            <p className="text-earth-brown text-sm text-center">
              <strong>Next Steps:</strong> After submitting, our team will review your application and contact you within 48 hours. 
              We'll provide training and match you with opportunities that fit your interests and schedule.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
