import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from "./components/app/app";
import './options.css';

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);
// root.render(<StrictMode><App /></StrictMode>);
root.render(<App />);
