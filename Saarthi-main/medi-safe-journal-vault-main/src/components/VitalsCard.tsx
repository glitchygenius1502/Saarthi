
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Activity, Heart } from "lucide-react";

export const VitalsCard = () => {
  return (
    <Card className="border-3 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-amber-900">
          <div className="flex items-center">
            <Activity className="w-6 h-6 mr-3 text-amber-700" />
            <span className="font-bold">Current Vitals</span>
          </div>
          <Button size="sm" className="bg-amber-800 hover:bg-amber-900 shadow-lg transform hover:scale-105 transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Update
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {/* BMI Section */}
        <div className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-300 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-amber-800" />
              </div>
              <span className="font-bold text-amber-900 text-lg">BMI</span>
            </div>
            <span className="text-3xl font-bold text-amber-900">22.4</span>
          </div>
          <Progress value={70} className="h-3 mb-2" />
          <p className="text-sm text-amber-700 font-medium">Normal range - Excellent!</p>
        </div>

        {/* Weight & Height */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <Label className="text-sm text-orange-800 font-semibold mb-2 block">Weight (kg)</Label>
            <Input value="61.4" className="border-orange-300 focus:border-orange-500 bg-white" />
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
            <Label className="text-sm text-amber-800 font-semibold mb-2 block">Height (cm)</Label>
            <Input value="165" className="border-amber-300 focus:border-amber-500 bg-white" />
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <Label className="text-sm text-green-800 font-semibold mb-3 block">Blood Pressure</Label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input placeholder="120" className="border-green-300 focus:border-green-500 bg-white" />
            <Input placeholder="80" className="border-green-300 focus:border-green-500 bg-white" />
          </div>
          <p className="text-sm text-green-700 font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Normal range - Keep it up!
          </p>
        </div>

        {/* Recent Lab Values */}
        <div className="space-y-4">
          <h4 className="font-bold text-amber-900 text-lg flex items-center">
            <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
            Recent Lab Results
          </h4>
          
          <div className="p-5 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border-2 border-red-300 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-red-900 text-lg">Iron Level</span>
                <p className="text-sm text-red-700 font-medium">8.0 mcg/dL (Below Normal)</p>
                <p className="text-xs text-red-600 mt-1">Recommended: Iron-rich foods & supplements</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <span className="text-red-800 text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-300 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-yellow-900 text-lg">Hemoglobin</span>
                <p className="text-sm text-yellow-700 font-medium">11.5 g/dL (Low Normal)</p>
                <p className="text-xs text-yellow-600 mt-1">Monitor closely - slight improvement needed</p>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 text-xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-green-900 text-lg">Vitamin D</span>
                <p className="text-sm text-green-700 font-medium">32 ng/mL (Optimal)</p>
                <p className="text-xs text-green-600 mt-1">Great levels - maintain current routine</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-green-800 text-xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
