
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { bookAppointment, getToken, goToLogin } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId?: string;
  doctorName: string;
  clinic?: string;
  address?: string;
  bookingType: "call" | "video" | "appointment";
}

const BookingModal = ({ isOpen, onClose, doctorId, doctorName, clinic, address, bookingType }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Both date and time are required to book your appointment",
        variant: "destructive",
      });
      return;
    }

    if (!getToken()) {
      toast({
        title: "Please sign in first",
        description: "You need a Saarthi account to book. Redirecting you to sign in…",
        variant: "destructive",
      });
      setTimeout(goToLogin, 1200);
      return;
    }

    setSubmitting(true);
    const { ok, status, data } = await bookAppointment({
      doctorId,
      doctorName,
      clinic,
      address,
      date: selectedDate,
      time: selectedTime,
      mode: bookingType,
    });
    setSubmitting(false);

    if (!ok) {
      if (status === 401) {
        toast({ title: "Session expired", description: "Please sign in again.", variant: "destructive" });
        setTimeout(goToLogin, 1200);
        return;
      }
      toast({ title: "Could not book", description: data?.error || "Please try again.", variant: "destructive" });
      return;
    }

    toast({
      title: "Appointment booked! ✅",
      description: `Your appointment with ${doctorName} on ${selectedDate} at ${selectedTime} is saved to your account.`,
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
              disabled={submitting}
              className="flex-1 bg-[#2f9e44] hover:bg-[#2f9e44]/90 text-white disabled:opacity-70"
            >
              {submitting ? "Booking…" : "Confirm Booking"}
            </Button>
          </div>

          <div className="text-xs text-[#5c3b28]/60 text-center bg-[#fde0e0] p-3 rounded-lg">
            <div className="space-y-1">
              <div>🔐 Your appointment is saved securely to your Saarthi account</div>
              <div>📋 View it any time under your bookings</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
