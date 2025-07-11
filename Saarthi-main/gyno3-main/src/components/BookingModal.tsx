
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  bookingType: "call" | "video" | "appointment";
}

const BookingModal = ({ isOpen, onClose, doctorName, bookingType }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const { toast } = useToast();

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Both date and time are required to book your appointment",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking Confirmed! ✅",
      description: `Your ${bookingType} with ${doctorName} on ${selectedDate} at ${selectedTime} has been confirmed. Details sent to your registered email.`,
    });
    
    onClose();
    setSelectedDate("");
    setSelectedTime("");
  };

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#fff7f2] border-[#fde0e0] max-w-md mx-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-[#5c3b28] flex items-center justify-center space-x-2 text-lg">
            <span>📅</span>
            <span>Book {bookingType === "call" ? "Phone Call" : bookingType === "video" ? "Video Consultation" : "Appointment"}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-[#5c3b28]/70 bg-[#fde0e0] p-3 rounded-lg text-center">
            <span className="font-medium">👩‍⚕️ {doctorName}</span>
          </div>

          <div>
            <Label htmlFor="date" className="text-[#5c3b28] font-medium">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="border-[#fde0e0] focus:border-[#e03131] rounded-lg"
            />
          </div>

          <div>
            <Label className="text-[#5c3b28] font-medium">Select Time</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className={selectedTime === time 
                    ? "bg-[#e03131] hover:bg-[#e03131]/90 text-white" 
                    : "border-[#fde0e0] text-[#5c3b28] hover:bg-[#fde0e0]"
                  }
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#fde0e0] text-[#5c3b28] hover:bg-[#fde0e0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              className="flex-1 bg-[#2f9e44] hover:bg-[#2f9e44]/90 text-white"
            >
              Confirm Booking
            </Button>
          </div>

          <div className="text-xs text-[#5c3b28]/60 text-center bg-[#fde0e0] p-3 rounded-lg">
            <div className="space-y-1">
              <div>📧 Confirmation details will be sent to your registered email</div>
              <div>📱 SMS reminder will be sent to your phone number</div>
              <div>🔔 You'll receive a notification 30 minutes before your appointment</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
