import { cn } from "@/lib/utils";

export function A11yHint({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <p className={cn("a11y-hint", className)}>{children}</p>;
}
