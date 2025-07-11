from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import math

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
   allow_origins=["*"],  # For development use only. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

doctors_data = [
    {
        "id": 1,
        "name": "Dr. Radhika Sen",
        "clinic": "Lotus Women's Clinic",
        "city": "Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "rating": 4.7,
        "speciality": "PCOS Expert",
        "timing": "Mon–Sat, 10AM–6PM"
    },
    {
        "id": 2,
        "name": "Dr. Nidhi Kapoor",
        "clinic": "Bliss Women's Hospital",
        "city": "Mumbai",
        "lat": 19.0760,
        "lng": 72.8777,
        "rating": 4.8,
        "speciality": "Pregnancy Support",
        "timing": "Mon–Fri, 9AM–5PM"
    },
    {
        "id": 3,
        "name": "Dr. Anjali Sharma",
        "clinic": "Care Women’s Center",
        "city": "Bangalore",
        "lat": 12.9716,
        "lng": 77.5946,
        "rating": 4.6,
        "speciality": "Infection Specialist",
        "timing": "Tue–Sun, 11AM–7PM"
    },
]

# Haversine formula to calculate distance between 2 lat/lng
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in KM
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c  # Distance in KM

@app.get("/gynecologists")
def get_nearby_gynecologists(lat: float = Query(...), lng: float = Query(...), radius_km: float = 100):
    nearby_doctors = []

    for doc in doctors_data:
        distance = haversine(lat, lng, doc["lat"], doc["lng"])
        if distance <= radius_km:
            doc_with_distance = doc.copy()
            doc_with_distance["distance_km"] = round(distance, 2)
            nearby_doctors.append(doc_with_distance)

    return sorted(nearby_doctors, key=lambda d: d["distance_km"])
