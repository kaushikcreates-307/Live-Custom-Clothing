import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
<<<<<<< HEAD
    base: '/', // <--- ADD THIS LINE HERE
=======
>>>>>>> c56add1cd46c89e44a548550a2f02da0e592249f
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
<<<<<<< HEAD
      hmr: process.env.DISABLE_HMR !== 'true',
=======
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
>>>>>>> c56add1cd46c89e44a548550a2f02da0e592249f
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
