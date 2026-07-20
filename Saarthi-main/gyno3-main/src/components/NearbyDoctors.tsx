import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Same-origin backend (served under /api on the unified Saarthi deployment).
const API_BASE_URL = "/api/gyno";
const INDIA_CENTER: [number, number] = [22.9734, 78.6569];

// Recenters/fits the map imperatively when target changes.
const MapController = ({ center, zoom, bounds }: { center: [number, number]; zoom: number; bounds?: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds as any, { padding: [50, 50] });
    } else {
      map.setView(center, zoom);
    }
  }, [center[0], center[1], zoom, JSON.stringify(bounds)]); // eslint-disable-line
  return null;
};

const NearbyDoctors = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ name: string; km: number; mins: number } | null>(null);
  const { toast } = useToast();

  const fetchDoctors = async (coords?: { lat: number; lng: number }) => {
    setIsLoading(true);
    try {
      const params: any = { limit: 30 };
      if (coords) {
        params.lat = coords.lat;
        params.lng = coords.lng;
        params.radius = 500;
      }
      const res = await axios.get(`${API_BASE_URL}/doctors`, { params });
      const list = res.data?.doctors ?? [];
      setDoctors(list);
      if (coords && list.length === 0) {
        toast({ title: "No doctors found nearby", description: "Try widening your search." });
      }
    } catch (error: any) {
      toast({ title: "Could not load doctors", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Load a general list on mount.
  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Please search manually.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(coords);
        toast({ title: "Location found!", description: "Showing gynecologists near you." });
        fetchDoctors(coords);
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Location access denied",
          description: "Allow location access to find doctors near you.",
          variant: "destructive",
        });
      }
    );
  };

  // In-app directions: draw the driving route from the user to a doctor (OSRM).
  const handleDirections = async (doc: any) => {
    if (!location) {
      toast({ title: "Enable your location first", description: "Tap “Use My Location” to get directions.", variant: "destructive" });
      return;
    }
    if (typeof doc.lat !== "number" || typeof doc.lng !== "number") {
      toast({ title: "Location unavailable for this clinic", variant: "destructive" });
      return;
    }
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${doc.lng},${doc.lat}?overview=full&geometries=geojson`;
      const res = await axios.get(url);
      const r = res.data?.routes?.[0];
      if (!r) throw new Error("No route found");
      const coords: [number, number][] = r.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
      setRoute(coords);
      setRouteInfo({ name: doc.name, km: Math.round((r.distance / 1000) * 10) / 10, mins: Math.round(r.duration / 60) });
      toast({ title: `Route to ${doc.name}`, description: "Directions drawn on the map below." });
      document.getElementById("gyno-map")?.scrollIntoView({ behavior: "smooth" });
    } catch (e: any) {
      toast({ title: "Could not fetch directions", description: e.message || "Try again.", variant: "destructive" });
    }
  };

  const mapCenter: [number, number] = location ? [location.lat, location.lng] : INDIA_CENTER;
  const mapZoom = location ? 12 : 5;

  return (
    <div className="space-y-6">
      <Card className="bg-[#fff7f2] border-[#fde0e0]">
        <CardHeader>
          <CardTitle className="text-[#5c3b28] flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Find Gynecologists Nearby</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={handleUseLocation}
              disabled={isLoading}
              className="bg-[#e03131] hover:bg-[#e03131]/90 text-white rounded-full flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{isLoading ? "Finding..." : "📍 Use My Location"}</span>
            </Button>
            {location && (
              <div className="text-sm text-[#5c3b28]/70">
                📍 You: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor: any) => (
          <DoctorCard
            key={doctor._id || doctor.id}
            doctor={{
              id: doctor._id || doctor.id,
              name: doctor.name,
              rating: doctor.rating,
              clinic: doctor.clinic,
              address: doctor.address || doctor.city,
              timings: doctor.timing,
              specialization: doctor.speciality,
              image: "👩‍⚕️",
              phone: doctor.phone || "",
              distanceKm: doctor.distanceKm,
            }}
            onDirections={() => handleDirections(doctor)}
          />
        ))}
      </div>

      {/* Map Section (always visible) */}
      <Card className="bg-[#fff7f2] border-[#fde0e0]" id="gyno-map">
        <CardContent className="p-0">
          {routeInfo && (
            <div className="px-4 py-2 text-sm text-[#5c3b28] bg-[#eef6ff] rounded-t-lg">
              🧭 Route to <strong>{routeInfo.name}</strong> — {routeInfo.km} km, ~{routeInfo.mins} min drive
            </div>
          )}
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={false}
            style={{ height: "440px", width: "100%", borderRadius: "0.5rem" }}
          >
            <MapController center={mapCenter} zoom={mapZoom} bounds={route.length ? route : undefined} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {location && (
              <Marker position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {doctors
              .filter((d: any) => typeof d.lat === "number" && typeof d.lng === "number")
              .map((doc: any) => (
                <Marker key={doc._id || doc.id} position={[doc.lat, doc.lng]} icon={customIcon}>
                  <Popup>
                    <strong>{doc.name}</strong>
                    <br />
                    {doc.clinic}, {doc.city}
                    <br />
                    {doc.speciality}
                    {typeof doc.distanceKm === "number" && (
                      <>
                        <br />
                        {doc.distanceKm} km away
                      </>
                    )}
                    <br />
                    <button
                      onClick={() => handleDirections(doc)}
                      style={{ marginTop: 6, color: "#1971c2", textDecoration: "underline", cursor: "pointer" }}
                    >
                      Get directions
                    </button>
                  </Popup>
                </Marker>
              ))}

            {route.length > 0 && <Polyline positions={route} pathOptions={{ color: "#1971c2", weight: 5, opacity: 0.8 }} />}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyDoctors;
