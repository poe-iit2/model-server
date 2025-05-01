import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_DEVICE = gql`
  query GetDevice($id: Int!) {
    model {
      getDevice(id: $id) {
        danger
        occupied
        temperature
        humidity
        airQuality
        ledState
        evacState
      }
    }
  }
`;

function DeviceMonitor({ deviceId }) {
  const { loading, error, data } = useQuery(GET_DEVICE, {
    variables: { id: deviceId },
    pollInterval: 1000, // Poll every second for updates
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const device = data.model.getDevice;
  if (!device) return <p>Device {deviceId} not found</p>;

  return (
    <div className="device-monitor">
      <h2>Device {deviceId}</h2>
      <div className={`status ${device.danger ? 'danger' : 'normal'}`}>
        {device.danger ? '⚠️ DANGER' : '✓ Normal'}
      </div>
      
      <div className="metrics">
        <div className="metric">
          <label>Occupied:</label>
          <span>{device.occupied === null ? 'Unknown' : device.occupied ? 'Yes' : 'No'}</span>
        </div>
        
        <div className="metric">
          <label>Temperature:</label>
          <span>{device.temperature !== null ? `${device.temperature}°` : 'N/A'}</span>
        </div>
        
        <div className="metric">
          <label>Humidity:</label>
          <span>{device.humidity !== null ? `${device.humidity}%` : 'N/A'}</span>
        </div>
        
        <div className="metric">
          <label>Air Quality:</label>
          <span>{device.airQuality !== null ? device.airQuality : 'N/A'}</span>
        </div>
      </div>
      
      <div className="states">
        <div className="state">
          <label>LED State:</label>
          <span className={`led-state ${device.ledState}`}>{device.ledState}</span>
        </div>
        
        <div className="state">
          <label>Evacuation State:</label>
          <span className={`evac-state ${device.evacState}`}>{device.evacState}</span>
        </div>
      </div>
    </div>
  );
}

export default DeviceMonitor;