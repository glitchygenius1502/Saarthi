
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Share, Download, Calendar, Bell, Plus, Sparkles } from "lucide-react";

export const QuickActions = () => {
  return (
    <Card className="border-3 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
        <CardTitle className="text-amber-900 text-xl font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <Button className="w-full justify-start bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-900 hover:to-orange-900 text-white shadow-lg transform hover:scale-105 transition-all duration-200 py-3">
          <Upload className="w-5 h-5 mr-3" />
          <span className="font-semibold">Upload New Report</span>
        </Button>
        
        <Button variant="outline" className="w-full justify-start border-2 border-amber-300 hover:bg-amber-100 text-amber-800 font-semibold shadow-md transform hover:scale-105 transition-all duration-200 py-3">
          <Plus className="w-5 h-5 mr-3" />
          Log Daily Vitals
        </Button>
        
        <Button variant="outline" className="w-full justify-start border-2 border-orange-300 hover:bg-orange-100 text-orange-800 font-semibold shadow-md transform hover:scale-105 transition-all duration-200 py-3">
          <Calendar className="w-5 h-5 mr-3" />
          Schedule Checkup
        </Button>
        
        <Button variant="outline" className="w-full justify-start border-2 border-amber-300 hover:bg-amber-100 text-amber-800 font-semibold shadow-md transform hover:scale-105 transition-all duration-200 py-3">
          <Share className="w-5 h-5 mr-3" />
          Share with Doctor
        </Button>
        
        <Button variant="outline" className="w-full justify-start border-2 border-orange-300 hover:bg-orange-100 text-orange-800 font-semibold shadow-md transform hover:scale-105 transition-all duration-200 py-3">
          <Download className="w-5 h-5 mr-3" />
          Export Health Data
        </Button>
        
        <Button variant="outline" className="w-full justify-start border-2 border-amber-300 hover:bg-amber-100 text-amber-800 font-semibold shadow-md transform hover:scale-105 transition-all duration-200 py-3">
          <Bell className="w-5 h-5 mr-3" />
          Set Health Reminder
        </Button>
        
        {/* Enhanced AI Assistant */}
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl border-3 border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-purple-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-purple-900 mb-2 text-lg">AI Health Assistant</h4>
              <p className="text-sm text-purple-800 mb-4 leading-relaxed font-medium">
                "Based on your recent iron deficiency results, I recommend scheduling a follow-up with your doctor 
                and adding spinach, lentils, and fortified cereals to your diet."
              </p>
              <div className="flex space-x-3">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg">
                  View Recommendations
                </Button>
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold">
                  Ask AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
