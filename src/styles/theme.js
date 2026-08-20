// src/styles/theme.js
const theme = {
    colors: {
      primary: '#0070f3',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      white: '#ffffff',
      background: '#f5f8fa',
    },
    font: {
      family: {
        body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
      size: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      weight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    breakpoints: {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    },
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    transitions: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    mediaQuery: {
      below: {
        sm: `@media (max-width: ${parseInt('576px') - 0.02}px)`,
        md: `@media (max-width: ${parseInt('768px') - 0.02}px)`,
        lg: `@media (max-width: ${parseInt('992px') - 0.02}px)`,
        xl: `@media (max-width: ${parseInt('1200px') - 0.02}px)`,
        xxl: `@media (max-width: ${parseInt('1400px') - 0.02}px)`,
      },
      above: {
        sm: `@media (min-width: 576px)`,
        md: `@media (min-width: 768px)`,
        lg: `@media (min-width: 992px)`,
        xl: `@media (min-width: 1200px)`,
        xxl: `@media (min-width: 1400px)`,
      },
    },
  };
  
  export default theme;
  