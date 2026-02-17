import { useState, useEffect, useRef } from 'react';
import { Camera, Home, AlertCircle, CheckCircle } from 'lucide-react';

export default function Scanner() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');

  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const loadScripts = async () => {
      if (!document.querySelector('script[src*="tensorflow"]')) {
        const tfScript = document.createElement('script');
        tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';
        document.body.appendChild(tfScript);

        await new Promise(resolve => {
          tfScript.onload = resolve;
        });
      }

      if (!document.querySelector('script[src*="teachablemachine"]')) {
        const tmScript = document.createElement('script');
        tmScript.src = 'https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js';
        document.body.appendChild(tmScript);

        await new Promise(resolve => {
          tmScript.onload = resolve;
        });
      }
    };

    loadScripts();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
    };
  }, []);

  const handleBackToHome = () => {
    window.location.hash = '';
  };

  const startCamera = async () => {
    try {
      setError('');
      const URL = "https://teachablemachine.withgoogle.com/models/DPVgfcKq5/"

      const modelURL = URL + 'model.json';
      const metadataURL = URL + 'metadata.json';

      modelRef.current = await window.Image.load(modelURL, metadataURL);
      const maxPredictions = modelRef.current.getTotalClasses();

      const flip = true;
      webcamRef.current = new window.Image.Webcam(400, 400, flip);
      await webcamRef.current.setup();
      await webcamRef.current.play();

      setIsModelLoaded(true);
      setIsWebcamActive(true);

      setPredictions(Array(maxPredictions).fill({ className: '', probability: 0 }));

      loop();
    } catch (err) {
      setError('Failed to load model or start camera. Please ensure the model files are in the /public/my_model/ directory.');
      console.error(err);
    }
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      await predict();
      animationRef.current = requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (modelRef.current && webcamRef.current) {
      const prediction = await modelRef.current.predict(webcamRef.current.canvas);
      setPredictions(prediction);
    }
  };

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (webcamRef.current) {
      webcamRef.current.stop();
    }
    setIsWebcamActive(false);
    setPredictions([]);
  };

  useEffect(() => {
    if (isWebcamActive && webcamRef.current) {
      const container = document.getElementById('webcam-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(webcamRef.current.canvas);
      }
    }
  }, [isWebcamActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-teal-300 hover:text-white transition-colors group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-16 h-16 text-teal-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            AutoMed Computer Vision Scanner
          </h1>
          <p className="text-xl text-teal-200 max-w-3xl mx-auto">
            Real-time medication identification using AI-powered image recognition
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Camera-Based Detection</h2>
            <p className="text-gray-600 mb-6">
              This tool uses Teachable Machine image model to classify medications in real-time using your webcam.
            </p>

            {!isWebcamActive ? (
              <button
                onClick={startCamera}
                className="group px-10 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
              >
                <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Start Camera Scan</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 mx-auto"
              >
                Stop Camera
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error Loading Model</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
              {!isWebcamActive ? (
                <div className="text-center text-gray-400">
                  <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Camera feed will appear here</p>
                </div>
              ) : (
                <div id="webcam-container" className="flex items-center justify-center"></div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-teal-600" />
                Predictions
              </h3>

              {predictions.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p>Start the camera to see predictions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((pred, index) => {
                    const percentage = (pred.probability * 100).toFixed(1);
                    const isHighConfidence = pred.probability > 0.7;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isHighConfidence
                            ? 'bg-teal-50 border-teal-500'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold text-lg ${
                            isHighConfidence ? 'text-teal-900' : 'text-gray-700'
                          }`}>
                            {pred.className}
                          </span>
                          <span className={`text-2xl font-bold ${
                            isHighConfidence ? 'text-teal-600' : 'text-gray-500'
                          }`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isHighConfidence
                                ? 'bg-gradient-to-r from-teal-500 to-blue-500'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-teal-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-3 text-white font-bold text-lg">
                1
              </div>
              <h4 className="font-bold mb-2">Load Model</h4>
              <p className="text-sm">AI model trained on Teachable Machine loads automatically</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 text-white font-bold text-lg">
                2
              </div>
              <h4 className="font-bold mb-2">Capture Image</h4>
              <p className="text-sm">Webcam captures real-time video feed for analysis</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3 text-white font-bold text-lg">
                3
              </div>
              <h4 className="font-bold mb-2">Get Results</h4>
              <p className="text-sm">Model predicts classifications with confidence scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}