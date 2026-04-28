/**
 * Single Highcharts entry: core + modules must share one module graph.
 * `import from 'highcharts'` points at highcharts/highcharts.js, while
 * highcharts/esm/modules/*.js pulls in highcharts/esm/highcharts.js — two copies,
 * which causes error #17 (timeline series not registered on the instance in use).
 */
import Highcharts from 'highcharts/esm/highcharts.js';
import 'highcharts/esm/modules/timeline.js';
import 'highcharts/esm/modules/exporting.js';
import 'highcharts/esm/modules/accessibility.js';

export default Highcharts;
