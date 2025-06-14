import React, { useEffect } from "react";
import { useAccount } from 'wagmi';
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  const handleNavigation = () => {
    navigate('/dashboard');
  };
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Decentralized Identity Agent
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore the power of decentralized AI solutions in one place. Seamlessly integrate and access AI tools to revolutionize your workflow.
        </p>
      </header>
      <div className="mt-8">
        <button onClick={handleNavigation} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
