import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// implementa: {etapa_2}, {funcion_existente_23}, {accesibilidad_1}, {accesibilidad_2}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
