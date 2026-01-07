interface SimpleLineChartProps {
  data: number[];
  labels: string[];
  color?: string;
}

export const SimpleLineChart = ({ data, labels, color = "#4f46e5" }: SimpleLineChartProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 60;
  const width = 200;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex items-end relative h-20 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
           {/* Grid lines */}
           <line x1="0" y1="0" x2={width} y2="0" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
           <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
           <line x1="0" y1={height} x2={width} y2={height} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
           
           {/* The line */}
           <polyline
             fill="none"
             stroke={color}
             strokeWidth="3"
             points={points}
             strokeLinecap="round"
             strokeLinejoin="round"
           />
           {/* Fill area */}
           <polygon
             fill={color}
             fillOpacity="0.1"
             points={`0,${height} ${points} ${width},${height}`}
           />
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((l, i) => (
          // Show only first, middle, last labels to prevent crowding
          (i % 2 === 0 || i === labels.length - 1) && <span key={i} className="text-[10px] text-gray-400">{l}</span>
        ))}
      </div>
    </div>
  );
};