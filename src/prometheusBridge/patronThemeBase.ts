import type { LinkProps } from '@mui/material';
import { createTheme, type Theme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { endUser } from '@oclc/design-system-components';
import tokenData from '@oclc/design-system-components/design-tokens/base-tokens.json';

/** Matches `cdm-client/style/patronThemeBase.ts` (prometheusapi). */
export type StyleOverridesPropsType<ComponentProps> = ComponentProps &
  Record<string, unknown> & {
    ownerState: ComponentProps & Record<string, unknown>;
  } & { theme: Theme };

export const patronThemeBase = createTheme(
  deepmerge(endUser, {
    components: {
      MuiLink: {
        styleOverrides: {
          root: (props: StyleOverridesPropsType<LinkProps>) => {
            const parentRootStyleOverrides =
              endUser.components?.MuiLink?.styleOverrides?.root;
            const parentRootStyles =
              typeof parentRootStyleOverrides === 'function'
                ? parentRootStyleOverrides(props)
                : parentRootStyleOverrides;
            const parentRootStylesObject =
              typeof parentRootStyles === 'object' && parentRootStyles !== null
                ? parentRootStyles
                : {};
            return {
              ...parentRootStylesObject,
              '&:visited': {},
            };
          },
        },
      },
    },
    palette: {
      oclc: tokenData.tokens.palette,
    },
  }),
);
