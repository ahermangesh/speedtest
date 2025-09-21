import React, { useEffect, useState } from 'react';

const Gauge = ({ value, maxValue, unit = 'Mbps', type = 'speed' }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate the value change
    const duration = 1000; // 1 second animation
    const steps = 60; // 60fps
    const stepDuration = duration / steps;
    const valueStep = (value - animatedValue) / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const newValue = animatedValue + (valueStep * currentStep);
      
      if (currentStep >= steps) {
        setAnimatedValue(value);
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setAnimatedValue(newValue);
        setDisplayValue(newValue);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value]);

  // Calculate percentage for the arc
  const percentage = Math.min((animatedValue / maxValue) * 100, 100);
  const strokeDasharray = `${percentage * 2.51}, 251.2`; // 251.2 is approximately the circumference of a circle with radius 40

  // Color based on value and type
  const getColor = () => {
    if (type === 'ping') {
      if (animatedValue <= 20) return '#10B981'; // green
      if (animatedValue <= 50) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    } else {
      if (animatedValue >= maxValue * 0.8) return '#10B981'; // green
      if (animatedValue >= maxValue * 0.5) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    }
  };

  const color = getColor();

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#1F2937"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray="251.2, 251.2"
          className="opacity-40"
        />
        
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={color}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 4px ${color}60)`
          }}
        />
      </svg>
      
      {/* Value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-sm font-bold tabular-nums font-mono"
          style={{ color }}
        >
          {displayValue.toFixed(displayValue >= 100 ? 0 : 1)}
        </span>
        <span className="text-xs text-gray-500 font-mono">
          {unit}
        </span>
      </div>
      
      {/* Quality indicator */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="px-2 py-1 rounded text-xs font-medium font-mono" style={{ backgroundColor: `${color}20`, color }}>
          {type === 'ping' 
            ? (animatedValue <= 20 ? 'GOOD' : animatedValue <= 50 ? 'OK' : 'POOR')
            : (animatedValue >= maxValue * 0.8 ? 'FAST' : animatedValue >= maxValue * 0.5 ? 'OK' : 'SLOW')
          }
        </div>
      </div>
    </div>
  );
};

export default Gauge;
