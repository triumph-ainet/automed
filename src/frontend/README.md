# AutoMed Frontend

A React-based frontend for the AI-powered counterfeit drug detection scanner.

## Features

- **Home Page**: Welcome screen with feature highlights
- **Scanner Component**: Real-time camera scanning using TensorFlow.js and Teachable Machine
- **Live Predictions**: AI-powered drug verification with real-time results
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **React 19+**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful SVG icons
- **TensorFlow.js**: ML framework for browser
- **Teachable Machine**: Pre-trained image classification models

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Project Structure

```
/src/frontend
├── App.jsx              # Main application component
├── Scanner.jsx          # Scanner component with camera and ML predictions
├── main.jsx            # React entry point
├── index.html          # HTML template
├── index.css           # Global styles
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Usage

1. **Launch the app** - Start the dev server with `npm run dev`
2. **Home Page** - See the welcome screen with features
3. **Start Scanning** - Click the button to access the scanner
4. **Grant Permissions** - Allow camera access when prompted
5. **View Results** - Real-time AI predictions appear as you point the camera

## API & External Services

- **Teachable Machine Model**: Currently configured to use a pre-trained model from Google's Teachable Machine service
- **Model URL**: https://teachablemachine.withgoogle.com/models/DPVgfcKq5/

## Configuration

To use a custom model:

1. Train a model on [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Update the `URL` variable in `Scanner.jsx` to point to your model
3. Ensure the model includes necessary classes for drug verification

## Troubleshooting

### Camera access denied
- Check browser permissions for camera access
- Ensure the app is accessed over HTTPS (required for camera access in production)

### Model fails to load
- Verify the model URL is correct and accessible
- Check browser console for network errors
- Ensure CORS is properly configured

### Predictions not updating
- Check that TensorFlow.js and Teachable Machine scripts loaded successfully
- Verify webcam is functioning properly
- Check browser console for JavaScript errors
