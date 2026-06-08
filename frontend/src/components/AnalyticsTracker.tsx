"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // Fire page view event to API on every path change
      trackEvent('PAGE_VIEW', pathname);
    }
  }, [pathname]);

  return null;
}
