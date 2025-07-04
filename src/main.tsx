import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove loading screen once React app loads
const removeLoadingScreen = () => {
  const loadingContainer = document.querySelector('.loading-container');
  if (loadingContainer) {
    loadingContainer.remove();
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Remove loading screen after a short delay to ensure app is rendered
  setTimeout(removeLoadingScreen, 100);
} else {
  console.error('Root element not found');
}