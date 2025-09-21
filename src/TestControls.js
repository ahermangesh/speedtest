import React from 'react';
import { FaClock, FaChartLine, FaPlay } from 'react-icons/fa';

const TestControls = ({ 
  testType, 
  setTestType, 
  duration, 
  setDuration, 
  testing, 
  continuousTestActive 
}) => {
  const durationOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Test Type Selection */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-lg p-2 flex">
          <button
            onClick={() => setTestType('single')}
            disabled={testing}
            className={`px-6 py-3 rounded-lg flex items-center transition-all ${
              testType === 'single'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            } ${testing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaPlay className="mr-2" />
            Quick Test
          </button>
          <button
            onClick={() => setTestType('continuous')}
            disabled={testing}
            className={`px-6 py-3 rounded-lg flex items-center transition-all ${
              testType === 'continuous'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            } ${testing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaChartLine className="mr-2" />
            Stability Test
          </button>
        </div>
      </div>

      {/* Duration Selection for Continuous Tests */}
      {testType === 'continuous' && (
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <FaClock className="text-cyan-400 mr-2" />
              <span className="text-white font-semibold">Test Duration</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDuration(option.value)}
                  disabled={testing}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    duration === option.value
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } ${testing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Information */}
      <div className="text-center mb-8">
        {testType === 'single' ? (
          <div className="bg-gray-800 rounded-lg p-4 inline-block">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Speed Test</h3>
            <p className="text-gray-400 text-sm">
              Measures your current download speed, upload speed, and ping in under a minute.
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 inline-block">
            <h3 className="text-lg font-semibold text-white mb-2">
              Connection Stability Test ({duration} {duration === 1 ? 'minute' : 'minutes'})
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Runs multiple speed tests over {duration} minutes to analyze connection stability and reliability.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-500">
              <span>• Measures connection consistency</span>
              <span>• Detects speed fluctuations</span>
              <span>• Identifies connection drops</span>
            </div>
          </div>
        )}
      </div>

      {/* Active Test Status */}
      {continuousTestActive && (
        <div className="text-center mb-6">
          <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 inline-block">
            <div className="flex items-center justify-center">
              <div className="animate-pulse w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-yellow-200 font-semibold">
                Stability test in progress - This may take up to {duration} minutes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestControls;