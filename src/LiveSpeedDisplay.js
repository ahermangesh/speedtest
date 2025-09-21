import React, { useState, useEffect } from 'react';
import LiveChart from './LiveChart';

const LiveSpeedDisplay = ({ currentSpeed, testing, testProgress, liveDownloadData, liveUploadData, livePingData }) => {
  const [speedHistory, setSpeedHistory] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('');

  // Debug logs
  useEffect(() => {
    console.log('LiveSpeedDisplay props:', { 
      testing, 
      liveDownloadData: liveDownloadData?.length || 0, 
      liveUploadData: liveUploadData?.length || 0, 
      livePingData: livePingData?.length || 0 
    });
  }, [testing, liveDownloadData, liveUploadData, livePingData]);

  useEffect(() => {
    if (testing) {
      // Determine current phase from test progress
      if (testProgress.includes('ping')) {
        setCurrentPhase('ping');
      } else if (testProgress.includes('download')) {
        setCurrentPhase('download');
      } else if (testProgress.includes('upload')) {
        setCurrentPhase('upload');
      }

      // Add to speed history for graph
      if (currentSpeed.download > 0 || currentSpeed.upload > 0) {
        setSpeedHistory(prev => {
          const newPoint = {
            timestamp: Date.now(),
            download: currentSpeed.download,
            upload: currentSpeed.upload,
            ping: currentSpeed.ping
          };
          return [...prev.slice(-50), newPoint]; // Keep last 50 points
        });
      }
    } else {
      setSpeedHistory([]);
      setCurrentPhase('');
    }
  }, [currentSpeed, testing, testProgress]);

  if (!testing) return null;

  // Create simple line graph
  const createPath = (data, key) => {
    if (data.length < 2) return '';
    
    const width = 300;
    const height = 60;
    const max = Math.max(...data.map(d => d[key]), 1);
    
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point[key] / max) * height);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const downloadPath = createPath(speedHistory, 'download');
  const uploadPath = createPath(speedHistory, 'upload');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        
        {/* Current Phase Indicator */}
        <div className="mb-8">
          <div className="text-lg text-cyan-400 font-mono font-medium tracking-wider">
            {currentPhase.toUpperCase()} TEST
          </div>
          <div className="text-sm text-gray-400 mt-1">{testProgress}</div>
        </div>

        {/* Live Speed Numbers */}
        <div className="mb-8">
          {currentPhase === 'download' && currentSpeed.download > 0 && (
            <div>
              <div className="text-8xl font-mono font-bold text-green-400 mb-2">
                {currentSpeed.download.toFixed(1)}
              </div>
              <div className="text-2xl text-gray-300 font-medium">Mbps Download</div>
            </div>
          )}
          
          {currentPhase === 'upload' && currentSpeed.upload > 0 && (
            <div>
              <div className="text-8xl font-mono font-bold text-yellow-400 mb-2">
                {currentSpeed.upload.toFixed(1)}
              </div>
              <div className="text-2xl text-gray-300 font-medium">Mbps Upload</div>
            </div>
          )}
          
          {currentPhase === 'ping' && currentSpeed.ping > 0 && (
            <div>
              <div className="text-8xl font-mono font-bold text-cyan-400 mb-2">
                {currentSpeed.ping.toFixed(0)}
              </div>
              <div className="text-2xl text-gray-300 font-medium">ms Ping</div>
            </div>
          )}
        </div>

        {/* Live Charts */}
        {(liveDownloadData?.length > 0 || liveUploadData?.length > 0 || livePingData?.length > 0) && (
          <div className="mb-8 space-y-4">
            {/* Download Chart */}
            {liveDownloadData?.length > 0 && (
              <div className="mx-auto" style={{ width: '400px' }}>
                <LiveChart
                  data={liveDownloadData}
                  label="DOWNLOAD"
                  color="#10B981"
                  maxValue={Math.max(...liveDownloadData, 100)}
                  height={100}
                  width={400}
                />
              </div>
            )}
            
            {/* Upload Chart */}
            {liveUploadData?.length > 0 && (
              <div className="mx-auto" style={{ width: '400px' }}>
                <LiveChart
                  data={liveUploadData}
                  label="UPLOAD"
                  color="#F59E0B"
                  maxValue={Math.max(...liveUploadData, 50)}
                  height={100}
                  width={400}
                />
              </div>
            )}
            
            {/* Ping Chart */}
            {livePingData?.length > 0 && (
              <div className="mx-auto" style={{ width: '400px' }}>
                <LiveChart
                  data={livePingData}
                  label="PING"
                  color="#06B6D4"
                  maxValue={Math.max(...livePingData, 100)}
                  height={100}
                  width={400}
                />
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-96 mx-auto">
          <div className="bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-cyan-400 h-2 rounded-full transition-all duration-300 shadow-lg shadow-cyan-400/30"
              style={{ width: `${Math.min((currentSpeed.download + currentSpeed.upload + currentSpeed.ping) / 3, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-400 font-mono">
            {currentPhase === 'ping' && 'Testing latency...'}
            {currentPhase === 'download' && 'Measuring download speed...'}
            {currentPhase === 'upload' && 'Measuring upload speed...'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveSpeedDisplay;