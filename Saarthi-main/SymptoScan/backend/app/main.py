# backend/main.py
import uvicorn
import random
from fastapi import FastAPI
from app import symptoscan  # Import the router from symptoscan.py
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
    "https://symptoscan-2mg1.onrender.com"],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SELF_CARE_TIPS = [
    "💧 Stay well-hydrated throughout the day.",
    "🧘‍♀️ Practice yoga or gentle stretching for pelvic pain.",
    "📝 Track your menstrual cycle to identify patterns.",
    "🥗 Eat a balanced diet rich in fiber and omega-3s.",
    "😴 Get 7-9 hours of quality sleep each night.",
    "🌿 Herbal teas like chamomile or ginger may relieve cramps.",
    "🚶‍♀️ Light exercise can boost your mood and reduce bloating.",
    "📵 Take screen breaks to reduce stress and eye strain.",
    "📚 Learn about your condition to make informed decisions.",
]


# Include the router
app.include_router(symptoscan.router)

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

@app.get("/get-tips")
def get_self_care_tips() -> dict:
    # Return 4 random tips
    tips = random.sample(SELF_CARE_TIPS, 4)
    return {"tips": tips}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
