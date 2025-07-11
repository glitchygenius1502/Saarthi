
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BookingModal from "./BookingModal";
import CallReceptionModal from "./CallReceptionModal";

interface Doctor {
  id: number;
  name: string;
  rating: number;
  clinic: string;
  address: string;
  timings: string;
  specialization: string;
  image: string;
  phone: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const { toast } = useToast();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"call" | "video" | "appointment">("appointment");

  // Map doctor IDs to the uploaded images
  const doctorImages = {
    1: "/lovable-uploads/41f02828-87b7-45bb-9b25-97302feddb2f.png",
    2: "/lovable-uploads/e38ca779-419c-41f2-b04d-993e341151c1.png",
    3: "/lovable-uploads/853236d1-df52-4484-8cdb-2e7de71513b2.png",
    4: "/lovable-uploads/a9646c7b-0a9b-42b9-9a64-457a680878ec.png",
    5: "/lovable-uploads/41f02828-87b7-45bb-9b25-97302feddb2f.png",
    6: "/lovable-uploads/e38ca779-419c-41f2-b04d-993e341151c1.png"
  };

  const handleCall = () => {
    setIsCallModalOpen(true);
  };

  const handleBook = () => {
    setBookingType("appointment");
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <Card className="bg-[#fff7f2] border-[#fde0e0] hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <img 
                src={doctorImages[doctor.id as keyof typeof doctorImages] || doctorImages[1]} 
                alt={doctor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#fde0e0]"
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-[#5c3b28] text-lg">{doctor.name}</h3>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium text-[#5c3b28]">{doctor.rating}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-[#5c3b28]/80">
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>{doctor.clinic}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>{doctor.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>{doctor.timings}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🧬</span>
                  <span className="font-medium text-[#2f9e44]">{doctor.specialization}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex-1 border-[#e03131] text-[#e03131] hover:bg-[#e03131] hover:text-white rounded-full"
            >
              📞 Call
            </Button>
            <Button
              onClick={handleBook}
              className="flex-1 bg-[#2f9e44] hover:bg-[#2f9e44]/90 text-white rounded-full"
            >
              📅 Book
            </Button>
          </div>
        </CardContent>
      </Card>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctorName={doctor.name}
        bookingType={bookingType}
      />

      <CallReceptionModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
      />
    </>
  );
};

export default DoctorCard;
