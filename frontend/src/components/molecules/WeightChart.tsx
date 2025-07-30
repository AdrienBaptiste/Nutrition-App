import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface WeightPoint {
  date: string; // ISO string
  value: number;
}

interface WeightChartProps {
  data: WeightPoint[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  // Tri des données par date croissante (sécurité)
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Évolution du poids</h3>
      {sortedData.length > 1 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sortedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={date => new Date(date).toLocaleDateString('fr-FR')}
              minTickGap={20}
            />
            <YAxis domain={['auto', 'auto']} unit=" kg" allowDecimals={true} />
            <Tooltip
              labelFormatter={date => `Date : ${new Date(date).toLocaleDateString('fr-FR')}`}
              formatter={value => `${value} kg`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-500 text-sm">Pas assez de données pour afficher une courbe.</div>
      )}
    </div>
  );
};

export default WeightChart;
