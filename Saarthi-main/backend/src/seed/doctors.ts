// Seed the Doctor collection with gynecologists across major Indian cities.
// Run: npx tsx backend/src/seed/doctors.ts   (reads MONGODB_URI from .env)
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db';
import Doctor from '../models/Doctor';

type Seed = {
  name: string; clinic: string; city: string; state: string; address: string;
  phone: string; rating: number; experienceYears: number; timing: string;
  lat: number; lng: number;
};

const doctors: Seed[] = [
  // Mumbai
  { name: 'Dr. Anjali Deshpande', clinic: 'Lotus Women’s Clinic', city: 'Mumbai', state: 'Maharashtra', address: 'Bandra West, Mumbai', phone: '+91-9820011223', rating: 4.8, experienceYears: 18, timing: '10 AM - 2 PM', lat: 19.0596, lng: 72.8295 },
  { name: 'Dr. Farida Contractor', clinic: 'Marine Gynae Care', city: 'Mumbai', state: 'Maharashtra', address: 'Marine Lines, Mumbai', phone: '+91-9820044556', rating: 4.7, experienceYears: 22, timing: '5 PM - 8 PM', lat: 18.9430, lng: 72.8236 },
  { name: 'Dr. Sneha Rao', clinic: 'Andheri Women’s Health', city: 'Mumbai', state: 'Maharashtra', address: 'Andheri East, Mumbai', phone: '+91-9820077889', rating: 4.6, experienceYears: 12, timing: '11 AM - 3 PM', lat: 19.1136, lng: 72.8697 },
  // Pune
  { name: 'Dr. Meera Kulkarni', clinic: 'Sahyadri Gynae Center', city: 'Pune', state: 'Maharashtra', address: 'Kothrud, Pune', phone: '+91-9822011223', rating: 4.9, experienceYears: 20, timing: '9 AM - 1 PM', lat: 18.5074, lng: 73.8077 },
  { name: 'Dr. Prisha Joshi', clinic: 'Aundh Women’s Clinic', city: 'Pune', state: 'Maharashtra', address: 'Aundh, Pune', phone: '+91-9822044556', rating: 4.7, experienceYears: 14, timing: '4 PM - 8 PM', lat: 18.5590, lng: 73.8072 },
  { name: 'Dr. Ritu Agarwal', clinic: 'Hadapsar Mother & Child', city: 'Pune', state: 'Maharashtra', address: 'Hadapsar, Pune', phone: '+91-9822077889', rating: 4.5, experienceYears: 10, timing: '10 AM - 4 PM', lat: 18.5089, lng: 73.9260 },
  // Delhi
  { name: 'Dr. Kavita Sharma', clinic: 'Saket Women’s Hospital', city: 'New Delhi', state: 'Delhi', address: 'Saket, New Delhi', phone: '+91-9810011223', rating: 4.8, experienceYears: 25, timing: '10 AM - 2 PM', lat: 28.5245, lng: 77.2066 },
  { name: 'Dr. Shalini Verma', clinic: 'Dwarka Gynae Care', city: 'New Delhi', state: 'Delhi', address: 'Dwarka, New Delhi', phone: '+91-9810044556', rating: 4.6, experienceYears: 16, timing: '5 PM - 9 PM', lat: 28.5921, lng: 77.0460 },
  { name: 'Dr. Nidhi Kapoor', clinic: 'Rohini Mother Care', city: 'New Delhi', state: 'Delhi', address: 'Rohini, New Delhi', phone: '+91-9810077889', rating: 4.7, experienceYears: 19, timing: '11 AM - 3 PM', lat: 28.7361, lng: 77.1199 },
  // Bengaluru
  { name: 'Dr. Lakshmi Iyer', clinic: 'Indiranagar Women’s Clinic', city: 'Bengaluru', state: 'Karnataka', address: 'Indiranagar, Bengaluru', phone: '+91-9880011223', rating: 4.9, experienceYears: 21, timing: '9 AM - 1 PM', lat: 12.9719, lng: 77.6412 },
  { name: 'Dr. Divya Menon', clinic: 'Koramangala Gynae Care', city: 'Bengaluru', state: 'Karnataka', address: 'Koramangala, Bengaluru', phone: '+91-9880044556', rating: 4.7, experienceYears: 13, timing: '4 PM - 8 PM', lat: 12.9352, lng: 77.6245 },
  { name: 'Dr. Ananya Shetty', clinic: 'Whitefield Mother & Child', city: 'Bengaluru', state: 'Karnataka', address: 'Whitefield, Bengaluru', phone: '+91-9880077889', rating: 4.6, experienceYears: 11, timing: '10 AM - 4 PM', lat: 12.9698, lng: 77.7500 },
  // Hyderabad
  { name: 'Dr. Sushma Reddy', clinic: 'Banjara Hills Women’s Hospital', city: 'Hyderabad', state: 'Telangana', address: 'Banjara Hills, Hyderabad', phone: '+91-9848011223', rating: 4.8, experienceYears: 23, timing: '10 AM - 2 PM', lat: 17.4126, lng: 78.4390 },
  { name: 'Dr. Padma Nair', clinic: 'Gachibowli Gynae Center', city: 'Hyderabad', state: 'Telangana', address: 'Gachibowli, Hyderabad', phone: '+91-9848044556', rating: 4.6, experienceYears: 15, timing: '5 PM - 8 PM', lat: 17.4401, lng: 78.3489 },
  // Chennai
  { name: 'Dr. Revathi Krishnan', clinic: 'T. Nagar Women’s Clinic', city: 'Chennai', state: 'Tamil Nadu', address: 'T. Nagar, Chennai', phone: '+91-9840011223', rating: 4.7, experienceYears: 20, timing: '9 AM - 1 PM', lat: 13.0418, lng: 80.2341 },
  { name: 'Dr. Deepa Subramaniam', clinic: 'Adyar Mother Care', city: 'Chennai', state: 'Tamil Nadu', address: 'Adyar, Chennai', phone: '+91-9840044556', rating: 4.6, experienceYears: 14, timing: '4 PM - 8 PM', lat: 13.0012, lng: 80.2565 },
  // Kolkata
  { name: 'Dr. Ipsita Banerjee', clinic: 'Salt Lake Gynae Care', city: 'Kolkata', state: 'West Bengal', address: 'Salt Lake, Kolkata', phone: '+91-9830011223', rating: 4.8, experienceYears: 18, timing: '10 AM - 2 PM', lat: 22.5867, lng: 88.4172 },
  { name: 'Dr. Moumita Das', clinic: 'Ballygunge Women’s Clinic', city: 'Kolkata', state: 'West Bengal', address: 'Ballygunge, Kolkata', phone: '+91-9830044556', rating: 4.5, experienceYears: 12, timing: '5 PM - 8 PM', lat: 22.5246, lng: 88.3650 },
  // Ahmedabad
  { name: 'Dr. Hetal Patel', clinic: 'Satellite Women’s Hospital', city: 'Ahmedabad', state: 'Gujarat', address: 'Satellite, Ahmedabad', phone: '+91-9825011223', rating: 4.7, experienceYears: 17, timing: '9 AM - 1 PM', lat: 23.0300, lng: 72.5100 },
  { name: 'Dr. Bhavna Shah', clinic: 'Maninagar Gynae Center', city: 'Ahmedabad', state: 'Gujarat', address: 'Maninagar, Ahmedabad', phone: '+91-9825044556', rating: 4.6, experienceYears: 13, timing: '4 PM - 8 PM', lat: 22.9967, lng: 72.6017 },
  // Jaipur
  { name: 'Dr. Suman Rathore', clinic: 'C-Scheme Women’s Clinic', city: 'Jaipur', state: 'Rajasthan', address: 'C-Scheme, Jaipur', phone: '+91-9829011223', rating: 4.7, experienceYears: 19, timing: '10 AM - 2 PM', lat: 26.9124, lng: 75.7873 },
  { name: 'Dr. Pooja Meena', clinic: 'Malviya Nagar Mother Care', city: 'Jaipur', state: 'Rajasthan', address: 'Malviya Nagar, Jaipur', phone: '+91-9829044556', rating: 4.5, experienceYears: 11, timing: '5 PM - 8 PM', lat: 26.8535, lng: 75.8110 },
  // Gwalior
  { name: 'Dr. Neha Jain', clinic: 'Aarogya Gynae Clinic', city: 'Gwalior', state: 'Madhya Pradesh', address: 'City Center, Gwalior', phone: '+91-9827011223', rating: 4.8, experienceYears: 16, timing: '10 AM - 1 PM', lat: 26.2183, lng: 78.1828 },
  { name: 'Dr. Ragini Sharma', clinic: 'Lashkar Women’s Clinic', city: 'Gwalior', state: 'Madhya Pradesh', address: 'Lashkar, Gwalior', phone: '+91-9827044556', rating: 4.5, experienceYears: 10, timing: '4 PM - 7 PM', lat: 26.2124, lng: 78.1772 },
  // Lucknow
  { name: 'Dr. Alka Srivastava', clinic: 'Gomti Nagar Women’s Hospital', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Gomti Nagar, Lucknow', phone: '+91-9838011223', rating: 4.7, experienceYears: 20, timing: '10 AM - 2 PM', lat: 26.8500, lng: 81.0000 },
  { name: 'Dr. Meenakshi Singh', clinic: 'Hazratganj Gynae Care', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Hazratganj, Lucknow', phone: '+91-9838044556', rating: 4.5, experienceYears: 12, timing: '5 PM - 8 PM', lat: 26.8467, lng: 80.9462 },
  // Chandigarh
  { name: 'Dr. Harleen Kaur', clinic: 'Sector 17 Women’s Clinic', city: 'Chandigarh', state: 'Chandigarh', address: 'Sector 17, Chandigarh', phone: '+91-9815011223', rating: 4.8, experienceYears: 18, timing: '9 AM - 1 PM', lat: 30.7410, lng: 76.7822 },
  // Indore
  { name: 'Dr. Swati Malviya', clinic: 'Vijay Nagar Mother Care', city: 'Indore', state: 'Madhya Pradesh', address: 'Vijay Nagar, Indore', phone: '+91-9826011223', rating: 4.6, experienceYears: 14, timing: '10 AM - 3 PM', lat: 22.7533, lng: 75.8937 },
  // Nagpur
  { name: 'Dr. Vaishali Deshmukh', clinic: 'Dharampeth Gynae Center', city: 'Nagpur', state: 'Maharashtra', address: 'Dharampeth, Nagpur', phone: '+91-9823011223', rating: 4.6, experienceYears: 15, timing: '4 PM - 8 PM', lat: 21.1370, lng: 79.0670 },
  // Kochi
  { name: 'Dr. Ann Mary Thomas', clinic: 'Kaloor Women’s Clinic', city: 'Kochi', state: 'Kerala', address: 'Kaloor, Kochi', phone: '+91-9847011223', rating: 4.7, experienceYears: 17, timing: '9 AM - 1 PM', lat: 9.9975, lng: 76.2960 },
];

async function run() {
  await connectDB();
  await Doctor.deleteMany({});
  await Doctor.insertMany(
    doctors.map((d) => ({
      name: d.name,
      clinic: d.clinic,
      city: d.city,
      state: d.state,
      address: d.address,
      phone: d.phone,
      rating: d.rating,
      experienceYears: d.experienceYears,
      timing: d.timing,
      speciality: 'Obstetrician & Gynecologist',
      location: { type: 'Point', coordinates: [d.lng, d.lat] },
    }))
  );
  const count = await Doctor.countDocuments();
  console.log(`Seeded ${count} doctors.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
