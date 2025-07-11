
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Calendar, Share, Image, File } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Complete Blood Count Panel",
    date: "2024-06-15",
    doctor: "Dr. Sarah Johnson",
    type: "Lab Report",
    status: "reviewed",
    category: "General",
    description: "Comprehensive blood analysis including iron levels"
  },
  {
    id: 2,
    name: "Annual Gynecological Checkup",
    date: "2024-06-01",
    doctor: "Dr. Nandini Sharma",
    type: "Consultation",
    status: "new",
    category: "Gynae",
    description: "Routine examination and preventive care"
  },
  {
    id: 3,
    name: "Iron Deficiency Treatment Plan",
    date: "2024-05-28",
    doctor: "Dr. Sarah Johnson",
    type: "Prescription",
    status: "active",
    category: "General",
    description: "Iron supplements and dietary recommendations"
  },
  {
    id: 4,
    name: "Mammography Screening",
    date: "2024-05-15",
    doctor: "Dr. Lisa Chen",
    type: "Scan",
    status: "reviewed",
    category: "Scans",
    description: "Annual breast cancer screening - normal results"
  }
];

const getCategoryColor = (category: string) => {
  const colors = {
    'General': 'bg-blue-200 text-blue-900 border-blue-300',
    'Gynae': 'bg-pink-200 text-pink-900 border-pink-300',
    'Scans': 'bg-purple-200 text-purple-900 border-purple-300',
    'Mental Health': 'bg-green-200 text-green-900 border-green-300'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-200 text-gray-900 border-gray-300';
};

const getStatusColor = (status: string) => {
  const colors = {
    'new': 'bg-green-200 text-green-900 border-green-300',
    'reviewed': 'bg-gray-200 text-gray-900 border-gray-300',
    'active': 'bg-amber-200 text-amber-900 border-amber-300'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-200 text-gray-900 border-gray-300';
};

export const ReportsSection = () => {
  return (
    <Card className="border-3 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-amber-900 font-bold text-xl">Health Records & Reports</CardTitle>
          <Button className="bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-900 hover:to-orange-900 shadow-lg transform hover:scale-105 transition-all duration-200">
            <Upload className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Enhanced Upload Zone */}
        <div className="border-3 border-dashed border-amber-400 rounded-2xl p-10 mb-8 bg-gradient-to-br from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Upload className="w-10 h-10 text-amber-800" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-3">Drop files here or click to upload</h3>
            <p className="text-amber-800 mb-6 font-medium">Support for PDF, JPG, PNG, DICOM files up to 10MB</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-amber-300 text-amber-900 font-semibold border border-amber-400 px-4 py-2">
                <File className="w-4 h-4 mr-2" />
                Prescriptions
              </Badge>
              <Badge className="bg-orange-300 text-orange-900 font-semibold border border-orange-400 px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Lab Reports
              </Badge>
              <Badge className="bg-amber-300 text-amber-900 font-semibold border border-amber-400 px-4 py-2">
                <Image className="w-4 h-4 mr-2" />
                Scans
              </Badge>
              <Badge className="bg-orange-300 text-orange-900 font-semibold border border-orange-400 px-4 py-2">
                💉 Vaccination
              </Badge>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-amber-900">Recent Reports</h3>
            <div className="flex gap-3">
              <Badge className="bg-amber-300 text-amber-900 font-bold border-2 border-amber-400 px-4 py-2">All (12)</Badge>
              <Badge variant="outline" className="border-2 border-amber-300 text-amber-800 hover:bg-amber-100 px-4 py-2">Gynae (3)</Badge>
              <Badge variant="outline" className="border-2 border-amber-300 text-amber-800 hover:bg-amber-100 px-4 py-2">General (6)</Badge>
              <Badge variant="outline" className="border-2 border-amber-300 text-amber-800 hover:bg-amber-100 px-4 py-2">Scans (3)</Badge>
            </div>
          </div>

          {reports.map((report) => (
            <div key={report.id} className="bg-gradient-to-r from-white to-amber-50 border-2 border-amber-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-amber-800" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-amber-900 text-lg mb-2">{report.name}</h4>
                    <p className="text-sm text-amber-700 mb-3 font-medium">{report.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-amber-800">
                      <span className="flex items-center font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        {report.date}
                      </span>
                      <span className="font-medium">{report.doctor}</span>
                      <span className="text-amber-600">•</span>
                      <span className="font-medium">{report.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={`${getCategoryColor(report.category)} font-semibold border-2 px-3 py-1`}>
                    {report.category}
                  </Badge>
                  <Badge className={`${getStatusColor(report.status)} font-semibold border-2 px-3 py-1`}>
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="hover:bg-amber-100 text-amber-800">
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Quick Stats */}
        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-300 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
            <div className="text-4xl font-bold text-blue-900 mb-2">12</div>
            <div className="text-sm text-blue-700 font-semibold">Total Reports</div>
            <div className="text-xs text-blue-600 mt-1">Since Jan 2024</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
            <div className="text-4xl font-bold text-green-900 mb-2">3</div>
            <div className="text-sm text-green-700 font-semibold">This Month</div>
            <div className="text-xs text-green-600 mt-1">+2 from last month</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105">
            <div className="text-4xl font-bold text-purple-900 mb-2">2</div>
            <div className="text-sm text-purple-700 font-semibold">Shared</div>
            <div className="text-xs text-purple-600 mt-1">With doctors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
