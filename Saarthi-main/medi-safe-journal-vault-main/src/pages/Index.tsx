
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Upload, Calendar, Bell, Share, Download, FileText, Plus, Minus, Link, Heart, Activity, Shield, Calculator, Stethoscope, Pill, Scan, Camera, Eye, Database } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  medivaultApi, classifyBmi, classifyBp, classifySugar, fileToDataUrl,
  getToken, getUser, goToLogin, ReportMeta, Metric,
} from "@/lib/api";

const bmiAdvice: Record<string, string> = {
  Underweight: "Consider increasing caloric intake",
  Normal: "Excellent — keep maintaining",
  Overweight: "Consider diet and exercise",
  Obese: "Consult a healthcare provider",
};

// Merge saved readings (different types/dates) into one time-ordered series.
function buildChartData(metrics: Metric[]) {
  const byDate: Record<string, any> = {};
  metrics.forEach((m) => {
    const t = new Date(m.date).getTime();
    const label = new Date(m.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    byDate[label] = byDate[label] || { label, _t: t };
    if (m.type === "weight" && m.weightKg != null) byDate[label].weight = m.weightKg;
    if (m.type === "bp" && m.systolic != null) byDate[label].bp = m.systolic;
    if (m.type === "sugar" && m.sugar != null) byDate[label].sugar = m.sugar;
  });
  return Object.values(byDate).sort((a: any, b: any) => a._t - b._t);
}

const Index = () => {
  const authed = !!getToken();
  const { toast } = useToast();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bp, setBp] = useState({ systolic: "", diastolic: "" });
  const [sugar, setSugar] = useState("");
  const [sugarContext, setSugarContext] = useState<"fasting" | "random" | "postmeal">("fasting");
  const [bpResult, setBpResult] = useState("");
  const [sugarResult, setSugarResult] = useState("");

  const [reports, setReports] = useState<ReportMeta[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savingRx, setSavingRx] = useState(false);
  const [showRxForm, setShowRxForm] = useState(false);
  const [rxForm, setRxForm] = useState({ doctorName: "", speciality: "", date: "", medications: "", notes: "" });
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [viewer, setViewer] = useState<{ name: string; data: string; mimeType?: string } | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const user = getUser();

  // Start/stop the live camera when the camera dialog opens/closes.
  useEffect(() => {
    if (!cameraOpen) return;
    let active = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setCameraOpen(false);
        toast({ title: "Camera unavailable", description: "Opening the file picker instead." });
        cameraInputRef.current?.click();
      }
    })();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.85);
    setCameraOpen(false);
    try {
      setUploading(true);
      await medivaultApi.uploadReport({
        name: `photo-${Date.now()}.jpg`, category: "scan", mimeType: "image/jpeg",
        size: Math.round(data.length * 0.75), data,
      });
      await refresh();
      toast({ title: "Photo captured & saved ✅" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e?.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const refresh = async () => {
    try {
      const [r, m, p] = await Promise.all([
        medivaultApi.listReports(),
        medivaultApi.listMetrics(),
        medivaultApi.listPrescriptions(),
      ]);
      setReports(r.reports);
      setMetrics(m.metrics);
      setPrescriptions(p.prescriptions);
    } catch {
      /* 401 redirects inside the api helper */
    }
  };

  useEffect(() => {
    if (!authed) {
      goToLogin();
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = buildChartData(metrics);

  const calculateBMI = async () => {
    if (!weight || !height) return;
    const hm = parseFloat(height) / 100;
    const b = Math.round((parseFloat(weight) / (hm * hm)) * 10) / 10;
    setBmi(b);
    const cat = classifyBmi(b);
    setBmiCategory(`${cat} — ${bmiAdvice[cat] || ""}`);
    try {
      await medivaultApi.saveMetric({ type: "weight", weightKg: parseFloat(weight), heightCm: parseFloat(height) });
      await refresh();
      toast({ title: "Reading saved ✅", description: "Your weight/BMI was added to your health trends." });
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message || "Try again.", variant: "destructive" });
    }
  };

  const checkBloodPressure = async () => {
    if (!bp.systolic || !bp.diastolic) return;
    const s = parseInt(bp.systolic);
    const d = parseInt(bp.diastolic);
    setBpResult(classifyBp(s, d));
    try {
      await medivaultApi.saveMetric({ type: "bp", systolic: s, diastolic: d });
      await refresh();
      toast({ title: "Reading saved ✅", description: "Your blood pressure was added to your trends." });
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message || "Try again.", variant: "destructive" });
    }
  };

  const checkBloodSugar = async () => {
    if (!sugar) return;
    const v = parseInt(sugar);
    setSugarResult(`${classifySugar(v, sugarContext)} · ${sugarContext}`);
    try {
      await medivaultApi.saveMetric({ type: "sugar", sugar: v, sugarContext });
      await refresh();
      toast({ title: "Reading saved ✅", description: "Your blood sugar was added to your trends." });
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message || "Try again.", variant: "destructive" });
    }
  };

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.6 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please choose a file under ~3.5 MB.", variant: "destructive" });
      if (e.target) e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      const data = await fileToDataUrl(file);
      const category = /^image\//.test(file.type) ? "scan" : "report";
      await medivaultApi.uploadReport({ name: file.name, category, mimeType: file.type, size: file.size, data });
      await refresh();
      toast({ title: "Uploaded ✅", description: file.name });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message || "Try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const viewReport = async (id: string) => {
    try {
      const { report } = await medivaultApi.getReport(id);
      setViewer({ name: report.name, data: report.data, mimeType: report.mimeType });
    } catch (e: any) {
      toast({ title: "Could not open file", description: e?.message, variant: "destructive" });
    }
  };

  const downloadReport = async (id: string) => {
    try {
      const { report } = await medivaultApi.getReport(id);
      const a = document.createElement("a");
      a.href = report.data;
      a.download = report.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      toast({ title: "Could not download", description: e?.message, variant: "destructive" });
    }
  };

  const onScanPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.6 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please choose a file under ~3.5 MB.", variant: "destructive" });
      if (e.target) e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      const data = await fileToDataUrl(file);
      await medivaultApi.uploadReport({ name: file.name, category: "scan", mimeType: file.type, size: file.size, data });
      await refresh();
      toast({ title: "Scan uploaded ✅", description: file.name });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.message || "Try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const removeReport = async (id: string) => {
    try {
      await medivaultApi.deleteReport(id);
      await refresh();
    } catch { /* ignore */ }
  };

  // Derived, DB-backed counts (nothing hardcoded).
  const scanReports = reports.filter((r) => r.category === "scan" || r.category === "xray");
  const connectedDoctors = new Set(prescriptions.map((p) => (p.doctorName || "").trim().toLowerCase())).size;
  const storageMB = Math.round((reports.reduce((a, r) => a + (r.size || 0), 0) / (1024 * 1024)) * 10) / 10;

  const submitPrescription = async () => {
    if (!rxForm.doctorName.trim()) {
      toast({ title: "Doctor name is required", variant: "destructive" });
      return;
    }
    try {
      setSavingRx(true);
      let reportId: string | undefined;
      let reportName: string | undefined;
      if (rxFile) {
        if (rxFile.size > 3.6 * 1024 * 1024) {
          toast({ title: "File too large", description: "Under ~3.5 MB please.", variant: "destructive" });
          setSavingRx(false);
          return;
        }
        const data = await fileToDataUrl(rxFile);
        const up = await medivaultApi.uploadReport({
          name: rxFile.name, category: "prescription", mimeType: rxFile.type, size: rxFile.size, data,
        });
        reportId = up.report._id;
        reportName = up.report.name;
      }
      await medivaultApi.addPrescription({
        doctorName: rxForm.doctorName,
        speciality: rxForm.speciality,
        date: rxForm.date,
        medications: rxForm.medications.split("\n").map((s) => s.trim()).filter(Boolean),
        notes: rxForm.notes,
        reportId,
        reportName,
      });
      await refresh();
      setRxForm({ doctorName: "", speciality: "", date: "", medications: "", notes: "" });
      setRxFile(null);
      setShowRxForm(false);
      toast({ title: "Prescription saved ✅" });
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message, variant: "destructive" });
    } finally {
      setSavingRx(false);
    }
  };

  const removePrescription = async (id: string) => {
    try {
      await medivaultApi.deletePrescription(id);
      await refresh();
    } catch { /* ignore */ }
  };

  const buildSummary = () => {
    const latest = (t: string) => metrics.filter((m) => m.type === t).slice(-1)[0];
    const w = latest("weight");
    const b = latest("bp");
    const s = latest("sugar");
    const L: string[] = [];
    L.push("SAARTHI — HEALTH SUMMARY");
    L.push(`Name: ${user?.name || "User"}`);
    L.push(`Generated: ${new Date().toLocaleString("en-IN")}`);
    L.push("");
    L.push("VITALS (latest readings)");
    if (w) L.push(`- Weight: ${w.weightKg} kg${w.bmi ? ` | BMI ${w.bmi} (${w.category})` : ""}`);
    if (b) L.push(`- Blood Pressure: ${b.systolic}/${b.diastolic} mmHg (${b.category})`);
    if (s) L.push(`- Blood Sugar: ${s.sugar} mg/dL, ${s.sugarContext} (${s.category})`);
    if (!w && !b && !s) L.push("- No readings logged yet.");
    L.push("");
    L.push(`TRENDS: ${metrics.length} reading(s) logged over time.`);
    L.push("");
    L.push(`CONSULTATIONS (${prescriptions.length}) with ${connectedDoctors} doctor(s):`);
    prescriptions.slice(0, 12).forEach((p) =>
      L.push(`- ${p.doctorName}${p.speciality ? ` (${p.speciality})` : ""}${p.date ? ` - ${p.date}` : ""}${p.medications?.length ? ` | meds: ${p.medications.join(", ")}` : ""}`)
    );
    L.push("");
    L.push(`DOCUMENTS: ${reports.length} file(s) stored (${scanReports.length} scan/x-ray).`);
    reports.slice(0, 15).forEach((r) => L.push(`- [${r.category}] ${r.name}`));
    L.push("");
    const flags: string[] = [];
    if (b && /Hypertension|Crisis/.test(b.category || "")) flags.push("Elevated blood pressure - monitor and consult a doctor.");
    if (s && /Diabetes|Prediabetes/.test(s.category || "")) flags.push("Blood sugar above normal - dietary review advised.");
    if (w && /Overweight|Obese|Underweight/.test(w.category || "")) flags.push(`BMI is ${w.category} - consider lifestyle guidance.`);
    L.push("ASSESSMENT");
    L.push(flags.length ? flags.map((f) => "- " + f).join("\n") : "- All logged vitals are within normal ranges. Keep it up!");
    L.push("");
    L.push("Generated by Saarthi. Not a substitute for professional medical advice.");
    return L.join("\n");
  };

  const downloadSummary = () => {
    const blob = new Blob([buildSummary()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saarthi-health-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Health summary downloaded ✅" });
  };

  const shareWithDoctor = async () => {
    const text = buildSummary();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Saarthi Health Summary", text });
        return;
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard", description: "Summary copied — paste it to share with your doctor." });
    } catch {
      toast({ title: "Could not share", variant: "destructive" });
    }
  };

  const sharePrescription = async (p: any) => {
    const text = `Prescription — ${p.doctorName}${p.speciality ? ` (${p.speciality})` : ""}${p.date ? `\nDate: ${p.date}` : ""}\n${(p.medications || []).map((m: string) => `• ${m}`).join("\n")}${p.notes ? `\nNotes: ${p.notes}` : ""}\n\nvia Saarthi`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Prescription — ${p.doctorName}`, text });
        return;
      } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard", description: "Prescription copied — paste it to share." });
    } catch {
      toast({ title: "Could not share", variant: "destructive" });
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadReport = () => {
    scrollToSection('upload-section');
  };

  const handleBMICalculator = () => {
    scrollToSection('bmi-section');
  };

  const handlePrescriptions = () => {
    scrollToSection('prescriptions-section');
  };

  const handleHealthRecords = () => {
    scrollToSection('records-section');
  };

  const handleScans = () => {
    scrollToSection('scans-section');
  };

  const handleHealthMonitoring = () => {
    scrollToSection('monitoring-section');
  };

  const logout = () => {
    localStorage.removeItem("saarthi_token");
    localStorage.removeItem("saarthi_user");
    window.location.href = "/";
  };
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600">Taking you to sign in…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
      {/* Header Section */}
      <div className="border-b border-stone-300 bg-gradient-to-r from-stone-100 to-stone-200 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-800 to-amber-900 rounded-xl flex items-center justify-center shadow-lg"
               style={{ color: 'hsl(25, 50%, 20%)' }}
              >
              
                <Database className="w-7 h-7 text-white"
                 />
              </div>
              <div>
                <h1 className="text-3xl font-bold  font-serif"
                 style={{ color: 'hsl(25, 50%, 20%)' }}
                >MediVault</h1>
                <p className="text-sm text-stone-700 font-medium">Your comprehensive health management system</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full border border-green-300">
                <Shield className="w-5 h-5 text-green-700" />
                <span className="text-green-800 font-semibold text-sm">Secure & Encrypted</span>
              </div>
              {/* Logged-in user profile */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-800 to-amber-900 text-white flex items-center justify-center font-bold shadow"
                  title={user?.name}
                >
                  {(user?.name || "U").trim().charAt(0).toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 text-stone-700">
                    <div className="px-4 py-2 text-sm text-stone-500 border-b">{user?.name || "Signed in"}</div>
                    <button onClick={logout} className="w-full px-4 py-2 text-left text-red-600 hover:bg-stone-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cream-500/20 to-amber-800/20 z-10"></div>
        <div 
          className="bg-cover bg-center bg-no-repeat py-20" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        >
          <div className="container mx-auto px-6 relative z-20">
            <div className="text-center mb-12 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-stone-200">
              <h2
  className="text-5xl font-bold mb-6 font-serif leading-tight"
  style={{ color: 'hsl(25, 50%, 20%)' }}
>
  Complete Medical Records Management
</h2>

              <p className="text-xl text-stone-800 mb-8 max-w-4xl mx-auto leading-relaxed">
                Store, organize and manage all your health records, prescriptions, lab reports, and medical history securely.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 justify-center">
                <Button 
                  onClick={handleUploadReport}
                  className="bg-[#A67B5B] text-white border border-[#8f6647] hover:bg-[#96694a]  px-6 py-4 rounded-none font-semibold shadow-sm hover:scale-105 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Reports
                </Button>
                <Button 
                  onClick={handleBMICalculator}
                  className="bg-[#A67B5B] text-white border border-[#8f6647] hover:bg-[#96694a]  px-6 py-4 rounded-none font-semibold shadow-sm hover:scale-105 transition-all duration-200"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Health Calculator
                </Button>
                <Button 
                  onClick={handlePrescriptions}
                  className="bg-[#A67B5B] text-white border border-[#8f6647] hover:bg-[#96694a] px-6 py-4 rounded-none font-semibold shadow-sm hover:scale-105 transition-all duration-200"
                >
                  <Pill className="w-5 h-5 mr-2" />
                  Prescriptions
                </Button>
                <Button 
                  onClick={handleHealthRecords}
                  className="bg-[#A67B5B] text-white border border-[#8f6647] hover:bg-[#96694a] px-6 py-4 rounded-none font-semibold shadow-sm hover:scale-105 transition-all duration-200"
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Health Records
                </Button>
                <Button 
                  onClick={handleScans}
                  className="bg-[#A67B5B] text-white border border-[#8f6647] hover:bg-[#96694a] px-6 py-4 rounded-none font-semibold shadow-sm hover:scale-105 transition-all duration-200"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  X-rays & Scans
                </Button>
                <Button 
                  onClick={handleHealthMonitoring}
                  className="bg-[#A67B5B] text-white border border-[#8f6647] hover:bg-[#96694a] px-6 py-4 rounded-none font-semibold shadow-sm hover:scale-105 transition-all duration-200"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Health Monitoring
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12"
       style={{ color: 'hsl(25, 50%, 20%)' }}>
        {/* Upload Section */}
        <section id="upload-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className=" text-2xl font-bold flex items-center"
               style={{ color: 'hsl(25, 50%, 15%)' }}>
                <Upload className="w-7 h-7 mr-3 " 
                 style={{ color: 'hsl(25, 50%, 20%)' }}/>
                Upload Medical Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div 
                    className="border-3 border-dashed border-stone-400 rounded-2xl p-12 mb-8 bg-gradient-to-br from-stone-50 to-stone-100 hover:from-stone-100 hover:to-stone-150 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-stone-200 to-stone-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Upload className="w-12 h-12 text-stone-800" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4"
                       style={{ color: 'hsl(25, 50%, 20%)' }}>Drop your files here</h3>
                      <p className="text-amber-600 mb-6 font-medium text-lg">Support for PDF, JPG, PNG files up to 25MB</p>
                      <div className="flex gap-2 mb-4 justify-center">
                        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-[#A67B5B] hover:bg-[#96694a] text-white">
                          <FileText className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading…" : "Browse Files"}
                        </Button>
                        <Button onClick={() => setCameraOpen(true)} disabled={uploading} variant="outline" className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                      <input ref={fileInputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={onFilePicked} />
                      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFilePicked} />
                    </div>
                  </div>
                </div>
                <div className="h-96 overflow-y-auto rounded-2xl border-2 border-stone-300 shadow-lg bg-white p-4">
                  <h3 className="text-lg font-bold text-stone-800 mb-3">Your documents ({reports.length})</h3>
                  {reports.length === 0 ? (
                    <p className="text-stone-500 text-sm">No files yet. Upload a report, prescription, or scan and it will be stored securely here.</p>
                  ) : (
                    <div className="space-y-2">
                      {reports.map((r) => (
                        <div key={r._id} className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                          <div className="min-w-0">
                            <div className="font-medium text-stone-800 truncate">{r.name}</div>
                            <div className="text-xs text-stone-500 capitalize">{r.category} · {Math.round((r.size || 0) / 1024)} KB</div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button size="sm" variant="outline" onClick={() => viewReport(r._id)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => removeReport(r._id)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                              ✕
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Health Calculator Section */}
        <section id="bmi-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Calculator className="w-7 h-7 mr-3 text-stone-800" 
                 style={{ color: 'hsl(25, 50%, 25%)' }}/>
                Health Metrics Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BMI Calculator */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold "
                   style={{ color: 'hsl(25, 50%, 20%)' }}>BMI Calculator</h3>
                  <div className="grid grid-cols-2 gap-4 min-h-[132px] content-start">
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Weight (kg)</Label>
                      <Input 
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Enter weight"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Height (cm)</Label>
                      <Input 
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Enter height"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={calculateBMI}
                    className="w-full bg-[#A67B5B] hover:bg-[#96694a] text-white  py-4 text-lg font-semibold shadow-lg"
                  >
                    Calculate BMI
                  </Button>

                  {bmi && (
                    <div className="p-6 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300 shadow-lg">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-stone-900 mb-2">{bmi}</div>
                        <div className="text-lg text-stone-700 font-semibold">{bmiCategory}</div>
                      </div>
                      <Progress value={Math.min((bmi / 35) * 100, 100)} className="h-4" />
                    </div>
                  )}
                </div>

                {/* Blood Pressure Calculator */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold "
                   style={{ color: 'hsl(25, 50%, 20%)' }}>Blood Pressure</h3>
                  <div className="grid grid-cols-2 gap-4 min-h-[132px] content-start">
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Systolic</Label>
                      <Input 
                        value={bp.systolic}
                        onChange={(e) => setBp({...bp, systolic: e.target.value})}
                        placeholder="120"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                    <div>
                      <Label className="text-stone-800 font-semibold mb-2 block">Diastolic</Label>
                      <Input 
                        value={bp.diastolic}
                        onChange={(e) => setBp({...bp, diastolic: e.target.value})}
                        placeholder="80"
                        className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={checkBloodPressure}
                    className="w-full bg-[#A67B5B] hover:bg-[#96694a] text-white  text-white py-4 text-lg font-semibold shadow-lg"
                  >
                    Check BP
                  </Button>

                  {bpResult && (
                    <div className="p-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl border-2 border-amber-300 shadow-lg">
                      <div className="text-center">
                        <div className="text-lg text-stone-700 font-semibold">{bpResult}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Blood Sugar Calculator */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold "
                   style={{ color: 'hsl(25, 50%, 20%)' }}>Blood Sugar</h3>
                  <div className="min-h-[132px]">
                    <Label className=" font-semibold mb-2 block"
                     style={{ color: 'hsl(25, 50%, 20%)' }}>Sugar Level (mg/dL)</Label>
                    <Input
                      value={sugar}
                      onChange={(e) => setSugar(e.target.value)}
                      placeholder="90-100"
                      className="border-stone-300 focus:border-stone-500 bg-white text-lg p-3"
                       style={{ color: 'hsl(25, 50%, 20%)' }}
                    />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {(["fasting", "postmeal", "random"] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSugarContext(c)}
                          className={`py-2 rounded-lg text-sm border transition-colors ${
                            sugarContext === c
                              ? "bg-[#A67B5B] text-white border-[#8f6647]"
                              : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          {c === "fasting" ? "Fasting" : c === "postmeal" ? "Post-meal" : "Random"}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={checkBloodSugar}
                    className="w-full bg-[#A67B5B] hover:bg-[#96694a] text-white  text-white py-4 text-lg font-semibold shadow-lg"

                  >
                    Check Sugar
                  </Button>

                  {sugarResult && (
                    <div className="p-6 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300 shadow-lg">
                      <div className="text-center">
                        <div className="text-lg text-stone-700 font-semibold">{sugarResult}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Health Monitoring Section with Graph */}
        <section id="monitoring-section" className="mb-16">
          <Card className="border-3 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-50 to-stone-200 rounded-t-lg">
              <CardTitle className=" text-2xl font-bold flex items-center"
               style={{ color: 'hsl(25, 50%, 20%)' }}>
                <Activity className="w-7 h-7 mr-3 text-stone-800" />
                Health Monitoring Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-2xl border-2 border-stone-200 shadow-lg">
                  <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-stone-600 rounded-full mr-3"></div>
                    Weight & BP Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A8A29E" />
                      <XAxis dataKey="label" stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <YAxis stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#F5F5F4', 
                          border: '2px solid #78716C',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(107, 64, 35, 0.46)'
                        }} 
                      />
                      <Line type="monotone" dataKey="weight" stroke="#78716C" strokeWidth={3} dot={{ fill: '#78716C', strokeWidth: 2, r: 5 }} />
                      <Line type="monotone" dataKey="bp" stroke="#44403C" strokeWidth={3} dot={{ fill: '#44403C', strokeWidth: 2, r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-2xl border-2 border-stone-200 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-stone-600 rounded-full mr-3"></div>
                    Blood Sugar Levels
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A8A29E" />
                      <XAxis dataKey="label" stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <YAxis stroke="#57534E" fontSize={12} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#F5F5F4', 
                          border: '2px solid #78716C',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Bar dataKey="sugar" fill="#78716C" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prescriptions Section */}
        <section id="prescriptions-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className=" text-2xl font-bold flex items-center"
               style={{ color: 'hsl(25, 50%, 20%)' }}>
                <Pill className="w-7 h-7 mr-3 text-stone-800" />
                Prescription Management
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold" style={{ color: 'hsl(25, 50%, 20%)' }}>
                      Stored Prescriptions ({prescriptions.length})
                    </h3>
                    <Button onClick={() => setShowRxForm((v) => !v)} className="bg-[#A67B5B] hover:bg-[#96694a] text-white">
                      {showRxForm ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                      {showRxForm ? "Close" : "Add New"}
                    </Button>
                  </div>

                  {showRxForm && (
                    <div className="bg-white border-2 border-stone-200 rounded-2xl p-5 mb-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-stone-700">Doctor name *</Label>
                          <Input value={rxForm.doctorName} onChange={(e) => setRxForm({ ...rxForm, doctorName: e.target.value })} placeholder="Dr. ..." className="border-stone-300" />
                        </div>
                        <div>
                          <Label className="text-stone-700">Speciality</Label>
                          <Input value={rxForm.speciality} onChange={(e) => setRxForm({ ...rxForm, speciality: e.target.value })} placeholder="e.g. Gynaecology" className="border-stone-300" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-stone-700">Date</Label>
                        <Input type="date" value={rxForm.date} onChange={(e) => setRxForm({ ...rxForm, date: e.target.value })} className="border-stone-300" />
                      </div>
                      <div>
                        <Label className="text-stone-700">Medications (one per line)</Label>
                        <textarea value={rxForm.medications} onChange={(e) => setRxForm({ ...rxForm, medications: e.target.value })} rows={3} placeholder={"Iron Supplement 325mg\nVitamin D3 2000 IU"} className="w-full border border-stone-300 rounded-lg p-2 text-stone-800" />
                      </div>
                      <div>
                        <Label className="text-stone-700">Notes</Label>
                        <Input value={rxForm.notes} onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })} placeholder="Optional" className="border-stone-300" />
                      </div>
                      <div>
                        <Label className="text-stone-700">Attach prescription (PDF/image, optional)</Label>
                        <input type="file" accept=".pdf,image/*" onChange={(e) => setRxFile(e.target.files?.[0] || null)} className="block text-sm mt-1" />
                      </div>
                      <Button onClick={submitPrescription} disabled={savingRx} className="w-full bg-[#A67B5B] hover:bg-[#96694a] text-white">
                        {savingRx ? "Saving…" : "Save Prescription"}
                      </Button>
                    </div>
                  )}

                  {prescriptions.length === 0 && !showRxForm && (
                    <p className="text-stone-500">No prescriptions yet. Click “Add New” to add one.</p>
                  )}

                  <div className="space-y-4">
                    {prescriptions.map((p) => (
                      <div key={p._id} className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-stone-900 text-lg">{p.doctorName}</h4>
                            {p.speciality && <p className="text-stone-600">{p.speciality}</p>}
                            {p.date && <p className="text-sm text-stone-500">{p.date}</p>}
                          </div>
                          <Badge className="bg-green-200 text-green-900 border-green-400">{p.status || "Active"}</Badge>
                        </div>
                        {p.medications?.length > 0 && (
                          <div className="space-y-2">
                            {p.medications.map((m: string, i: number) => (
                              <div key={i} className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 text-sm">💊 {m}</div>
                            ))}
                          </div>
                        )}
                        {p.notes && <p className="text-sm text-stone-600 mt-2">{p.notes}</p>}
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {p.reportId && (
                            <Button size="sm" variant="outline" onClick={() => viewReport(p.reportId)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              View PDF
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => sharePrescription(p)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removePrescription(p._id)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div
                    className="h-full min-h-[300px] bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')` }}
                  >
                    <div className="h-full bg-gradient-to-t from-stone-900/70 to-transparent rounded-2xl flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">Medication Tracking</h3>
                        <p className="text-stone-200">Your prescriptions, stored and shareable</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Health Records Section */}
        <section id="records-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className="text-amber text-2xl font-bold flex items-center">
                <Stethoscope className="w-7 h-7 mr-3 " 
                 style={{ color: 'hsl(25, 50%, 20%)' }}/>
                Health Records & Consultations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold text-stone-900">Recent Consultations</h3>
                  {prescriptions.length === 0 ? (
                    <p className="text-stone-500">No consultations yet. Add a prescription above and it will appear here automatically.</p>
                  ) : (
                    <div className="space-y-4">
                      {prescriptions.map((p) => (
                        <div key={p._id} className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg">
                          <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-stone-700 to-amber-800 text-white flex items-center justify-center text-xl font-bold">
                              {(p.doctorName || "D").trim().charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-stone-900 text-lg">{p.doctorName}</h4>
                              {p.speciality && <p className="text-stone-600 mb-1">{p.speciality}</p>}
                              {p.date && <p className="text-sm text-stone-500 mb-2">Visited: {p.date}</p>}
                              {p.medications?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {p.medications.slice(0, 4).map((m: string, i: number) => (
                                    <Badge key={i} className="bg-stone-200 text-stone-900 border-stone-400">{m}</Badge>
                                  ))}
                                </div>
                              )}
                              {p.reportId && (
                                <div className="mt-3">
                                  <Button size="sm" variant="outline" onClick={() => viewReport(p.reportId)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Report
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-3xl font-bold text-stone-900">{connectedDoctors}</div>
                      <div className="text-sm text-stone-700 font-semibold">Connected Doctors</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-3xl font-bold text-stone-900">{prescriptions.length}</div>
                      <div className="text-sm text-stone-700 font-semibold">Total Consultations</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Scans & Reports Section */}
        <section id="scans-section" className="mb-16">
          <Card className="border-3 border-stone-300 bg-gradient-to-br from-white to-stone-50 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-t-lg">
              <CardTitle className="text-stone-900 text-2xl font-bold flex items-center">
                <Scan className="w-7 h-7 mr-3 text-stone-800" />
                Medical Scans & X-rays
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-stone-900">Your Scans ({scanReports.length})</h3>
                    <Button onClick={() => scanInputRef.current?.click()} disabled={uploading} className="bg-[#A67B5B] hover:bg-[#96694a] text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading…" : "Upload Scan"}
                    </Button>
                    <input ref={scanInputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={onScanPicked} />
                  </div>

                  {scanReports.length === 0 ? (
                    <p className="text-stone-500">No scans yet. Upload an X-ray, ECG, or any report PDF/image to keep it handy.</p>
                  ) : (
                    <div className="space-y-4">
                      {scanReports.map((r) => (
                        <div key={r._id} className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center border-2 border-blue-300">
                              <Scan className="w-8 h-8 text-blue-700" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-stone-900 text-lg truncate">{r.name}</h4>
                              <p className="text-stone-600 text-sm">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                              <Badge className="bg-stone-200 text-stone-900 border-stone-400 mt-1">{Math.round((r.size || 0) / 1024)} KB</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewReport(r._id)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadReport(r._id)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => removeReport(r._id)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-2xl font-bold text-stone-900">{scanReports.length}</div>
                      <div className="text-sm text-stone-700 font-semibold">Total Scans</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-2xl font-bold text-stone-900">{storageMB} MB</div>
                      <div className="text-sm text-stone-700 font-semibold">Storage Used</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer CTA */}
        <div 
          className="bg-gradient-to-r from-stone-100 to-stone-200 rounded-3xl border-3 border-stone-300 shadow-2xl p-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="bg-white/95 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-stone-900 mb-4 font-serif">Take Control of Your Health Journey</h3>
            <p className="text-lg text-stone-800 max-w-2xl mx-auto mb-6">
              Join thousands who trust MediVault for secure, comprehensive health record management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setSummaryOpen(true)} className="bg-[#A67B5B] hover:bg-[#96694a] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                <FileText className="w-5 h-5 mr-3" />
                View Health Summary
              </Button>
              <Button onClick={shareWithDoctor} className="bg-[#A67B5B] hover:bg-[#96694a] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                <Share className="w-5 h-5 mr-3" />
                Share with Doctor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Camera capture popup */}
      <Dialog open={cameraOpen} onOpenChange={(o) => setCameraOpen(o)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Take a photo</DialogTitle></DialogHeader>
          <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black" />
          <div className="flex gap-2 justify-center mt-2">
            <Button onClick={capturePhoto} className="bg-[#A67B5B] hover:bg-[#96694a] text-white">
              <Camera className="w-4 h-4 mr-2" />Capture & Save
            </Button>
            <Button variant="outline" onClick={() => setCameraOpen(false)} className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File viewer popup */}
      <Dialog open={!!viewer} onOpenChange={(o) => !o && setViewer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle className="truncate pr-6">{viewer?.name}</DialogTitle></DialogHeader>
          {viewer && (
            <div className="w-full h-[70vh] bg-stone-100 rounded-lg overflow-auto flex items-center justify-center">
              {viewer.mimeType?.startsWith("image/") ? (
                <img src={viewer.data} alt={viewer.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <iframe src={viewer.data} title={viewer.name} className="w-full h-full border-0" />
              )}
            </div>
          )}
          <div className="flex justify-end mt-2">
            <a href={viewer?.data} download={viewer?.name}>
              <Button className="bg-[#A67B5B] hover:bg-[#96694a] text-white"><Download className="w-4 h-4 mr-2" />Download</Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>

      {/* Health summary popup */}
      <Dialog open={summaryOpen} onOpenChange={(o) => setSummaryOpen(o)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Your Health Summary</DialogTitle></DialogHeader>
          <pre className="whitespace-pre-wrap text-sm text-stone-800 bg-stone-50 border border-stone-200 rounded-lg p-4 max-h-[60vh] overflow-auto">{buildSummary()}</pre>
          <div className="flex gap-2 justify-end mt-2">
            <Button onClick={downloadSummary} className="bg-[#A67B5B] hover:bg-[#96694a] text-white"><Download className="w-4 h-4 mr-2" />Download</Button>
            <Button onClick={shareWithDoctor} variant="outline" className="border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white"><Share className="w-4 h-4 mr-2" />Share</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
