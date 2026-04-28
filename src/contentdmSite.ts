/** Arborstone University Digital Collections (ContentDM) — shared chrome links */
export const CONTENTDM_SITE_ORIGIN = 'https://140655.contentdm-h1.dev.oclc.org';

/** Horizontal wordmark (matches ContentDM header logo slot; replace file in `public/` as needed). */
export const OCLC_HEADER_LOGO_SRC = `${import.meta.env.BASE_URL}oclc-logo-horizontal.svg`;

export const CONTENTDM_SITE_TITLE =
  'DEV - Arborstone University Digital Collections';

export const CONTENTDM_NAV = [
  { label: 'Home', path: '/' },
  { label: 'Collections', path: '/collections' },
  { label: 'Items', path: '/items' },
  { label: 'Advanced search', path: '/search/advanced' },
] as const;

export function contentdmUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${CONTENTDM_SITE_ORIGIN}${p}`;
}
