import Button from '@mui/material/Button';
import { useCallback } from 'react';

function SkipLinkButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const handleSkipTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = href.slice(href.indexOf('#') + 1);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo(0, element.offsetTop);
      element.focus();
    }
  }, [href]);

  return (
    <Button className="OclcSkipLink" href={href} onClick={handleSkipTo} size="large" variant="outlined">
      {children}
    </Button>
  );
}

/** Mirrors `cdm-client/components/patron/SkipLinks.tsx` (without filters skip). */
export function PrometheusSkipLinks() {
  return (
    <>
      <SkipLinkButton href="#search">Skip to search</SkipLinkButton>
      <SkipLinkButton href="#main">Skip to main</SkipLinkButton>
      <SkipLinkButton href="#footer">Skip to footer</SkipLinkButton>
    </>
  );
}
