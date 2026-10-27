import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold transition-colors";

export const buttonStyles: Record<Variant, string> = {
  primary: `${base} bg-jade text-white hover:bg-jade-dark`,
  secondary: `${base} border border-ink/20 bg-surface text-ink hover:border-ink/40`,
};

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", ...props }: Props) {
  return <Link className={`${buttonStyles[variant]} ${className}`} {...props} />;
}
