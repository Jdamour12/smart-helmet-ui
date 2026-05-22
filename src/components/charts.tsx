import type { HelmetData } from '@/lib/types';

interface SimpleChartProps {
  title: string;
  data: Array<{ label: string; value: number; max: number }>;
}

export function SimpleChart({ title, data }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.max));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className="text-sm font-bold text-slate-900">{item.value.toFixed(1)}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(item.value / item.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatusDistributionProps {
  helmets: HelmetData[];
}

export function StatusDistribution({ helmets }: StatusDistributionProps) {
  const worn = helmets.filter((h) => h.helmetWorn).length;
  const notWorn = helmets.length - worn;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4">Helmet Wear Compliance</h3>
      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">{worn}</p>
          <p className="text-sm text-slate-600 mt-1">Wearing</p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((worn / helmets.length) * 100)}%
          </p>
        </div>
        <div className="w-px h-16 bg-slate-200"></div>
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600">{notWorn}</p>
          <p className="text-sm text-slate-600 mt-1">Not Wearing</p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((notWorn / helmets.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-6 flex gap-1 h-2 rounded-full overflow-hidden">
        <div
          className="bg-green-500"
          style={{ width: `${(worn / helmets.length) * 100}%` }}
        ></div>
        <div
          className="bg-red-500"
          style={{ width: `${(notWorn / helmets.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

interface GasAveragesProps {
  helmets: HelmetData[];
}

export function GasAverages({ helmets }: GasAveragesProps) {
  const avgCO = helmets.reduce((sum, h) => sum + h.co, 0) / helmets.length;
  const avgCH4 = helmets.reduce((sum, h) => sum + h.ch4, 0) / helmets.length;
  const avgTemp = helmets.reduce((sum, h) => sum + h.temperature, 0) / helmets.length;
  const avgHumidity = helmets.reduce((sum, h) => sum + h.humidity, 0) / helmets.length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4">Average Readings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-slate-600">CO Average</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{avgCO.toFixed(1)}</p>
          <p className="text-xs text-slate-500 mt-1">ppm</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-slate-600">CH4 Average</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{avgCH4.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">%</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-slate-600">Temp Average</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{avgTemp.toFixed(1)}</p>
          <p className="text-xs text-slate-500 mt-1">°C</p>
        </div>
        <div className="p-3 bg-teal-50 rounded-lg">
          <p className="text-xs text-slate-600">Humidity Average</p>
          <p className="text-2xl font-bold text-teal-600 mt-1">{avgHumidity.toFixed(1)}</p>
          <p className="text-xs text-slate-500 mt-1">%</p>
        </div>
      </div>
    </div>
  );
}
