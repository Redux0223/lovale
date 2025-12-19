import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out-cubic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-accent-primary text-accent-primary-foreground shadow-sm hover:bg-accent-primary-hover active:scale-[0.98]",
        secondary:
          "bg-background-muted text-foreground shadow-sm hover:bg-state-hover border border-border",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-state-hover",
        ghost: "text-foreground hover:bg-state-hover",
        destructive:
          "bg-accent-error text-foreground-inverse shadow-sm hover:bg-accent-error-hover",
        link: "text-accent-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, style, ...props }, ref) => {
    const inlineStyle = variant === "default" || variant === undefined
      ? { color: 'var(--accent-primary-foreground)', ...style }
      : style;
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={inlineStyle}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
