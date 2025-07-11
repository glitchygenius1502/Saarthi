from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class SymptomRequest(BaseModel):
    symptoms: List[str]

# Map of conditions and their key symptoms
condition_symptoms = {
    "PCOD/PCOS": {"irregular periods", "acne", "weight gain", "facial hair", "hair thinning"},
    "Endometriosis": {"pelvic pain", "painful periods", "pain during sex", "infertility", "fatigue"},
    "Fibroids": {"heavy bleeding", "pelvic pressure", "frequent urination", "constipation"},
    "PMS/PMDD": {"mood swings", "bloating", "breast tenderness", "fatigue", "irritability"},
    "Menopause-related Disorders": {"hot flashes", "night sweats", "vaginal dryness", "osteoporosis"},
    "Infertility": {"irregular periods", "no periods", "hormonal imbalance", "pelvic pain"},
    "Amenorrhea": {"no periods", "low body weight", "excessive exercise", "stress"},
    "Dysmenorrhea": {"cramps", "painful periods", "nausea", "back pain"},
    "Ovarian Cysts": {"pelvic pain", "bloating", "irregular periods", "pain during sex"},
    "Pelvic Inflammatory Disease (PID)": {"lower abdominal pain", "fever", "unusual discharge", "pain during sex"}
}

@router.post("/predict")
def predict_condition(data: SymptomRequest):
    user_symptoms = set(sym.lower() for sym in data.symptoms)
    
    best_match = None
    max_matches = 0

    for condition, symptoms_set in condition_symptoms.items():
        match_count = len(user_symptoms & set(sym.lower() for sym in symptoms_set))
        if match_count > max_matches:
            max_matches = match_count
            best_match = condition

    if best_match:
        confidence = max_matches / len(condition_symptoms[best_match])
        return {
            "predicted_condition": best_match,
            "confidence": round(confidence, 2)
        }
    else:
        return {
            "predicted_condition": "Condition not confidently detected",
            "confidence": 0.0
        }
