"use client";

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "starwind-transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      default: "bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-outline",
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:outline-secondary",
      outline:
        "border-border hover:bg-border hover:text-foreground focus-visible:outline-outline border",
      ghost:
        "hover:bg-foreground/10 hover:text-foreground focus-visible:outline-outline bg-transparent",
      info: "bg-info text-info-foreground hover:bg-info/90 focus-visible:outline-info",
      success:
        "bg-success text-success-foreground hover:bg-success/90 focus-visible:outline-success",
      warning:
        "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:outline-warning",
      error: "bg-error text-error-foreground hover:bg-error/90 focus-visible:outline-error",
    },
    size: {
      sm: "h-9 px-3 py-2 text-sm",
      md: "h-11 px-4 py-2 text-base",
      lg: "h-12 px-8 py-2 text-lg",
      icon: "h-11 w-11",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export type ButtonProps = VariantProps<typeof button> & {
  className?: string;
  href?: string;
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
);

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant, size, className, href, ...props }, ref) => {
    if (href) {
      return (
        <a
          className={button({ variant, size, class: className })}
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }
    
    return (
      <button
        className={button({ variant, size, class: className })}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
