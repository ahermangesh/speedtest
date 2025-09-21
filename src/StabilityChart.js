import React from 'react';

const StabilityChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No stability data available</p>
      </div>
    );
  }

  // Calculate chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = 60;
  const innerWidth = chartWidth - (padding * 2);
  const innerHeight = chartHeight - (padding * 2);

  // Find min/max values for scaling
  const allDownloads = data.map(d => d.download);
  const allUploads = data.map(d => d.upload);
  const allPings = data.map(d => d.ping);
  
  const maxDownload = Math.max(...allDownloads);
  const minDownload = Math.min(...allDownloads);
  const maxUpload = Math.max(...allUploads);
  const minUpload = Math.min(...allUploads);
  const maxPing = Math.max(...allPings);
  const minPing = Math.min(...allPings);

  // Use separate scales for each metric
  const maxSpeed = Math.max(maxDownload, maxUpload);
  const minSpeed = Math.min(minDownload, minUpload);
  
  // Scale functions
  const scaleX = (index) => (index / (data.length - 1)) * innerWidth + padding;
  const scaleSpeedY = (value) => chartHeight - padding - ((value - minSpeed) / (maxSpeed - minSpeed)) * (innerHeight * 0.7);
  const scalePingY = (value) => chartHeight - padding - ((value - minPing) / (maxPing - minPing)) * (innerHeight * 0.3);

  // Generate SVG path strings
  const downloadPath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleSpeedY(d.download)}`
  ).join(' ');

  const uploadPath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleSpeedY(d.upload)}`
  ).join(' ');

  const pingPath = data.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scalePingY(d.ping)}`
  ).join(' ');

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-green-400 mr-2"></div>
            <span className="text-green-400">Download</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-yellow-400 mr-2"></div>
            <span className="text-yellow-400">Upload</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-cyan-400 mr-2"></div>
            <span className="text-cyan-400">Ping</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
          
          {/* Download line */}
          <path
            d={downloadPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
          
          {/* Upload line */}
          <path
            d={uploadPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
          
          {/* Ping line */}
          <path
            d={pingPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              {/* Download point */}
              <circle
                cx={scaleX(i)}
                cy={scaleSpeedY(d.download)}
                r="4"
                fill="#10B981"
                className="cursor-pointer hover:r-6 transition-all"
              >
                <title>{`Test ${i + 1}: ${d.download.toFixed(2)} Mbps Download`}</title>
              </circle>
              
              {/* Upload point */}
              <circle
                cx={scaleX(i)}
                cy={scaleSpeedY(d.upload)}
                r="4"
                fill="#F59E0B"
                className="cursor-pointer hover:r-6 transition-all"
              >
                <title>{`Test ${i + 1}: ${d.upload.toFixed(2)} Mbps Upload`}</title>
              </circle>
              
              {/* Ping point */}
              <circle
                cx={scaleX(i)}
                cy={scalePingY(d.ping)}
                r="3"
                fill="#06B6D4"
                className="cursor-pointer hover:r-5 transition-all"
              >
                <title>{`Test ${i + 1}: ${d.ping.toFixed(2)} ms Ping`}</title>
              </circle>
            </g>
          ))}
          
          {/* Axis labels */}
          <text x={padding} y={chartHeight - 10} fill="#9CA3AF" fontSize="12">
            Test 1
          </text>
          <text x={chartWidth - padding} y={chartHeight - 10} fill="#9CA3AF" fontSize="12" textAnchor="end">
            Test {data.length}
          </text>
          
          {/* Y-axis labels */}
          <text x={10} y={padding} fill="#9CA3AF" fontSize="12">
            {maxSpeed.toFixed(0)} Mbps
          </text>
          <text x={10} y={chartHeight - padding} fill="#9CA3AF" fontSize="12">
            {minSpeed.toFixed(0)} Mbps
          </text>
        </svg>
      </div>
      
      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-2">Download</h4>
          <p className="text-2xl font-bold text-white">{(allDownloads.reduce((a, b) => a + b, 0) / allDownloads.length).toFixed(1)} Mbps</p>
          <p className="text-sm text-gray-400">
            {Math.min(...allDownloads).toFixed(1)} - {Math.max(...allDownloads).toFixed(1)} Mbps
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">Upload</h4>
          <p className="text-2xl font-bold text-white">{(allUploads.reduce((a, b) => a + b, 0) / allUploads.length).toFixed(1)} Mbps</p>
          <p className="text-sm text-gray-400">
            {Math.min(...allUploads).toFixed(1)} - {Math.max(...allUploads).toFixed(1)} Mbps
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-cyan-400 font-semibold mb-2">Ping</h4>
          <p className="text-2xl font-bold text-white">{(allPings.reduce((a, b) => a + b, 0) / allPings.length).toFixed(1)} ms</p>
          <p className="text-sm text-gray-400">
            {Math.min(...allPings).toFixed(1)} - {Math.max(...allPings).toFixed(1)} ms
          </p>
        </div>
      </div>
    </div>
  );
};

export default StabilityChart;