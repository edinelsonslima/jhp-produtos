import { useEffect, useState } from "react";

// sm	40rem (640px)	@media (width >= 40rem) { ... }
// md	48rem (768px)	@media (width >= 48rem) { ... }
// lg	64rem (1024px)	@media (width >= 64rem) { ... }
// xl	80rem (1280px)	@media (width >= 80rem) { ... }
// 2xl	96rem (1536px)	@media (width >= 96rem) { ... }

type Breakpoints = "sm" | "md" | "lg" | "xl" | "2xl";

const queries = {
  sm: "(min-width: 40rem)",
  md: "(min-width: 48rem)",
  lg: "(min-width: 64rem)",
  xl: "(min-width: 80rem)",
  "2xl": "(min-width: 96rem)",
} as const;

export function useMatchMedia(breakpoint: Breakpoints) {
  const [matches, setMatches] = useState(() => {
    return window.matchMedia(queries[breakpoint]).matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(queries[breakpoint]);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [breakpoint]);

  return matches;
}
