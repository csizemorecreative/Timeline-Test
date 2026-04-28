import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  optimizeDeps: {
    /** Keep ESM core + modules in one prebundle so timeline registers on the same Highcharts. */
    include: [
      'highcharts/esm/highcharts.js',
      'highcharts/esm/modules/timeline.js',
      'highcharts/esm/modules/exporting.js',
      'highcharts/esm/modules/accessibility.js',
      'highcharts-react-official',
    ],
  },
});
