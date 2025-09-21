import React, { useState, useEffect } from 'react';
import { FaServer, FaMapMarkerAlt, FaGlobe, FaCheck } from 'react-icons/fa';

const ServerSelector = ({ onServerSelect, selectedServerId, socket }) => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('servers_list', (data) => {
        setServers(data.servers || []);
        setLoading(false);
      });

      socket.on('servers_error', (data) => {
        console.error('Error fetching servers:', data.error);
        setLoading(false);
      });

      return () => {
        socket.off('servers_list');
        socket.off('servers_error');
      };
    }
  }, [socket]);

  const fetchServers = () => {
    setLoading(true);
    if (socket) {
      socket.emit('get_servers');
    }
  };

  const handleServerSelect = (server) => {
    onServerSelect(server);
    setShowModal(false);
  };

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedServer = servers.find(s => s.id === selectedServerId);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FaServer className="mr-2 text-cyan-400" />
          Test Server
        </h3>
        <button
          onClick={() => {
            setShowModal(true);
            if (servers.length === 0) {
              fetchServers();
            }
          }}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Change Server
        </button>
      </div>

      {/* Current Server Display */}
      <div className="bg-gray-800 rounded-lg p-4">
        {selectedServer ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{selectedServer.name}</p>
              <p className="text-gray-400 text-sm flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                {selectedServer.location}
              </p>
              <p className="text-gray-500 text-xs">
                Distance: {selectedServer.distance} km
              </p>
            </div>
            <div className="text-green-400">
              <FaCheck className="text-xl" />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <FaGlobe className="mx-auto text-2xl mb-2" />
            <p>Auto-select best server</p>
            <p className="text-xs">Server will be chosen automatically based on proximity and speed</p>
          </div>
        )}
      </div>

      {/* Server Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Select Test Server</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by provider, location, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Auto-select option */}
            <div className="mb-4">
              <button
                onClick={() => handleServerSelect(null)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  !selectedServerId 
                    ? 'border-cyan-400 bg-cyan-900' 
                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Auto-select Best Server</p>
                    <p className="text-gray-400 text-sm">Automatically choose the fastest server</p>
                  </div>
                  {!selectedServerId && <FaCheck className="text-cyan-400" />}
                </div>
              </button>
            </div>

            {/* Server List */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading servers...</p>
                </div>
              ) : filteredServers.length > 0 ? (
                <div className="space-y-2">
                  {filteredServers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => handleServerSelect(server)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedServerId === server.id
                          ? 'border-cyan-400 bg-cyan-900'
                          : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{server.name}</p>
                          <p className="text-gray-400 text-sm flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {server.location}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Distance: {server.distance} km
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{server.cc}</div>
                          {selectedServerId === server.id && (
                            <FaCheck className="text-cyan-400 mt-1" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm ? 'No servers found matching your search.' : 'No servers available.'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-xs text-gray-500 text-center">
                Servers are sorted by distance. Closer servers typically provide more accurate results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerSelector;