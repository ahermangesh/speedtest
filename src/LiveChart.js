import React, { useEffect, useRef, useState } from 'react';

const LiveChart = ({ data, label, color, maxValue = 100, height = 120, width = 400 }) => {
  const svgRef = useRef(null);
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    if (data.length > animatedData.length) {
      // Animate new data points
      const newData = data.slice(animatedData.length);
      newData.forEach((point, index) => {
        setTimeout(() => {
          setAnimatedData(prev => [...prev, point]);
        }, index * 100); // Stagger animation by 100ms
      });
    } else if (data.length < animatedData.length) {
      // Reset for new test
      setAnimatedData([]);
    }
  }, [data, animatedData.length]);

  const maxDisplayValue = Math.max(maxValue, Math.max(...animatedData, 0) * 1.1);
  const padding = 20;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  // Generate SVG path
  const generatePath = () => {
    if (animatedData.length === 0) return '';

    const points = animatedData.map((value, index) => {
      const x = padding + (index / Math.max(animatedData.length - 1, 1)) * chartWidth;
      const y = padding + chartHeight - (value / maxDisplayValue) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    if (animatedData.length === 0) return '';

    const points = animatedData.map((value, index) => {
      const x = padding + (index / Math.max(animatedData.length - 1, 1)) * chartWidth;
      const y = padding + chartHeight - (value / maxDisplayValue) * chartHeight;
      return `${x},${y}`;
    });

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const lastX = lastPoint.split(',')[0];
    const firstX = firstPoint.split(',')[0];

    return `M ${firstX},${padding + chartHeight} L ${points.join(' L ')} L ${lastX},${padding + chartHeight} Z`;
  };

  // Grid lines
  const gridLines = [];
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const y = padding + (i / numGridLines) * chartHeight;
    const value = maxDisplayValue * (1 - i / numGridLines);
    gridLines.push(
      <g key={i}>
        <line
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <text
          x={padding - 5}
          y={y + 4}
          fill="rgba(255,255,255,0.5)"
          fontSize="10"
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
        >
          {value.toFixed(0)}
        </text>
      </g>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-mono text-gray-300">{label}</span>
        <span className="text-lg font-mono font-bold" style={{ color }}>
          {animatedData.length > 0 ? animatedData[animatedData.length - 1].toFixed(1) : '0.0'} Mbps
        </span>
      </div>
      
      <svg ref={svgRef} width={width} height={height} className="w-full">
        {/* Grid */}
        {gridLines}
        
        {/* Area fill with gradient */}
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {animatedData.length > 0 && (
          <>
            {/* Area fill */}
            <path
              d={generateAreaPath()}
              fill={`url(#gradient-${label})`}
              className="transition-all duration-300 ease-out"
            />
            
            {/* Main line */}
            <path
              d={generatePath()}
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 ease-out"
              style={{
                filter: `drop-shadow(0 0 4px ${color}40)`
              }}
            />
            
            {/* Data points */}
            {animatedData.map((value, index) => {
              const x = padding + (index / Math.max(animatedData.length - 1, 1)) * chartWidth;
              const y = padding + chartHeight - (value / maxDisplayValue) * chartHeight;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color}
                  className="transition-all duration-300 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 3px ${color}80)`,
                    animation: `pulse-${index} 0.5s ease-out`
                  }}
                >
                  <animate
                    attributeName="r"
                    values="0;3;3"
                    dur="0.5s"
                    begin={`${index * 0.1}s`}
                  />
                </circle>
              );
            })}
            
            {/* Latest value indicator */}
            {animatedData.length > 0 && (
              <g>
                {(() => {
                  const lastIndex = animatedData.length - 1;
                  const x = padding + (lastIndex / Math.max(animatedData.length - 1, 1)) * chartWidth;
                  const y = padding + chartHeight - (animatedData[lastIndex] / maxDisplayValue) * chartHeight;
                  
                  return (
                    <>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        fill={color}
                        className="animate-pulse"
                        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        opacity="0.5"
                        className="animate-ping"
                      />
                    </>
                  );
                })()}
              </g>
            )}
          </>
        )}
      </svg>
      
      {/* Real-time stats */}
      <div className="flex justify-between text-xs font-mono text-gray-400 mt-2">
        <span>Samples: {animatedData.length}</span>
        {animatedData.length > 1 && (
          <>
            <span>Min: {Math.min(...animatedData).toFixed(1)}</span>
            <span>Max: {Math.max(...animatedData).toFixed(1)}</span>
            <span>Avg: {(animatedData.reduce((a, b) => a + b, 0) / animatedData.length).toFixed(1)}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChart;