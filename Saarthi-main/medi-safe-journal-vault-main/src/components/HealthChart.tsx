
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const weightData = [
  { month: 'Jan', weight: 58 },
  { month: 'Feb', weight: 59 },
  { month: 'Mar', weight: 58.5 },
  { month: 'Apr', weight: 60 },
  { month: 'May', weight: 61.4 },
  { month: 'Jun', weight: 61.4 },
];

const vitalsData = [
  { name: 'BP Systolic', value: 120, normal: 120, color: '#10B981' },
  { name: 'BP Diastolic', value: 80, normal: 80, color: '#10B981' },
  { name: 'Iron Level', value: 8, normal: 12, color: '#EF4444' },
  { name: 'Hemoglobin', value: 11.5, normal: 12, color: '#F59E0B' },
];

export const HealthChart = () => {
  return (
    <Card className="border-3 border-amber-300 bg-gradient-to-br from-white to-amber-50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
        <CardTitle className="text-amber-900 text-xl font-bold">Health Trends & Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Trend Chart */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 shadow-lg">
            <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-amber-600 rounded-full mr-3"></div>
              Weight Progression
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FCD34D" />
                <XAxis 
                  dataKey="month" 
                  stroke="#92400E" 
                  fontSize={12}
                  fontWeight="bold"
                />
                <YAxis 
                  stroke="#92400E" 
                  fontSize={12}
                  fontWeight="bold"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FEF3C7', 
                    border: '2px solid #D97706',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#D97706" 
                  strokeWidth={4}
                  dot={{ fill: '#D97706', strokeWidth: 3, r: 6 }}
                  activeDot={{ r: 8, fill: '#92400E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Vitals Comparison */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 shadow-lg">
            <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-orange-600 rounded-full mr-3"></div>
              Current vs Normal Levels
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vitalsData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#FED7AA" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9A3412" 
                  fontSize={11} 
                  fontWeight="bold"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9A3412" 
                  fontSize={12}
                  fontWeight="bold"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FED7AA', 
                    border: '2px solid #EA580C',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  fill="#EA580C" 
                  radius={[6, 6, 0, 0]}
                  name="Current"
                />
                <Bar 
                  dataKey="normal" 
                  fill="#FED7AA" 
                  radius={[6, 6, 0, 0]}
                  name="Normal"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
