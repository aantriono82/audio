import { createRoot } from 'react-dom/client';
import './style.css';
import { App } from './react/App';

const root = document.getElementById('root');
if (!root) throw new Error('Elemen root React tidak ditemukan.');
createRoot(root).render(<App />);
