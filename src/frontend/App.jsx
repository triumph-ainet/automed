import { useState } from 'react';
import Scanner from './Scanner';
import { Home, Zap } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'scanner':
        return <Scanner />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      {renderPage()}
    </div>
  );
}

function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-12 h-12 text-yellow-300" />
            <h1 className="text-5xl font-bold text-white">AutoMed</h1>
          </div>
          <p className="text-xl text-blue-100">
            AI-Powered Counterfeit Drug Detection
          </p>
        </div>

        {/* Description */}
        <div className="max-w-md mb-12">
          <p className="text-blue-50 text-lg mb-6">
            Use our advanced scanning technology to verify the authenticity of medications instantly.
          </p>
          <div className="space-y-4 text-left bg-blue-800 bg-opacity-50 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-900 font-bold text-sm">✓</span>
              </div>
              <p className="text-blue-50">Real-time drug verification</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-900 font-bold text-sm">✓</span>
              </div>
              <p className="text-blue-50">AI-powered analysis</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-900 font-bold text-sm">✓</span>
              </div>
              <p className="text-blue-50">Instant results</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate('scanner')}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Start Scanning
        </button>

        {/* Footer */}
        <div className="mt-16 text-blue-200 text-sm">
          <p>Ensuring medication safety through advanced AI technology</p>
        </div>
      </div>
    </div>
  );
}
