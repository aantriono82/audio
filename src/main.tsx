import { createRoot } from 'react-dom/client';
import { isTauri } from '@tauri-apps/api/core';
import '@fontsource/barlow-condensed/latin-500.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import './style.css';
import { App } from './react/App';

const root = document.getElementById('root');
if (!root) throw new Error('Elemen root React tidak ditemukan.');
createRoot(root).render(<App />);

if (import.meta.env.PROD && !isTauri() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js').catch(console.error); });
}
