import React from 'react';
import { FaFileDownload, FaFilePdf, FaFileWord, FaTrophy, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const ResultsDisplay = ({ results, onExport, isStabilityTest }) => {
  if (!results) return null;

  const getConnectionQuality = (ping, download, upload) => {
    const avgSpeed = (download + upload) / 2;
    
    if (ping <= 20 && avgSpeed >= 100) {
      return { rating: 'Excellent', icon: FaTrophy, color: 'text-green-400', bgColor: 'bg-green-900' };
    } else if (ping <= 50 && avgSpeed >= 50) {
      return { rating: 'Good', icon: FaCheckCircle, color: 'text-yellow-400', bgColor: 'bg-yellow-900' };
    } else {
      return { rating: 'Poor', icon: FaExclamationTriangle, color: 'text-red-400', bgColor: 'bg-red-900' };
    }
  };

  const getUsageRecommendations = (download, upload, ping) => {
    const recommendations = [];
    
    if (download >= 100) {
      recommendations.push('Excellent for 4K streaming and large downloads');
    } else if (download >= 25) {
      recommendations.push('Good for HD streaming and video calls');
    } else {
      recommendations.push('Suitable for basic browsing and SD streaming');
    }
    
    if (upload >= 50) {
      recommendations.push('Great for video conferencing and content creation');
    } else if (upload >= 10) {
      recommendations.push('Adequate for video calls and file uploads');
    } else {
      recommendations.push('Limited upload capabilities');
    }
    
    if (ping <= 20) {
      recommendations.push('Excellent for online gaming');
    } else if (ping <= 50) {
      recommendations.push('Good for most online activities');
    } else {
      recommendations.push('May experience lag in real-time applications');
    }
    
    return recommendations;
  };

  if (isStabilityTest && results.type === 'stability_final') {
    const { ping_stats, download_stats, upload_stats } = results;
    const quality = getConnectionQuality(ping_stats.avg, download_stats.avg, upload_stats.avg);
    const QualityIcon = quality.icon;

    return (
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Stability Test Results</h2>
          <div className={`inline-flex items-center px-6 py-3 rounded-lg ${quality.bgColor}`}>
            <QualityIcon className={`mr-3 text-xl ${quality.color}`} />
            <span className={`text-lg font-semibold ${quality.color}`}>
              Connection Quality: {quality.rating}
            </span>
          </div>
        </div>

        {/* Test Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{results.total_tests}</p>
            <p className="text-gray-400 text-sm">Tests Completed</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{results.duration_minutes}m</p>
            <p className="text-gray-400 text-sm">Duration</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{download_stats.std.toFixed(1)}</p>
            <p className="text-gray-400 text-sm">Download Variance</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{upload_stats.std.toFixed(1)}</p>
            <p className="text-gray-400 text-sm">Upload Variance</p>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4">Download Speed</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-semibold">{download_stats.avg} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maximum:</span>
                <span className="text-white">{download_stats.max} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum:</span>
                <span className="text-white">{download_stats.min} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Consistency:</span>
                <span className="text-white">{((1 - download_stats.std / download_stats.avg) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Upload Speed</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-semibold">{upload_stats.avg} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Maximum:</span>
                <span className="text-white">{upload_stats.max} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum:</span>
                <span className="text-white">{upload_stats.min} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Consistency:</span>
                <span className="text-white">{((1 - upload_stats.std / upload_stats.avg) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Ping & Latency</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Average:</span>
                <span className="text-white font-semibold">{ping_stats.avg} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Best:</span>
                <span className="text-white">{ping_stats.min} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Worst:</span>
                <span className="text-white">{ping_stats.max} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Jitter:</span>
                <span className="text-white">{ping_stats.std.toFixed(1)} ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Export Results</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onExport('pdf')}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center transition-colors"
            >
              <FaFilePdf className="mr-2" />
              Export as PDF
            </button>
            <button
              onClick={() => onExport('docx')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center transition-colors"
            >
              <FaFileWord className="mr-2" />
              Export as DOCX
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Single test results
  if (results.type === 'final') {
    const quality = getConnectionQuality(results.ping, results.download, results.upload);
    const recommendations = getUsageRecommendations(results.download, results.upload, results.ping);
    const QualityIcon = quality.icon;

    return (
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Speed Test Results</h2>
          <div className={`inline-flex items-center px-6 py-3 rounded-lg ${quality.bgColor}`}>
            <QualityIcon className={`mr-3 text-xl ${quality.color}`} />
            <span className={`text-lg font-semibold ${quality.color}`}>
              Connection Quality: {quality.rating}
            </span>
          </div>
        </div>

        {/* Main Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-cyan-400 text-lg font-semibold mb-2">Ping</h3>
            <p className="text-4xl font-bold text-white mb-2">{results.ping} ms</p>
            {results.jitter > 0 && (
              <p className="text-gray-400 text-sm">Jitter: {results.jitter} ms</p>
            )}
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-green-400 text-lg font-semibold mb-2">Download</h3>
            <p className="text-4xl font-bold text-white">{results.download} Mbps</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-yellow-400 text-lg font-semibold mb-2">Upload</h3>
            <p className="text-4xl font-bold text-white">{results.upload} Mbps</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">What can you do with this connection?</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Server Information */}
        {results.server && (
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Test Server</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Provider:</span>
                <p className="text-white">{results.server.sponsor || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-white">{results.server.name || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-gray-400">Distance:</span>
                <p className="text-white">{results.server.d ? `${results.server.d.toFixed(1)} km` : 'Unknown'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Export Results</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onExport('pdf')}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center transition-colors"
            >
              <FaFilePdf className="mr-2" />
              Export as PDF
            </button>
            <button
              onClick={() => onExport('docx')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center transition-colors"
            >
              <FaFileWord className="mr-2" />
              Export as DOCX
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultsDisplay;