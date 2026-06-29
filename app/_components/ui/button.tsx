import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-control px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 disabled:pointer-events-none";
    const variants = {
      primary: "bg-accent text-white hover:bg-accent/90",
      ghost: "border border-border text-ink hover:bg-paper",
    };
    return <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />;
  }
);
Button.displayName = "Button";
