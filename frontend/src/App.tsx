import React from "react";
import Header from "./components/Header";
import SensorComponent from "./components/SensorComponent";


const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto py-6 px-4">
                <SensorComponent />
            </main>
        </div>);
};


export default App
