import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { Card, Badge, Button } from './UI';
import { Activity, Zap, DollarSign, Clock, Target, ChevronRight } from 'lucide-react';
import ChatHistory from './ChatHistory';

const routingData = [
  { name: 'Mon', queries: 400, cost: 2.4 },
  { name: 'Tue', queries: 300, cost: 1.8 },
  { name: 'Wed', queries: 600, cost: 3.6 },
  { name: 'Thu', queries: 800, cost: 4.8 },
  { name: 'Fri', queries: 500, cost: 3.0 },
  { name: 'Sat', queries: 200, cost: 1.2 },
  { name: 'Sun', queries: 150, cost: 0.9 },
];

const modelUsageData = [
  { name: 'Llama 3.1 8B', value: 45, latency: 124, cost: 0.15 },
  { name: 'Mixtral 8x7B', value: 25, latency: 245, cost: 0.60 },
  { name: 'Qwen 2.5 7B', value: 20, latency: 98, cost: 0.12 },
  { name: 'Mistral 7B', value: 10, latency: 112, cost: 0.15 },
];

const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#E5E7EB'];

export default function Stats() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto text-gray-900">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Queries', value: '12,482', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg. Latency', value: '142ms', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Cost Saved', value: '$248.50', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Throughput', value: '42 req/s', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <Card key={i} className="p-4 md:p-6 flex items-center gap-4 bg-white border-gray-100 shadow-sm">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Routing Volume Chart */}
        <Card className="p-4 md:p-6 space-y-6 bg-white border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-bold text-gray-900">Routing Volume (Last 7 Days)</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="queries" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Model Distribution */}
        <Card className="p-4 md:p-6 space-y-6 bg-white border-gray-100 shadow-sm">
          <h3 className="text-base md:text-lg font-bold text-gray-900">Model Distribution</h3>
          <div className="h-[300px] w-full flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex-1 w-full h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modelUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 shrink-0">
              {modelUsageData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] md:text-xs font-bold text-gray-600">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Model Efficiency Map */}
        <Card className="p-4 md:p-6 space-y-6 bg-white border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Model Efficiency Map</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-900" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latency vs Cost</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  type="number" 
                  dataKey="latency" 
                  name="Latency" 
                  unit="ms" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  label={{ value: 'Latency (ms)', position: 'bottom', offset: 0, fontSize: 10, fill: '#9ca3af' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="cost" 
                  name="Cost" 
                  unit="$" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  label={{ value: 'Cost ($)', angle: -90, position: 'left', fontSize: 10, fill: '#9ca3af' }}
                />
                <ZAxis type="number" dataKey="value" range={[100, 1000]} name="Usage" unit="%" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                />
                <Scatter name="Models" data={modelUsageData} fill="#111827">
                  {modelUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Latency Trend */}
        <Card className="p-6 space-y-6 bg-white border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Latency Trend (ms)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={routingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="queries" 
                  stroke="#111827" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#111827', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Model Performance Breakdown */}
      <Card className="p-6 space-y-6 bg-white border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 text-white rounded-xl">
              <Target size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Model Performance Breakdown</h3>
          </div>
          <Badge className="bg-gray-100 text-gray-600 border-none">Live Data</Badge>
        </div>
        
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Model</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Provider</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Avg. Latency</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Cost / 1M</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Usage</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modelUsageData.map((model, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{model.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">NVIDIA</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-gray-900">{model.latency}ms</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-gray-900">${model.cost}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-mono text-sm font-bold text-gray-900">{model.value}%</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full" 
                          style={{ width: `${model.value}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-green-600">99.9%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="pt-8 border-t border-gray-100">
        <ChatHistory />
      </div>
    </div>
  );
}
