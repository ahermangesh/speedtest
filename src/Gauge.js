import React from 'react';

const Gauge = ({ value, maxValue }) => {
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 45; // r = 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className="text-cyan-400"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        {/* Text */}
        <text
          x="50"
          y="50"
          fontFamily="Verdana"
          fontSize="16"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          className="font-bold"
        >
          {value.toFixed(2)}
        </text>
        <text
          x="50"
          y="65"
          fontFamily="Verdana"
          fontSize="8"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="gray"
        >
          Mbps
        </text>
      </svg>
    </div>
  );
};

export default Gauge;
