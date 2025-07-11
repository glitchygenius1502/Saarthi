import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { getTips } from "../api/symptoScan";

import { getDiagnosis } from "../api/symptoScan";
import { HeartPulse, Stethoscope, BookOpen, ScanFace, Phone, Radar } from "lucide-react";





const symptomOptions = [
{ value: "fatigue", label: "💧 Fatigue" },
{ value: "irregular periods", label: "🔄 Irregular Periods" },
{ value: "pelvic pain", label: "⚡ Pelvic Pain" },
{ value: "mood swings", label: "🌪️ Mood Swings" },
{ value: "acne", label: "🌸 Acne" },
{ value: "bloating", label: "💨 Bloating" },
{ value: "hot flashes", label: "🌡️ Hot Flashes" },
];

export const SymptoScanForm = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
const [showTips, setShowTips] = useState(false);
const [tips, setTips] = useState<string[]>([]);

const [loadingTips, setLoadingTips] = useState(false);

const handleSelfCareClick = async () => {
  setShowTips(true); // Show modal immediately
  if (tips.length === 0) {
    try {
      setLoadingTips(true);
      const res = await getTips();
      setTips(res.tips || []);
    } catch (error) {
      console.error("Failed to fetch tips:", error);
    } finally {
      setLoadingTips(false);
    }
  }
};

  const handleCheck = async () => {
    const symptomList = selectedSymptoms.map((s) => s.value);
    setLoading(true);
    setResult(null);
    try {
      const res = await getDiagnosis(symptomList);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };


return (
<div
  className="min-h-screen bg-white p-8 flex flex-col items-center justify-center relative overflow-hidden"
  style={{
    backgroundImage:
      "url('https://i.pinimg.com/736x/ed/56/9f/ed569f400860eb1928f4f7c1be745a9d.jpg')",
    backgroundSize: "cover", // ⬅️ this ensures it fills the screen
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",
  }}
>

<div className="backdrop-blur-sm bg-white/70 p-8 rounded-xl shadow-xl w-full max-w-xl z-10">
{/* Centered Heading */}
<div className="flex items-center gap-2 text-brown mb-6 justify-center">
<ScanFace className="w-6 h-6" />
<h1 className="text-3xl font-bold">SymptoScan</h1>
</div>

    {/* Dialog Content */}
    <div className="flex flex-col justify-center space-y-6">
      <h2 className="text-xl font-semibold text-brown text-center">
        How are you feeling today?
      </h2>

     <CreatableSelect
  isMulti
  options={symptomOptions}
  placeholder="Select or type your symptoms..."
  onChange={(val) => setSelectedSymptoms(val as any[])}
  className="text-black"
/>


      <button
        onClick={handleCheck}
        disabled={loading}
        className="bg-brown text-white px-6 py-2 rounded hover:bg-[#5c2f00] transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <span className="dot-loader"></span>
            <span className="dot-loader delay-200"></span>
            <span className="dot-loader delay-400"></span>
          </div>
        ) : (
          "Analyze Symptoms"
        )}
      </button>

      {result && (
        <div className="bg-white p-5 rounded shadow space-y-3">
          <p className="text-lg font-semibold text-brown flex items-center gap-2">
  <Radar className="w-5 h-5" />
  Predicted Condition: {result.predicted_condition}
</p>
          <p className="text-sm text-gray-700">
            📊 Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            This condition may require medical attention. Consider speaking with a gynecologist or women's health expert.
          </p>
          <div className="italic text-beige bg-brown px-4 py-2 rounded text-center">
            “Awareness is the first step to wellness.”
          </div>

          <div className="flex gap-4 pt-2 justify-center">
            <a
  href="https://gyno-connect-oasis.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded hover:bg-[#4d2200] transition-all"
>
  <Phone className="w-4 h-4" />
  Talk to a Doctor
</a>

            
<button
  onClick={handleSelfCareClick}
  className="flex items-center gap-2 border border-brown text-brown px-4 py-2 rounded hover:bg-brown hover:text-white transition-all"
>
  <BookOpen className="w-4 h-4" />
  See Self-Care Tips
</button>

{showTips && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
      <button
        onClick={() => setShowTips(false)}
        className="absolute top-2 right-3 text-gray-600 hover:text-black text-sm"
      >
        ❌
      </button>
      <h3 className="text-xl font-bold text-brown mb-4 text-center">🌿 Self-Care Tips</h3>
      {loadingTips ? (
        <p className="text-center text-gray-500">Loading tips...</p>
      ) : (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}

          </div>
        </div>
      )}
    </div>
  </div>
</div>
);
  };