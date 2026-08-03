import { useEffect, useState } from 'react';

/** Subscribe to a CSS media query from React (SSR-safe, listener cleaned up). */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

// Phone-sized viewport, in EITHER orientation. The height clause matters: a
// rotated phone is ~812×375, so a width-only test would call it a desktop and
// pull away the mobile affordances at the exact moment they help most.
export const useIsPhone = () => useMediaQuery('(max-width: 767px), (max-height: 600px)');

/** Portrait phones lose the most width, so we nudge people to rotate. */
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
