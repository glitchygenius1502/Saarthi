
import { useState } from 'react';
import { ArrowLeft, Phone, Mail, MessageSquare, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage = ({ onBack }: HelpPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId] = useState(() => `SAR-${Date.now().toString().slice(-6)}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  const categories = [
    'Account Issues',
    'Feature Support',
    'Technical Problems',
    'Billing & Subscriptions',
    'Privacy & Security',
    'General Inquiry'
  ];

  const supportStats = [
    { icon: Clock, label: 'Average Response', value: '< 2 hours' },
    { icon: CheckCircle, label: 'Resolution Rate', value: '98.5%' },
    { icon: MessageSquare, label: 'Active Tickets', value: '< 50' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-elegant p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Ticket Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your support request has been received. We'll get back to you soon.
          </p>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Ticket ID</p>
            <p className="font-mono font-semibold text-foreground">{ticketId}</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span>Status: Under Review</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Expected response: Within 2 hours</span>
            </div>
          </div>
          <Button onClick={onBack} className="btn-hero w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Help & Support</h1>
              <p className="text-white/80">We're here to help you 24/7</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Support Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportStats.map((stat, index) => (
              <Card key={index} className="card-elegant p-4 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Help Form */}
          <section>
            <Card className="card-elegant p-6">
              <h2 className="text-xl font-semibold mb-4">Submit a Support Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Feature issue</option>
                    <option value="high">High - Account problem</option>
                    <option value="urgent">Urgent - Security concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Please describe your issue in detail..."
                    required
                  />
                </div>

                <Button type="submit" className="btn-hero w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </form>
            </Card>
          </section>

          {/* Contact Options */}
          <section>
            <div className="space-y-6">
              <Card className="card-elegant p-6">
                <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">24/7 Support Hotline</p>
                      <p className="text-sm text-muted-foreground">1800-SAARTHI (1800-722-7844)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@saarthi.health</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 9 AM - 9 PM IST</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="card-elegant p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    How to track my period?
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Booking doctor consultations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Accessing government schemes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Managing health records
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
