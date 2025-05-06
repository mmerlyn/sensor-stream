import React from 'react';

const Header: React.FC = () => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-800 p-4 text-white shadow-lg">
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Sensor Monitoring Dashboard</h1>
      <p className="text-sm opacity-80">Real-time environmental data visualization</p>
    </div>
  </header>
);

export default Header;