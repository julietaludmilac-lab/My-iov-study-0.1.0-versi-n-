import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// implementa: {etapa_1}, {funcion_30}
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
