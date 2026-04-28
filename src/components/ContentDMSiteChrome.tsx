import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { PrometheusSkipLinks } from './PrometheusSkipLinks';
import { OCLC_HEADER_LOGO_SRC, contentdmUrl, CONTENTDM_NAV, CONTENTDM_SITE_ORIGIN } from '../contentdmSite';

const appBarHeight = '5.625rem';
const appBarHorizontalPadding = '1.25rem';
const searchStyles = { maxWidth: '19.25rem', minWidth: '15rem' };

/**
 * Patron shell aligned with `cdm-client/app/[locale]/(patron)/layout.tsx` and
 * `components/patron/header/AppBar.tsx` / `Footer.tsx` from prometheusapi.
 */
export function ContentDMSiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <PrometheusSkipLinks />

      <AppBar
        color="inherit"
        elevation={0}
        position="static"
        sx={{ justifyContent: 'center', minHeight: appBarHeight }}
        variant="alt"
      >
        <Toolbar disableGutters sx={{ flexWrap: 'wrap', px: appBarHorizontalPadding }}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: appBarHeight,
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', flexBasis: 0, flexGrow: 1 }}>
              <Box
                sx={{
                  flexGrow: 0,
                  display: { xs: 'flex', lg: 'none' },
                  alignItems: 'center',
                  gap: 2.5,
                  mr: 1,
                }}
              >
                <Tooltip title="Navigation">
                  <IconButton
                    aria-label="Menu"
                    color="inherit"
                    edge="start"
                    onClick={() => setMenuOpen(true)}
                    size="large"
                  >
                    <MenuIcon sx={{ fontSize: '1.5rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Link aria-label="Home" href={CONTENTDM_SITE_ORIGIN} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  alt=""
                  src={OCLC_HEADER_LOGO_SRC}
                  sx={{ width: 150, height: 'auto', maxHeight: 40, objectFit: 'contain', display: 'block' }}
                  loading="lazy"
                />
              </Link>
            </Box>
            <Box
              id="search"
              tabIndex={-1}
              sx={{
                display: { xs: 'none', md: 'block' },
                flexGrow: 1,
                maxWidth: searchStyles.maxWidth,
              }}
            >
              <Box
                component="form"
                action={contentdmUrl('/search')}
                method="get"
                role="search"
                title="Search all collections"
                sx={{ alignItems: 'center', display: 'flex', width: '100%', ...searchStyles }}
              >
                <TextField
                  aria-label="Search all collections"
                  name="q"
                  placeholder="Search all collections"
                  size="medium"
                  sx={{ width: '100%' }}
                  type="search"
                  slotProps={{
                    input: {
                      endAdornment: <SearchIcon sx={{ color: 'action.active' }} aria-hidden />,
                    },
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexBasis: 0,
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
            />
          </Stack>

          <Stack
            direction="row"
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'center',
              pb: 4,
              width: '100%',
            }}
          >
            <Box
              component="form"
              action={contentdmUrl('/search')}
              method="get"
              role="search"
              title="Search all collections"
              sx={{ alignItems: 'center', display: 'flex', width: '100%', ...searchStyles }}
            >
              <TextField
                aria-label="Search all collections"
                name="q"
                placeholder="Search all collections"
                size="medium"
                sx={{ width: '100%' }}
                type="search"
                slotProps={{
                  input: {
                    endAdornment: <SearchIcon sx={{ color: 'action.active' }} aria-hidden />,
                  },
                }}
              />
            </Box>
          </Stack>
        </Toolbar>

        <Toolbar
          className="OclcToolbar-colorWhite"
          disableGutters
          sx={{
            display: { xs: 'none', lg: 'flex' },
            px: appBarHorizontalPadding,
            py: 1,
          }}
        >
          <Box component="nav">
            <Stack
              component="ul"
              direction="row"
              spacing={2}
              useFlexGap
              sx={{
                alignItems: 'center',
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                paddingInlineStart: 0,
              }}
            >
              {CONTENTDM_NAV.map((item) => (
                <Box component="li" key={item.path}>
                  <Link
                    className="OclcNavLink"
                    color="inherit"
                    href={contentdmUrl(item.path)}
                    sx={{
                      py: 0.5,
                      '&.OclcNavLink': {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'oclc.grey.grey200',
                        },
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                </Box>
              ))}
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        className="OclcDrawer-nav OclcDrawer-colorWhite"
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
      >
        <Box role="presentation" sx={{ width: '100%' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'flex-end', px: 2, py: 2 }}
          >
            <Tooltip title="Close navigation" arrow>
              <IconButton aria-label="Close" onClick={() => setMenuOpen(false)} size="large">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <nav>
            <Stack component="ul" spacing={2} sx={{ listStyleType: 'none', p: 3, m: 0 }}>
              {CONTENTDM_NAV.map((item) => (
                <Box component="li" key={item.path}>
                  <Link
                    className="OclcNavLink"
                    color="inherit"
                    href={contentdmUrl(item.path)}
                    onClick={() => setMenuOpen(false)}
                    sx={{
                      '&.OclcNavLink': {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'oclc.grey.grey200',
                        },
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                </Box>
              ))}
            </Stack>
          </nav>
        </Box>
      </Drawer>

      <Container
        component="main"
        id="main"
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          bgcolor: 'background.paper',
          outline: 'none',
        }}
        tabIndex={-1}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>{children}</Box>
      </Container>

      <Box
        component="footer"
        id="footer"
        sx={(theme) => ({
          backgroundColor: 'var(--footer-bg)',
          color: 'var(--footer-text)',
          outline: 'none',
          px: 5,
          pt: 5,
          width: '100%',
          [theme.breakpoints.up('md')]: {
            px: 11,
            pt: 11,
          },
        })}
        tabIndex={-1}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography component="p" id="footer-links-title-digital" variant="labelSm">
              Digital collections
            </Typography>
            <List aria-labelledby="footer-links-title-digital">
              {CONTENTDM_NAV.map((item) => (
                <ListItem key={item.path}>
                  <Link
                    href={contentdmUrl(item.path)}
                    underline="always"
                    variant="body2"
                    sx={{
                      color: 'var(--footer-text)',
                      lineHeight: 2,
                      textDecorationColor: 'currentcolor',
                      '&:hover': {
                        color: 'var(--footer-text)',
                        textDecorationColor: 'currentcolor',
                        textDecorationThickness: '2px',
                      },
                    }}
                  >
                    {item.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography component="p" sx={{ lineHeight: 2 }} variant="body2">
            CONTENTdm software © {new Date().getFullYear()} OCLC Inc.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
