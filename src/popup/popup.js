import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components';
import './popup.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<StrictMode><App /></StrictMode>);
