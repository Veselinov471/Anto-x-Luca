import type { ReactNode } from "react";

/** Root shell — locale-specific html/body live in `[locale]/layout`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
