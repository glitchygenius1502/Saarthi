
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Upload, Calendar, Bell, Share, Download, FileText, Plus, Link, Heart, Activity, Shield, Calculator, Stethoscope, Pill, Scan, Camera, Eye, Database } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Index = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bp, setBp] = useState({ systolic: "", diastolic: "" });
  const [sugar, setSugar] = useState("");
  const [bpResult, setBpResult] = useState("");
  const [sugarResult, setSugarResult] = useState("");

  // Health monitoring data
  const healthData = [
    { month: 'Jan', weight: 70, bp: 120, sugar: 95 },
    { month: 'Feb', weight: 69, bp: 118, sugar: 92 },
    { month: 'Mar', weight: 68, bp: 122, sugar: 88 },
    { month: 'Apr', weight: 67, bp: 115, sugar: 94 },
    { month: 'May', weight: 66, bp: 120, sugar: 90 },
    { month: 'Jun', weight: 65, bp: 118, sugar: 87 },
  ];

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const calculatedBMI = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
      
      if (calculatedBMI < 18.5) setBmiCategory("Underweight - Consider increasing caloric intake");
      else if (calculatedBMI >= 18.5 && calculatedBMI < 25) setBmiCategory("Normal weight - Excellent! Keep maintaining");
      else if (calculatedBMI >= 25 && calculatedBMI < 30) setBmiCategory("Overweight - Consider diet and exercise");
      else setBmiCategory("Obese - Consult healthcare provider");
    }
  };

  const checkBloodPressure = () => {
    if (bp.systolic && bp.diastolic) {
      const systolic = parseInt(bp.systolic);
      const diastolic = parseInt(bp.diastolic);
      
      if (systolic < 120 && diastolic < 80) {
        setBpResult("Normal - Your blood pressure is in the healthy range");
      } else if (systolic < 130 && diastolic < 80) {
        setBpResult("Elevated - Monitor closely and consider lifestyle changes");
      } else if (systolic < 140 || diastolic < 90) {
        setBpResult("High Blood Pressure Stage 1 - Consult your doctor");
      } else {
        setBpResult("High Blood Pressure Stage 2 - Seek immediate medical attention");
      }
    }
  };

  const checkBloodSugar = () => {
    if (sugar) {
      const sugarLevel = parseInt(sugar);
      
      if (sugarLevel < 100) {
        setSugarResult("Normal - Your blood sugar is in healthy range");
      } else if (sugarLevel < 126) {
        setSugarResult("Pre-diabetes - Consider dietary changes and exercise");
      } else {
        setSugarResult("Diabetes range - Consult your doctor immediately");
      }
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
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full border border-green-300">
              <Shield className="w-5 h-5 text-green-700" />
              <span className="text-green-800 font-semibold text-sm">Secure & Encrypted</span>
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
                  className="bg-gradient-to-r from-amber-950 to-amber-600  px-6 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Reports
                </Button>
                <Button 
                  onClick={handleBMICalculator}
                  className="bg-gradient-to-r from-amber-950 to-amber-600  px-6 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Health Calculator
                </Button>
                <Button 
                  onClick={handlePrescriptions}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-6 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Pill className="w-5 h-5 mr-2" />
                  Prescriptions
                </Button>
                <Button 
                  onClick={handleHealthRecords}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-6 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Health Records
                </Button>
                <Button 
                  onClick={handleScans}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-6 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  X-rays & Scans
                </Button>
                <Button 
                  onClick={handleHealthMonitoring}
                  className="bg-gradient-to-r from-amber-950 to-amber-600 px-6 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
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
                      <div className="flex gap-2 mb-4">
                        <Button className="bg-amber-900 hover:bg-amber-700 text-white">
                          <FileText className="w-4 h-4 mr-2" />
                          Browse Files
                        </Button>
                        <Button variant="outline" className="border-stone-400">
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div 
                  className="h-96 bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-stone-900/70 to-transparent rounded-2xl flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Document Management</h3>
                      <p className="text-stone-200">Secure storage for all your medical documents</p>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-2 gap-4">
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
                    className="w-full bg-gradient-to-r from-amber-800 to-stone-900  py-4 text-lg font-semibold shadow-lg"
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
                  <div className="grid grid-cols-2 gap-4">
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
                    className="w-full bg-gradient-to-r from-amber-800 to-stone-900  text-white py-4 text-lg font-semibold shadow-lg"
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
                  <div>
                    <Label className=" font-semibold mb-2 block"
                     style={{ color: 'hsl(25, 50%, 20%)' }}>Sugar Level (mg/dL)</Label>
                    <Input 
                      value={sugar}
                      onChange={(e) => setSugar(e.target.value)}
                      placeholder="90-100"
                      className="border-amber-300 focus:border-amber-500 bg-white text-lg p-3"
                       style={{ color: 'hsl(25, 50%, 20%)' }}
                    />
                  </div>
                  
                  <Button 
                    onClick={checkBloodSugar}
                    className="w-full bg-gradient-to-r from-amber-800 to-stone-900  text-white py-4 text-lg font-semibold shadow-lg"

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
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A8A29E" />
                      <XAxis dataKey="month" stroke="#57534E" fontSize={12} fontWeight="bold" />
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
                    <BarChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#A8A29E" />
                      <XAxis dataKey="month" stroke="#57534E" fontSize={12} fontWeight="bold" />
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
                    <h3 className="text-xl font-bold"
                     style={{ color: 'hsl(25, 50%, 20%)' }}>Stored Prescriptions</h3>
                    <Button className="bg-stone-800 hover:bg-stone-900 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                  
                  {/* Example Prescription */}
                  <div className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-stone-900 text-lg">Dr. Sarah Johnson</h4>
                        <p className="text-stone-600">Internal Medicine</p>
                        <p className="text-sm text-stone-500">June 15, 2024</p>
                      </div>
                      <Badge className="bg-green-200 text-green-900 border-green-400">Active</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div>
                          <div className="font-semibold text-stone-900">Iron Supplement</div>
                          <div className="text-sm text-stone-600">325mg - Take once daily with food</div>
                        </div>
                        <div className="text-sm text-stone-800 font-semibold">30 days</div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div>
                          <div className="font-semibold text-stone-900">Vitamin D3</div>
                          <div className="text-sm text-stone-600">2000 IU - Take once daily</div>
                        </div>
                        <div className="text-sm text-stone-800 font-semibold">60 days</div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="border-stone-400">
                        <Eye className="w-4 h-4 mr-2" />
                        View PDF
                      </Button>
                      <Button size="sm" variant="outline" className="border-stone-400">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <div 
                    className="h-96 bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg mb-4"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  >
                    <div className="h-full bg-gradient-to-t from-stone-900/70 to-transparent rounded-2xl flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">Medication Tracking</h3>
                        <p className="text-stone-200">Smart reminders and compliance monitoring</p>
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
                  <h3 className="text-xl font-bold ">Recent Consultations</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-300">
                          <img 
                            src="https://img.freepik.com/premium-photo/young-indian-girl-female-doctor_669954-15854.jpg"
                            alt="Dr. Sarah Johnson"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-stone-900 text-lg">Dr. Sarah Johnson</h4>
                          <p className="text-stone-600 mb-2">Internal Medicine Specialist</p>
                          <p className="text-sm text-stone-500 mb-3">Last visited: June 15, 2024</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-stone-200 text-stone-900 border-stone-400">Iron Deficiency</Badge>
                            <Badge className="bg-blue-200 text-blue-900 border-blue-400">Follow-up Required</Badge>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" variant="outline" className="border-stone-400">
                              <Eye className="w-4 h-4 mr-2" />
                              View Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div 
                    className="h-64 bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg mb-6"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  >
                    <div className="h-full bg-gradient-to-t from-stone-900/70 to-transparent rounded-2xl flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-xl font-bold">Healthcare Network</h3>
                        <p className="text-stone-200">Connected specialists</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-3xl font-bold text-stone-900">8</div>
                      <div className="text-sm text-stone-700 font-semibold">Connected Doctors</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-3xl font-bold text-stone-900">24</div>
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
                    <h3 className="text-xl font-bold text-stone-900">Recent Scans</h3>
                    <Button className="bg-stone-800 hover:bg-stone-900 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Scan
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center border-2 border-blue-300">
                          <Scan className="w-10 h-10 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-lg">Chest X-Ray</h4>
                          <p className="text-stone-600">June 10, 2024</p>
                          <Badge className="bg-green-200 text-green-900 border-green-400 mt-1">Normal</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-stone-700 mb-4">Routine chest examination shows clear lung fields with no abnormalities detected.</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-stone-400">
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                        <Button size="sm" variant="outline" className="border-stone-400">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-white to-stone-50 border-2 border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center border-2 border-purple-300">
                          <Heart className="w-10 h-10 text-purple-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-lg">ECG Report</h4>
                          <p className="text-stone-600">May 25, 2024</p>
                          <Badge className="bg-green-200 text-green-900 border-green-400 mt-1">Normal Rhythm</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-stone-700 mb-4">Electrocardiogram shows normal sinus rhythm with no signs of arrhythmia.</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-stone-400">
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                        <Button size="sm" variant="outline" className="border-stone-400">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div 
                    className="h-80 bg-cover bg-center rounded-2xl border-2 border-stone-300 shadow-lg mb-6"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
                    }}
                  >
                    <div className="h-full bg-gradient-to-t from-stone-900/70 to-transparent rounded-2xl flex items-end p-6">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">Digital Imaging</h3>
                        <p className="text-stone-200">Advanced medical imaging and diagnostics</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-2xl font-bold text-stone-900">15</div>
                      <div className="text-sm text-stone-700 font-semibold">Total Scans</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl border-2 border-stone-300">
                      <div className="text-2xl font-bold text-stone-900">100%</div>
                      <div className="text-sm text-stone-700 font-semibold">Digital Storage</div>
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
              <Button className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-900 hover:to-black text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                <Download className="w-5 h-5 mr-3" />
                Download Health Summary
              </Button>
              <Button className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                <Share className="w-5 h-5 mr-3" />
                Share with Doctor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
