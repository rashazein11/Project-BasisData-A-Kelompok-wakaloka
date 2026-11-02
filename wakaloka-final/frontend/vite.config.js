import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' agar hasil build bisa dipasang di subfolder (mis. GitHub Pages).
export default defineConfig({ base: './', plugins: [react()], server: { port: 5173 } });
