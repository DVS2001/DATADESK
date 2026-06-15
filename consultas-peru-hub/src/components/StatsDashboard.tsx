import React from 'react';
import { SearchHistory } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { BarChart3, TrendingUp, Cpu, Timer, CheckCircle, AlertOctagon } from 'lucide-react';

interface StatsDashboardProps {
  history: SearchHistory[];
  language: 'es' | 'en';
}

export default function StatsDashboard({ history, language }: StatsDashboardProps) {
  const isEs = language === 'es';

  const t = {
    es: {
      title: "Panel de Rendimiento y Análisis Clínico",
      subtitle: "Visualización de transacciones cifradas de extremo a extremo y latencias",
      totalQueries: "Total Consultas",
      avgLatency: "Latencia Promedio",
      successRate: "Sólidez del Sistema (Éxitos)",
      queriesByName: "Consultas por Tipo de Documento",
      speedTrends: "Tendencia de Velocidad en Tiempo Real (ms)",
      activeTerminals: "Puntos de Consulta Activos",
      noData: "Aún no se han acumulado suficientes métricas para graficar tendencias."
    },
    en: {
      title: "Query Analytics & Performance Dashboard",
      subtitle: "Visualizing end-to-end encrypted transactions and API latencies",
      totalQueries: "Total Queries",
      avgLatency: "Average Latency",
      successRate: "System Success Rate",
      queriesByName: "Queries by Document Type",
      speedTrends: "Real-time Speed Trends (ms)",
      activeTerminals: "Active Monitored Terminals",
      noData: "We need more query history records to draw analytics trends."
    }
  }[language];

  // Raw statistics calculations
  const total = history.length;
  const avgLatency = total > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.durationMs, 0) / total) 
    : 0;
  const successCount = history.filter(h => h.success).length;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 100;

  // Pie chart calculation for Success vs Fail
  const successPieData = [
    { name: isEs ? 'Éxitos' : 'Success', value: successCount, color: '#10B981' },
    { name: isEs ? 'Fallos' : 'Failures', value: total - successCount, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // Bar chart data grouping by QueryType
  const typeCounter: Record<string, number> = {
    dni: 0
  };
  
  history.forEach(item => {
    if (typeCounter[item.type] !== undefined) {
      typeCounter[item.type]++;
    }
  });

  const barChartData = Object.keys(typeCounter).map(key => ({
    name: key.toUpperCase(),
    value: typeCounter[key],
    color: '#3B82F6'
  })).filter(d => d.value > 0);

  // Line/Area Chart data points representing the last 10 queries chronologically
  const timelineData = [...history]
    .slice(0, 10)
    .reverse()
    .map((item, index) => ({
      index: index + 1,
      name: `Q-${item.id.slice(-4)}`,
      latency: item.durationMs,
      type: item.type.toUpperCase()
    }));

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300 shadow-sm space-y-6">
      
      {/* Metrics Banner */}
      <div>
        <h4 className="text-md font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          {t.title}
        </h4>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric Card 1 */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800/65 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">{t.totalQueries}</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-mono">{total}</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800/65 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-955/60 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">{t.avgLatency}</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-mono">{avgLatency}ms</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/50 dark:border-zinc-800/65 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-955/60 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">{t.successRate}</span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-mono text-emerald-500">{successRate}%</span>
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg">
          <AlertOctagon className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-450">{t.noData}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Query type distribution (Bar) */}
          <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-850 rounded-xl p-4">
            <h5 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">{t.queriesByName}</h5>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="hidden dark:block" />
                  <XAxis dataKey="name" fontSize={10} stroke="#a1a1aa" tickLine={false} />
                  <YAxis fontSize={10} stroke="#a1a1aa" spacing={1} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latency evolution (Area) */}
          <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-850 rounded-xl p-4">
            <h5 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">{t.speedTrends}</h5>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="hidden dark:block" />
                  <XAxis dataKey="name" fontSize={10} stroke="#a1a1aa" tickLine={false} />
                  <YAxis fontSize={10} stroke="#a1a1aa" tickLine={false} unit="ms" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="latency" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
