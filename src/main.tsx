import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getAllMenuImageUrls } from './data/dishes';
import { preloadAllImages } from './utils/imagePreloader';

// Immediately preload and decode all menu images into memory
try {
  const imagesToPreload = getAllMenuImageUrls();
  preloadAllImages(imagesToPreload);
} catch (e) {
  console.warn('Initial image preloading triggered:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
