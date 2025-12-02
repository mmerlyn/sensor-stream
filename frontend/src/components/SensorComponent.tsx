
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from './LoadingSpinner';

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: number;
}

interface ChartData extends SensorData {
  formattedTime: string;
}

const initialData: SensorData[] = [];


const SensorComponent: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://localhost:8000/latest');
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const newDataPoint: SensorData = await response.json();
      
      setData(currentData => {
        const formattedDataPoint = {
          ...newDataPoint,
          formattedTime: formatTimestamp(newDataPoint.timestamp)
        };
        
        const newData = [...currentData, formattedDataPoint];
        
        if (newData.length > 10) {
          return newData.slice(newData.length - 10);
        }
        return newData;
      });
      
      setError(null);
      setLoading(false);
    } catch (err) {
      if (loading && data.length === 0) {
        console.warn('API fetch failed, using sample data:', err);
        const formattedData = initialData.map(item => ({
          ...item,
          formattedTime: formatTimestamp(item.timestamp)
        }));
        setData(formattedData);
        setLoading(false);
      }
      
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
      console.error('API fetch error:', err);
    }
  };
  
  useEffect(() => {
    fetchSensorData();
    
    const interval = setInterval(fetchSensorData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const ErrorNotification = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Error notification */}
      <ErrorNotification />
      
      {/* Current readings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Readings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                {loading && data.length === 0 ? (
                  <div className="w-20 h-8 flex items-center">
                    <div className="animate-pulse bg-blue-200 h-6 w-16 rounded"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">
                    {data.length > 0 ? data[data.length - 1].temperature.toFixed(1) : "-"}°C
                  </p>
                )}
              </div>
              <div className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                {loading && data.length === 0 ? (
                  <div className="w-20 h-8 flex items-center">
                    <div className="animate-pulse bg-green-200 h-6 w-16 rounded"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    {data.length > 0 ? data[data.length - 1].humidity.toFixed(1) : "-"}%
                  </p>
                )}
              </div>
              <div className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Temperature chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Temperature Trends</h2>
        <div className="bg-white p-4 rounded-lg shadow h-64">
          {loading && data.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedTime" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {/* Humidity chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Humidity Trends</h2>
        <div className="bg-white p-4 rounded-lg shadow h-64">
          {loading && data.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedTime" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#10b981" 
                  activeDot={{ r: 8 }} 
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {/* Combined chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Combined Sensor Data</h2>
        <div className="bg-white p-4 rounded-lg shadow h-64">
          {loading && data.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedTime" />
                <YAxis yAxisId="left" domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 6 }} 
                  name="Temperature (°C)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#10b981" 
                  activeDot={{ r: 6 }} 
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorComponent;