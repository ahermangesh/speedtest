import React, { useState, useEffect } from 'react';

const RealTimeChart = ({ currentSpeed, testing }) => {
  const [speedHistory, setSpeedHistory] = useState([]);
  const maxDataPoints = 30; // Show last 30 data points

  useEffect(() => {
    if (testing && (currentSpeed.download > 0 || currentSpeed.upload > 0)) {
      setSpeedHistory(prev => {
        const newPoint = {
          timestamp: Date.now(),
          download: currentSpeed.download,
          upload: currentSpeed.upload,
          ping: currentSpeed.ping
        };
        
        const updated = [...prev, newPoint];
        // Keep only last 30 points
        return updated.slice(-maxDataPoints);
      });
    } else if (!testing) {
      setSpeedHistory([]);
    }
  }, [currentSpeed, testing]);

  if (!testing || speedHistory.length < 2) {
    return (
      <div className="h-32 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">
        {testing ? 'Collecting data...' : 'Start test to see live chart'}
      </div>
    );
  }

  const maxSpeed = Math.max(
    ...speedHistory.map(point => Math.max(point.download, point.upload)),
    100 // Minimum scale
  );

  const chartWidth = 280;
  const chartHeight = 120;
  const padding = 20;

  // Create SVG path for download speed
  const downloadPath = speedHistory
    .map((point, index) => {
      const x = padding + (index / (speedHistory.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((point.download / maxSpeed) * (chartHeight - 2 * padding));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create SVG path for upload speed
  const uploadPath = speedHistory
    .map((point, index) => {
      const x = padding + (index / (speedHistory.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((point.upload / maxSpeed) * (chartHeight - 2 * padding));
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-gray-700 rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-1 bg-green-400 mr-1"></div>
            <span>Download</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-1 bg-yellow-400 mr-1"></div>
            <span>Upload</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {currentSpeed.download.toFixed(1)} ↓ / {currentSpeed.upload.toFixed(1)} ↑ Mbps
        </div>
      </div>
      
      <svg width={chartWidth} height={chartHeight} className="w-full">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Download speed line */}
        <path
          d={downloadPath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Upload speed line */}
        <path
          d={uploadPath}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Current value dots */}
        {speedHistory.length > 0 && (
          <>
            <circle
              cx={padding + ((speedHistory.length - 1) / (speedHistory.length - 1)) * (chartWidth - 2 * padding)}
              cy={chartHeight - padding - ((speedHistory[speedHistory.length - 1].download / maxSpeed) * (chartHeight - 2 * padding))}
              r="3"
              fill="#10B981"
              className="animate-pulse"
            />
            <circle
              cx={padding + ((speedHistory.length - 1) / (speedHistory.length - 1)) * (chartWidth - 2 * padding)}
              cy={chartHeight - padding - ((speedHistory[speedHistory.length - 1].upload / maxSpeed) * (chartHeight - 2 * padding))}
              r="3"
              fill="#F59E0B"
              className="animate-pulse"
            />
          </>
        )}
        
        {/* Y-axis labels */}
        <text x="5" y="15" fontSize="10" fill="#9CA3AF">{maxSpeed.toFixed(0)}</text>
        <text x="5" y={chartHeight - 5} fontSize="10" fill="#9CA3AF">0</text>
      </svg>
    </div>
  );
};

export default RealTimeChart;