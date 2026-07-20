# 🌿 Saarthi – Guiding Her to Wellness

Official repository for **Saarthi**, a digital health companion built to empower
women in underserved regions of India. Developed for **HackOrbit 2025** by
**Team Naruto**.

## 🚀 Live Deployment

🔗 **https://saarthi-empower-hub-revamp-main.vercel.app**

Everything runs from this single link — the hub and every module are served
under one deployment (for example `/shecare`, `/gynoconnect`, `/vaxalert`, …),
with one shared login.

---

## 🎯 Problem Statement

Millions of Indian women, especially in rural and semi-urban areas, lack access to:

- Reliable medical assistance and support systems
- Timely vaccine reminders and health drive information
- Menstrual and maternity aid, verified NGOs, and doctors
- Awareness of legal help and government healthcare schemes

## 💡 Our Solution: Saarthi

A unified platform that bridges the gap in women's healthcare with personalized,
accessible, and community-driven features — one account, one link, many modules.

---

## 🔍 Modules

- **SheCycle+** — Period & mood tracker with cycle prediction, progress, fertile
  window and reminders. Fully functional and database-backed.
- **GynoConnect** — Find real gynecologists near you on a live map, with
  distances, in-app directions, calling, and appointment booking.
- **NGOHeal** — Connect with verified NGOs for women's health aid.
- **VaxAlert** — Vaccine schedules, reminders and health-drive updates.
- **SymptoScan** — AI symptom checker for women's health.
- **CareCircle** — Peer and emotional support groups.
- **HealthYojana** — Personalized government health-scheme finder.
- **MediVault** — Secure store for prescriptions and medical records.

---

## 🛠️ Tech Stack

| Area        | Technologies                                             |
| ----------- | -------------------------------------------------------- |
| Frontend    | Vite, React, TypeScript, Tailwind CSS, shadcn-ui         |
| Backend     | Node.js, Express, TypeScript (serverless on Vercel)      |
| Database    | MongoDB Atlas (Mongoose)                                 |
| Auth        | JWT (shared across all modules)                          |
| Maps & Data | Leaflet + OpenStreetMap, OSRM routing, Geoapify Places   |
| Deployment  | Vercel (single unified project)                          |

---

## 👥 Team Naruto – HackOrbit 2025

| Name            | College   | Contact                     |
| --------------- | --------- | --------------------------- |
| Nandani Goyal   | IIIT Kota | 2023kucp1086@iiitkota.ac.in |
| Lekhni Bakliwal | IIIT Kota | bakliwallekhni1@gmail.com   |
| Suhani Gupta    | IIIT Kota | suhanigupta2304@gmail.com   |

---

## 🏁 Run Locally

```bash
git clone https://github.com/glitchygenius1502/Saarthi.git
cd Saarthi/Saarthi-main
# build all modules into one static output
node build-all.mjs
# run the API locally (needs a .env with MONGODB_URI, JWT_SECRET, GEOAPIFY_API_KEY)
npm install && npm run api
```
