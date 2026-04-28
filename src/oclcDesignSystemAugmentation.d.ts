import type * as React from 'react';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    alt: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    label: React.CSSProperties;
    labelSm: React.CSSProperties;
    labelLg: React.CSSProperties;
    chip: React.CSSProperties;
    iconSm: React.CSSProperties;
    icon: React.CSSProperties;
    iconLg: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
    labelSm?: React.CSSProperties;
    labelLg?: React.CSSProperties;
    chip?: React.CSSProperties;
    iconSm?: React.CSSProperties;
    icon?: React.CSSProperties;
    iconLg?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true;
    labelSm: true;
    labelLg: true;
    chip: true;
    iconSm: true;
    icon: true;
    iconLg: true;
  }
}
