import { useEffect, useState } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

function breakpointToValue(breakpoint: Breakpoint): string {
  const breakpoints: Record<Breakpoint, string> = {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
    xxl: '96rem',
  };
  return breakpoints[breakpoint];
}

function getBreakpointValue(breakpoint: Breakpoint): string {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const breakpoints = {
    sm: styles.getPropertyValue('--breakpoint-sm'),
    md: styles.getPropertyValue('--breakpoint-md'),
    lg: styles.getPropertyValue('--breakpoint-lg'),
    xl: styles.getPropertyValue('--breakpoint-xl'),
    xxl: styles.getPropertyValue('--breakpoint-2xl'),
  } as Record<Breakpoint, string>;
  return breakpoints[breakpoint] || breakpointToValue(breakpoint);
}

export const useMediaMinWidth = (breakpoint: Breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const breakpointValue = getBreakpointValue(breakpoint);
    const mediaQueryList = window.matchMedia(`(min-width: ${breakpointValue})`);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set the initial state
    setMatches(mediaQueryList.matches);

    // Add the listener
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup function to remove the listener
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
};
