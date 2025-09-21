import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { FaDownload, FaUpload, FaWifi, FaStop } from 'react-icons/fa';
import Gauge from './Gauge';
import LiveSpeedDisplay from './LiveSpeedDisplay';
import StabilityReport from './StabilityReport';

const socket = io('http://localhost:5000');

const SpeedTest = () => {
  const [results, setResults] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testType, setTestType] = useState('single'); // 'single' or 'continuous'
  const [duration, setDuration] = useState(5); // Duration in minutes
  const [sessionId, setSessionId] = useState('');
  const [selectedServerId, setSelectedServerId] = useState(null); // null means auto-select
  const [serverInfo, setServerInfo] = useState(null);
  const [clientInfo, setClientInfo] = useState(null); // Add client info state
  const [testProgress, setTestProgress] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState({ download: 0, upload: 0, ping: 0 });
  const [stabilityData, setStabilityData] = useState([]);
  const [runningStats, setRunningStats] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [continuousTestActive, setContinuousTestActive] = useState(false);
  // Real-time chart data
  const [liveDownloadData, setLiveDownloadData] = useState([]);
  const [liveUploadData, setLiveUploadData] = useState([]);
  const [livePingData, setLivePingData] = useState([]);

  useEffect(() => {
    // Generate unique session ID
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    // Socket event listeners
    socket.on('test_result', (data) => {
      if (data.type === 'final') {
        setResults(data);
        setTesting(false);
        setContinuousTestActive(false);
        setTestHistory(prev => [...prev, data]);
      } else if (data.type === 'error') {
        console.error('Test error:', data.message);
        setTesting(false);
        setContinuousTestActive(false);
        setTestProgress(`Error: ${data.message}`);
      }
    });

    socket.on('test_progress', (data) => {
      setTestProgress(data.message || '');
      
      if (data.type === 'client_info') {
        setClientInfo(data.client);
      } else if (data.type === 'server_selected') {
        setServerInfo(data.server);
      } else if (data.type === 'download_progress') {
        setCurrentSpeed(prev => ({ ...prev, download: data.download }));
        setLiveDownloadData(prev => [...prev, data.download]);
        console.log('Download data point:', data.download); // Debug log
      } else if (data.type === 'download_complete') {
        setCurrentSpeed(prev => ({ ...prev, download: data.download }));
        setLiveDownloadData(prev => [...prev, data.download]);
      } else if (data.type === 'upload_progress') {
        setCurrentSpeed(prev => ({ ...prev, upload: data.upload }));
        setLiveUploadData(prev => [...prev, data.upload]);
        console.log('Upload data point:', data.upload); // Debug log
      } else if (data.type === 'upload_complete') {
        setCurrentSpeed(prev => ({ ...prev, upload: data.upload }));
        setLiveUploadData(prev => [...prev, data.upload]);
      } else if (data.type === 'ping_sample') {
        setCurrentSpeed(prev => ({ ...prev, ping: data.ping }));
        setLivePingData(prev => [...prev, data.ping]);
        console.log('Ping data point:', data.ping); // Debug log
      }
    });

    socket.on('continuous_test_started', (data) => {
      setContinuousTestActive(true);
      setStabilityData([]);
      setRunningStats(null);
    });

    socket.on('running_stats', (data) => {
      setRunningStats(data);
      // Add data point to stability chart
      setStabilityData(prev => [...prev, {
        test_number: data.test_count,
        ping: data.avg_ping,
        download: data.avg_download,
        upload: data.avg_upload,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('stability_analysis', (data) => {
      setResults(data);
      setContinuousTestActive(false);
      setTesting(false);
    });

    socket.on('test_stopped', () => {
      setTesting(false);
      setContinuousTestActive(false);
      setTestProgress('Test stopped by user');
    });

    return () => {
      socket.off('test_result');
      socket.off('test_progress');
      socket.off('continuous_test_started');
      socket.off('running_stats');
      socket.off('stability_analysis');
      socket.off('test_stopped');
    };
  }, []);

  const startTest = () => {
    setResults(null);
    setTesting(true);
    setTestProgress('Initializing test...');
    setCurrentSpeed({ download: 0, upload: 0, ping: 0 });
    setStabilityData([]);
    setRunningStats(null);
    // Reset live chart data
    setLiveDownloadData([]);
    setLiveUploadData([]);
    setLivePingData([]);
    
    socket.emit('start_test', {
      session_id: sessionId,
      test_type: testType,
      duration: duration,
      server_id: selectedServerId
    });
  };

  const stopTest = () => {
    socket.emit('stop_test', { session_id: sessionId });
  };

  const handleServerSelect = (server) => {
    setSelectedServerId(server ? server.id : null);
    setServerInfo(server);
  };

  const exportResults = async (format) => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: format,
          results: results,
          stabilityData: stabilityData
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Handle successful export
        alert(`Export to ${format.toUpperCase()} initiated. Download will start shortly.`);
      } else {
        alert(`Export failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col font-mono">
      {/* Minimalist Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-widest font-mono">
          <span className="text-cyan-400">SPEED</span><span className="text-white">TEST</span>
        </h1>
        <div className="flex space-x-6 text-gray-400 text-sm font-medium">
          <button className="hover:text-cyan-400 transition-colors">Results</button>
          <button className="hover:text-cyan-400 transition-colors">Settings</button>
        </div>
      </header>

      {/* Main Single Screen Layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 relative">
        
        {/* Top Controls Row */}
        <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
          {/* Test Type Selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setTestType('single')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                testType === 'single'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Quick Test
            </button>
            <button
              onClick={() => setTestType('continuous')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                testType === 'continuous'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Stability Test
            </button>
            
            {/* Duration Selection for Stability Test */}
            {testType === 'continuous' && (
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm text-gray-400 font-mono">Duration:</span>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm font-mono focus:border-cyan-400 focus:outline-none"
                  disabled={testing}
                >
                  <option value={1}>1 min</option>
                  <option value={2}>2 min</option>
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
            )}
          </div>

          {/* Server Info */}
          {serverInfo && (
            <div className="text-right text-sm">
              <p className="text-cyan-400 font-medium">{serverInfo.name}</p>
              <p className="text-gray-400">{serverInfo.location} • {serverInfo.distance}km</p>
            </div>
          )}
        </div>

        {/* Real-time Progress Bar */}
        {testing && (
          <div className="absolute top-20 left-8 right-8">
            <div className="bg-gray-800 rounded-full h-1 mb-2">
              <div 
                className="bg-cyan-400 h-1 rounded-full transition-all duration-300 shadow-lg shadow-cyan-400/30"
                style={{ width: `${runningStats?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-center text-xs text-gray-400 font-medium">{testProgress}</p>
          </div>
        )}

        {/* Center Test Interface */}
        <div className="flex flex-col items-center">
          
          {/* GO Button */}
          <div className="relative mb-12">
            <button
              onClick={startTest}
              disabled={testing}
              className="relative w-48 h-48 rounded-full border-2 border-cyan-400 flex items-center justify-center text-5xl font-bold text-white transition-all duration-300 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              style={{
                background: testing 
                  ? 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)'
                  : 'transparent'
              }}
            >
              {testing ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-3"></div>
                  <span className="text-base font-medium">TESTING</span>
                </div>
              ) : (
                'GO'
              )}
            </button>
            
            {testing && (
              <button
                onClick={stopTest}
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg flex items-center transition-colors text-sm font-medium"
              >
                <FaStop className="mr-2" />
                STOP
              </button>
            )}
          </div>

          {/* Real-time Speed Display - Center Focus */}
          {testing && (
            <div className="mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold font-mono text-cyan-400 mb-2">
                  {currentSpeed.download > 0 ? currentSpeed.download.toFixed(1) : '0.0'}
                </div>
                <div className="text-lg text-gray-400 font-medium">Mbps Download</div>
                {currentSpeed.upload > 0 && (
                  <div className="mt-4">
                    <div className="text-4xl font-bold font-mono text-yellow-400">
                      {currentSpeed.upload.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-400 font-medium">Mbps Upload</div>
                  </div>
                )}
                {currentSpeed.ping > 0 && (
                  <div className="mt-4">
                    <div className="text-2xl font-bold font-mono text-green-400">
                      {currentSpeed.ping.toFixed(0)}ms
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Ping</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compact Gauges Row */}
          {!testing && (
            <div className="grid grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <FaWifi className="text-2xl text-cyan-400 mb-3" />
                <div className="text-sm text-gray-400 mb-2 font-medium">PING</div>
                <Gauge value={currentSpeed.ping} maxValue={100} unit="ms" type="ping" />
              </div>
              <div className="flex flex-col items-center">
                <FaDownload className="text-2xl text-green-400 mb-3" />
                <div className="text-sm text-gray-400 mb-2 font-medium">DOWNLOAD</div>
                <Gauge value={currentSpeed.download} maxValue={1000} unit="Mbps" type="download" />
              </div>
              <div className="flex flex-col items-center">
                <FaUpload className="text-2xl text-yellow-400 mb-3" />
                <div className="text-sm text-gray-400 mb-2 font-medium">UPLOAD</div>
                <Gauge value={currentSpeed.upload} maxValue={1000} unit="Mbps" type="upload" />
              </div>
            </div>
          )}

        </div>

        {/* Bottom Information Bar */}
        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-sm">
          
          {/* Client Info */}
          {clientInfo && (
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="font-mono">{clientInfo.ip}</span>
              <span>{clientInfo.isp}</span>
            </div>
          )}

          {/* Results Summary */}
          {results && !testing && (
            <div className="flex items-center space-x-6 text-gray-300 font-mono">
              <span className="text-cyan-400">{results.ping}ms</span>
              <span className="text-green-400">{results.download} Mbps ↓</span>
              <span className="text-yellow-400">{results.upload} Mbps ↑</span>
            </div>
          )}

        </div>

      </div>

      {/* Stability Report for Continuous Tests */}
      {results && !testing && results.test_type === 'continuous' && (
        <StabilityReport results={results} stabilityData={stabilityData} />
      )}

      {/* Live Speed Display Overlay */}
      <LiveSpeedDisplay 
        currentSpeed={currentSpeed}
        testing={testing}
        testProgress={testProgress}
        liveDownloadData={liveDownloadData}
        liveUploadData={liveUploadData}
        livePingData={livePingData}
      />
    </div>
  );
};

export default SpeedTest;
