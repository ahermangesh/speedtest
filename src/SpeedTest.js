import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FaDownload, FaUpload, FaWifi } from 'react-icons/fa';
import Gauge from './Gauge';

const socket = io('http://localhost:5000');

const SpeedTest = () => {
  const [results, setResults] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    socket.on('test_result', (data) => {
      if (data.type === 'final') {
        setResults(data);
        setTesting(false);
      }
    });

    return () => {
      socket.off('test_result');
    };
  }, []);

  const startTest = () => {
    setResults(null);
    setTesting(true);
    socket.emit('start_test');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">SPEEDTEST</h1>
          <nav className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white">Results</a>
            <a href="#" className="hover:text-white">Settings</a>
          </nav>
        </header>

        <div className="flex flex-col items-center">
          <button
            onClick={startTest}
            disabled={testing}
            className="relative w-48 h-48 rounded-full border-4 border-cyan-400 flex items-center justify-center text-4xl font-bold text-white transition-all duration-300 hover:bg-cyan-400 hover:text-gray-900 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {testing ? '...' : 'GO'}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center w-full">
            <div className="flex flex-col items-center">
              <FaWifi className="text-3xl text-cyan-400 mb-2" />
              <span className="text-gray-400">Ping</span>
              <span className="text-4xl font-bold">{results ? `${results.ping} ms` : '-'}</span>
            </div>
            <div className="flex flex-col items-center">
              <FaDownload className="text-3xl text-cyan-400 mb-2" />
              <span className="text-gray-400">Download</span>
              <span className="text-4xl font-bold">{results ? `${results.download} Mbps` : '-'}</span>
            </div>
            <div className="flex flex-col items-center">
              <FaUpload className="text-3xl text-cyan-400 mb-2" />
              <span className="text-gray-400">Upload</span>
              <span className="text-4xl font-bold">{results ? `${results.upload} Mbps` : '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedTest;
