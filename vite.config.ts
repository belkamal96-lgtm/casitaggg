import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.X_API_KEY': JSON.stringify(process.env.X_API_KEY || process.env.VITE_X_API_KEY || ''),
      'process.env.TWITTER_API_KEY': JSON.stringify(process.env.TWITTER_API_KEY || process.env.VITE_TWITTER_API_KEY || ''),
      'process.env.TWITTER_BEARER_TOKEN': JSON.stringify(process.env.TWITTER_BEARER_TOKEN || process.env.X_BEARER_TOKEN || process.env.VITE_TWITTER_BEARER_TOKEN || ''),
      'process.env.UNAVATAR_KEY': JSON.stringify(process.env.UNAVATAR_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
