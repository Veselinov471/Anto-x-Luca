"use client";

import { trackEvent } from "@/lib/analytics";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  ctaId?: string;
  location?: string;
  disabled?: boolean;
};

export function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  ctaId,
  location,
  disabled,
}: Props) {
  const base =
    "inline-flex min-h-12 items-center justify-center px-5 text-[0.9rem] tracking-[0.04em] transition duration-300 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:opacity-50 sm:min-h-12 sm:px-6 sm:text-sm";
  const styles = {
    primary:
      "bg-[var(--ink)] text-[var(--bg-elevated)] hover:bg-[var(--accent)] active:bg-[var(--accent)]",
    secondary:
      "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg-elevated)] active:bg-[var(--ink)] active:text-[var(--bg-elevated)]",
    ghost: "text-[var(--bg-elevated)] underline-offset-4 hover:underline",
  }[variant];

  const handleClick = () => {
    if (ctaId) {
      trackEvent("cta_click", { cta_id: ctaId, location: location ?? "unknown" });
    }
    onClick?.();
  };

  if (href) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`} onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`${base} ${styles} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
