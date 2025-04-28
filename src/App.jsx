import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Оригинальные данные
const data = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: 2000 },
  { name: 'Page D', uv: 2780 },
  { name: 'Page E', uv: 1890 },
  { name: 'Page F', uv: 2390 },
  { name: 'Page G', uv: 3490 },
];

const App = () => {
  const [threshold, setThreshold] = useState(1); // Порог Z-score

  const mean = useMemo(() => data.reduce((sum, d) => sum + d.uv, 0) / data.length, []);
  const stdDev = useMemo(() => {
    return Math.sqrt(
      data.reduce((sum, d) => sum + Math.pow(d.uv - mean, 2), 0) / data.length
    );
  }, [mean]);

  // Вычисляем зоны превышения Z-score
  const zScoreThresholds = useMemo(() => {
    const zones = [];
    
    for (let i = 0; i < data.length; i++) {
      const z = (data[i].uv - mean) / stdDev;
      if (Math.abs(z) > threshold) {
        zones.push(i);
      }
    }

    return zones;
  }, [threshold, mean, stdDev]);

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h2>Z-Score Chart с подсветкой выбросов</h2>

      {/* Управление порогом */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Порог Z-score: <strong>{threshold.toFixed(1)}</strong>
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          {/* Линия графика */}
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fill="none" // Линия без заливки
            strokeWidth={2}
          />

          {/* Заливка для области с Z-score > порога */}
          <Area
            type="monotone"
            data={data}
            dataKey="uv"
            stroke="red"
            fill="red"
            strokeWidth={2}
            // Показываем заливку только в тех местах, где Z-score превышает порог
            fillOpacity={data.map((_, index) => (zScoreThresholds.includes(index) ? 0.2 : 0))}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
