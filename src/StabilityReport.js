import React from 'react';

const StabilityReport = ({ results, stabilityData }) => {
  if (!results || results.test_type !== 'continuous') return null;

  // Group stability data by minute
  const groupByMinute = (data) => {
    const minuteGroups = {};
    
    data.forEach((point, index) => {
      const minute = Math.floor(index / 12) + 1; // Assuming 5-second intervals = 12 tests per minute
      if (!minuteGroups[minute]) {
        minuteGroups[minute] = [];
      }
      minuteGroups[minute].push(point);
    });
    
    return minuteGroups;
  };

  const calculateMinuteStats = (tests) => {
    if (!tests || tests.length === 0) return null;
    
    const downloads = tests.map(t => t.download);
    const uploads = tests.map(t => t.upload);
    const pings = tests.map(t => t.ping);
    
    return {
      download: {
        avg: downloads.reduce((a, b) => a + b, 0) / downloads.length,
        min: Math.min(...downloads),
        max: Math.max(...downloads)
      },
      upload: {
        avg: uploads.reduce((a, b) => a + b, 0) / uploads.length,
        min: Math.min(...uploads),
        max: Math.max(...uploads)
      },
      ping: {
        avg: pings.reduce((a, b) => a + b, 0) / pings.length,
        min: Math.min(...pings),
        max: Math.max(...pings)
      },
      tests: tests.length
    };
  };

  const minuteData = groupByMinute(stabilityData);
  const minutes = Object.keys(minuteData).sort((a, b) => parseInt(a) - parseInt(b));

  const getQualityIndicator = (value, type) => {
    if (type === 'ping') {
      if (value <= 20) return { text: 'EXCELLENT', color: 'text-green-400' };
      if (value <= 50) return { text: 'GOOD', color: 'text-yellow-400' };
      return { text: 'POOR', color: 'text-red-400' };
    } else {
      if (value >= 100) return { text: 'EXCELLENT', color: 'text-green-400' };
      if (value >= 50) return { text: 'GOOD', color: 'text-yellow-400' };
      return { text: 'POOR', color: 'text-red-400' };
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold font-mono text-cyan-400 mb-6">STABILITY REPORT</h3>
      
      {/* Overall Summary */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold font-mono text-green-400">
            {results.avg_download?.toFixed(1)} Mbps
          </div>
          <div className="text-sm text-gray-400 font-medium">Avg Download</div>
          <div className="text-xs text-gray-500 mt-1">
            {results.min_download?.toFixed(1)} - {results.max_download?.toFixed(1)} Mbps
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold font-mono text-yellow-400">
            {results.avg_upload?.toFixed(1)} Mbps
          </div>
          <div className="text-sm text-gray-400 font-medium">Avg Upload</div>
          <div className="text-xs text-gray-500 mt-1">
            {results.min_upload?.toFixed(1)} - {results.max_upload?.toFixed(1)} Mbps
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {results.avg_ping?.toFixed(0)} ms
          </div>
          <div className="text-sm text-gray-400 font-medium">Avg Ping</div>
          <div className="text-xs text-gray-500 mt-1">
            {results.min_ping?.toFixed(0)} - {results.max_ping?.toFixed(0)} ms
          </div>
        </div>
      </div>

      {/* Minute-wise Breakdown */}
      <div className="mb-6">
        <h4 className="text-lg font-bold font-mono text-white mb-4">MINUTE-WISE ANALYSIS</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-mono text-gray-400">MINUTE</th>
                <th className="text-center py-3 px-4 font-mono text-gray-400">TESTS</th>
                <th className="text-center py-3 px-4 font-mono text-gray-400">DOWNLOAD</th>
                <th className="text-center py-3 px-4 font-mono text-gray-400">UPLOAD</th>
                <th className="text-center py-3 px-4 font-mono text-gray-400">PING</th>
                <th className="text-center py-3 px-4 font-mono text-gray-400">QUALITY</th>
              </tr>
            </thead>
            <tbody>
              {minutes.map(minute => {
                const stats = calculateMinuteStats(minuteData[minute]);
                if (!stats) return null;
                
                const downloadQuality = getQualityIndicator(stats.download.avg, 'download');
                const overallQuality = stats.download.avg >= 50 && stats.upload.avg >= 25 && stats.ping.avg <= 50
                  ? { text: 'STABLE', color: 'text-green-400' }
                  : { text: 'UNSTABLE', color: 'text-red-400' };

                return (
                  <tr key={minute} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                      {minute}:00
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">
                      {stats.tests}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <div className="text-white font-bold">{stats.download.avg.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">
                        {stats.download.min.toFixed(1)}-{stats.download.max.toFixed(1)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <div className="text-white font-bold">{stats.upload.avg.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">
                        {stats.upload.min.toFixed(1)}-{stats.upload.max.toFixed(1)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <div className="text-white font-bold">{stats.ping.avg.toFixed(0)}</div>
                      <div className="text-xs text-gray-500">
                        {stats.ping.min.toFixed(0)}-{stats.ping.max.toFixed(0)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono text-xs font-bold ${overallQuality.color}`}>
                        {overallQuality.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connection Quality Summary */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h5 className="font-mono text-white font-bold mb-3">CONNECTION STABILITY</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Stability Score:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {results.stability_score?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Tests:</span>
              <span className="font-mono text-white">{results.test_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="font-mono text-white">{results.duration} min</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h5 className="font-mono text-white font-bold mb-3">PERFORMANCE RATING</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Download:</span>
              <span className={`font-mono font-bold ${getQualityIndicator(results.avg_download, 'download').color}`}>
                {getQualityIndicator(results.avg_download, 'download').text}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Upload:</span>
              <span className={`font-mono font-bold ${getQualityIndicator(results.avg_upload, 'upload').color}`}>
                {getQualityIndicator(results.avg_upload, 'upload').text}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ping:</span>
              <span className={`font-mono font-bold ${getQualityIndicator(results.avg_ping, 'ping').color}`}>
                {getQualityIndicator(results.avg_ping, 'ping').text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StabilityReport;