import type { Theme, ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { patronThemeBase } from './patronThemeBase';

/** Body CSS variables consumed by patron-style footer links (see `cdm-client` Footer). */
const footerCssVars = {
  '--footer-bg': '#0060a5',
  '--footer-text': '#ffffff',
  '--link-color': '#0060a5',
} as const;

/**
 * Patron theme from prometheusapi `cdm-client` (`endUser` + tokens), plus footer variables.
 */
export function createTimelinePatronTheme(): Theme {
  const opts: ThemeOptions = {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            ...footerCssVars,
          },
        },
      },
    },
  };

  return createTheme(deepmerge(patronThemeBase, opts));
}

export const timelinePatronTheme = createTimelinePatronTheme();
