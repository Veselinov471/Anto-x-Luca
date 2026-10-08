"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const MARKS = [25, 50, 75, 100] as const;

export function ScrollDepthTracker() {
  useEffect(() => {
    const seen = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const mark of MARKS) {
        if (pct >= mark && !seen.has(mark)) {
          seen.add(mark);
          trackEvent("scroll_depth", { percent: mark });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
