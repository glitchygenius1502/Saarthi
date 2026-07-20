import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, Navigation } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const doctorIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Glorified red "you are here" pin.
const userIcon = new L.DivIcon({
  className: "saarthi-user-pin",
  html: `<div style="font-size:34px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">📍</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -30],
});

// Green destination pin for the doctor you're navigating to.
const destIcon = new L.DivIcon({
  className: "saarthi-dest-pin",
  html: `<div style="font-size:34px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">🏥</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -30],
});

const API_BASE_URL = "/api/gyno";
const INDIA_CENTER: [number, number] = [22.9734, 78.6569];

// Fixes the classic blank/grey Leaflet map and animates to the route/location.
const MapController = ({ center, zoom, bounds }: { center: [number, number]; zoom: number; bounds?: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
    if (bounds && bounds.length >= 2) {
      // Animated "fly" to the route, Google-Maps style.
      map.flyToBounds(bounds as any, { padding: [60, 60], duration: 1.2 });
    } else {
      map.flyTo(center, zoom, { duration: 1.0 });
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
  const [destination, setDestination] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const { toast } = useToast();

  const fetchDoctors = async (coords: { lat: number; lng: number }) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/doctors`, {
        params: { lat: coords.lat, lng: coords.lng, radius: 12 },
      });
      const list = res.data?.doctors ?? [];
      setDoctors(list);
      setVisibleCount(6);
      if (list.length === 0) {
        toast({ title: "No gynecologists found nearby", description: "Try again from a different location." });
      }
    } catch (error: any) {
      toast({
        title: "Could not load doctors",
        description: error?.response?.data?.error || error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setHasSearched(true);
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(coords);
        fetchDoctors(coords);
      },
      () => {
        setIsLoading(false);
        toast({
          title: "Location access needed",
          description: "Allow location access to find gynecologists near you.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // In-app driving directions (OSRM) drawn on the Leaflet map — no redirect.
  const handleDirections = async (doc: any) => {
    if (!location) {
      toast({ title: "Enable your location first", variant: "destructive" });
      return;
    }
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${doc.lng},${doc.lat}?overview=full&geometries=geojson`;
      const res = await axios.get(url);
      const r = res.data?.routes?.[0];
      if (!r) throw new Error("No route found");
      const coords: [number, number][] = r.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
      setRoute(coords);
      setDestination({ lat: doc.lat, lng: doc.lng, name: doc.name });
      setRouteInfo({ name: doc.name, km: Math.round((r.distance / 1000) * 10) / 10, mins: Math.round(r.duration / 60) });
      toast({ title: `Route to ${doc.name}`, description: "Navigating on the map…" });
      document.getElementById("gyno-map")?.scrollIntoView({ behavior: "smooth" });
    } catch (e: any) {
      toast({ title: "Could not fetch directions", description: e.message, variant: "destructive" });
    }
  };

  const mapCenter: [number, number] = location ? [location.lat, location.lng] : INDIA_CENTER;
  const mapZoom = location ? 13 : 5;

  return (
    <div className="space-y-6">
      {/* Hero / locate */}
      <Card className="bg-gradient-to-r from-[#fff1f1] to-[#fff7f2] border-[#fde0e0] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-[#5c3b28] flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-[#e03131]" />
            <span>Gynecologists near you</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-sm text-[#5c3b28]/70 max-w-md">
              Allow location access and we’ll find verified gynecologists closest to you, with live distances and
              in-app directions.
            </p>
            <Button
              onClick={locate}
              disabled={isLoading}
              className="bg-[#e03131] hover:bg-[#e03131]/90 text-white rounded-full flex items-center space-x-2 shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              <span>{isLoading ? "Finding…" : hasSearched ? "Search again" : "📍 Start finding"}</span>
            </Button>
          </div>
          {hasSearched && location && !isLoading && (
            <div className="mt-3 text-sm text-[#5c3b28]/70 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#2f9e44]" />
              {doctors.length} gynecologists found near you
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor cards — only after the user starts a search */}
      {!hasSearched ? (
        <div className="rounded-2xl border border-dashed border-[#fde0e0] bg-[#fff7f2] py-14 text-center text-[#5c3b28]/70">
          <div className="text-4xl mb-2">🔍</div>
          <p className="font-medium text-[#5c3b28]">Tap “Start finding” to see gynecologists near you</p>
          <p className="text-sm">We’ll ask for your location, then list the closest doctors first.</p>
        </div>
      ) : isLoading && doctors.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-[#5c3b28]/70">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Finding gynecologists near you…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.slice(0, visibleCount).map((doctor: any) => (
              <DoctorCard
                key={doctor.id}
                doctor={{
                  id: doctor.id,
                  name: doctor.name,
                  rating: doctor.rating,
                  ratingCount: doctor.ratingCount,
                  clinic: doctor.clinic,
                  address: doctor.address || doctor.city,
                  timings: doctor.timing,
                  specialization: doctor.speciality,
                  image: "👩‍⚕️",
                  phone: doctor.phone || "",
                  website: doctor.website,
                  distanceKm: doctor.distanceKm,
                }}
                onDirections={() => handleDirections(doctor)}
              />
            ))}
          </div>
          {visibleCount < doctors.length && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => setVisibleCount((c) => c + 6)}
                variant="outline"
                className="border-[#e03131] text-[#e03131] hover:bg-[#e03131] hover:text-white rounded-full px-8"
              >
                Show more ({doctors.length - visibleCount} more)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Map (always visible) */}
      <Card className="bg-[#fff7f2] border-[#fde0e0]" id="gyno-map">
        <CardContent className="p-0">
          {routeInfo && (
            <div className="px-4 py-2 text-sm text-[#5c3b28] bg-[#eef6ff] rounded-t-lg flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#1971c2]" />
              Route to <strong>{routeInfo.name}</strong> — {routeInfo.km} km · ~{routeInfo.mins} min drive
            </div>
          )}
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: "460px", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
          >
            <MapController center={mapCenter} zoom={mapZoom} bounds={route.length ? route : undefined} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {location && (
              <Marker position={[location.lat, location.lng]} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {destination && (
              <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
                <Popup>{destination.name}</Popup>
              </Marker>
            )}

            {doctors
              .filter((d: any) => typeof d.lat === "number" && typeof d.lng === "number")
              .filter((d: any) => !(destination && d.lat === destination.lat && d.lng === destination.lng))
              .map((doc: any) => (
                <Marker key={doc.id} position={[doc.lat, doc.lng]} icon={doctorIcon}>
                  <Popup>
                    <strong>{doc.name}</strong>
                    <br />
                    {doc.speciality}
                    {typeof doc.distanceKm === "number" && (
                      <>
                        <br />📍 {doc.distanceKm} km away
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

            {route.length > 0 && <Polyline positions={route} pathOptions={{ color: "#1971c2", weight: 5, opacity: 0.85 }} />}
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default NearbyDoctors;
