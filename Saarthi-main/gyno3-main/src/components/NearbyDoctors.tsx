import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const API_BASE_URL = "http://127.0.0.1:8000";

const NearbyDoctors = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const { toast } = useToast();

  // 🔸 Default sample doctors for fallback
  const defaultDoctors = [
    {
      id: "1",
      name: "Dr. Neha Jain",
      rating: 4.8,
      clinic: "Aarogya Gynae Clinic",
      city: "Gwalior",
      timing: "10 AM - 1 PM",
      speciality: "Obstetrician & Gynecologist",
      lat: 26.2183,
      lng: 78.1828,
    },
    {
      id: "2",
      name: "Dr. Smita Agrawal",
      rating: 4.6,
      clinic: "Indira IVF Hospital",
      city: "Gwalior",
      timing: "9:30 AM - 2 PM",
      speciality: "IVF & Fertility Specialist",
      lat: 26.2224,
      lng: 78.178,
    },
    {
      id: "3",
      name: "Dr. Ritu Bhargava",
      rating: 4.7,
      clinic: "Bhargava Women’s Clinic",
      city: "Gwalior",
      timing: "5 PM - 8 PM",
      speciality: "Endometriosis & Laparoscopy Expert",
      lat: 26.2251,
      lng: 78.1902,
    },
  ];

  // Initially show default doctors
  useEffect(() => {
    setDoctors(defaultDoctors);
  }, []);

  const handleUseLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          toast({
            title: "Location found!",
            description: "Showing gynecologists near you",
          });

          try {
            const response = await axios.get(`${API_BASE_URL}/gynecologists`, {
              params: {
                lat: latitude,
                lng: longitude,
                radius_km: 100,
              },
            });

            const data = response.data;

            if (!data || data.length === 0) {
              toast({
                title: "No doctors found nearby",
                description: "Showing default sample list",
              });
              setDoctors(defaultDoctors);
            } else {
              setDoctors(data);
            }
          } catch (error: any) {
            console.error("API error:", error);
            toast({
              title: "Error fetching doctors",
              description: error.message || "Please try again later",
              variant: "destructive",
            });
            setDoctors(defaultDoctors);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          toast({
            title: "Location access denied",
            description: "Please allow location access or search manually",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Please search manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Section */}
      <Card className="bg-[#fff7f2] border-[#fde0e0]">
        <CardHeader>
          <CardTitle className="text-[#5c3b28] flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Find Gynecologists Nearby</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleUseLocation}
              disabled={isLoading}
              className="bg-[#e03131] hover:bg-[#e03131]/90 text-white rounded-full flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{isLoading ? "Finding location..." : "📍 Use My Location"}</span>
            </Button>
            {location && (
              <div className="text-sm text-[#5c3b28]/70 flex items-center">
                📍 Current location: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor: any) => (
          <DoctorCard
            key={doctor.id}
            doctor={{
              id: doctor.id,
              name: doctor.name,
              rating: doctor.rating,
              clinic: doctor.clinic,
              address: doctor.city,
              timings: doctor.timing,
              specialization: doctor.speciality,
              image: "👩‍⚕️",
              phone: "+91-9876543210",
            }}
          />
        ))}
      </div>

      {/* Map Section */}
      <Card className="bg-[#fff7f2] border-[#fde0e0]">
        <CardContent className="p-0">
          {location ? (
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: "400px", width: "100%", borderRadius: "0.5rem" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Marker */}
              <Marker position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {/* Doctor Markers */}
              {doctors.map((doc: any) => (
                <Marker
                  key={doc.id}
                  position={[doc.lat ?? location.lat + Math.random() * 0.02, doc.lng ?? location.lng + Math.random() * 0.02]}
                  icon={customIcon}
                >
                  <Popup>
                    <strong>{doc.name}</strong><br />
                    {doc.clinic}, {doc.city}<br />
                    {doc.speciality}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#5c3b28]/70 text-center">
              <div>
                <span className="text-4xl mb-2 block">📍</span>
                <p>Map will appear once location is detected</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyDoctors;
