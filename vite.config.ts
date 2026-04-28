import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** GitHub Project Pages live under /<repo-name>/; set at build time in CI (see .github/workflows). */
function pagesBase(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw) return '/';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

export default defineConfig({
  base: pagesBase(),
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
