import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-sans type-button transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-text-inverse shadow-sm hover:bg-primary-hover hover:shadow-md",
        secondary:
          "border border-border-strong bg-transparent text-primary hover:bg-primary-soft",
        outline:
          "border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-muted",
        ghost: "bg-transparent text-primary hover:bg-primary-soft/70",
        danger: "bg-error text-white hover:brightness-95",
        whatsapp:
          "bg-whatsapp text-text-inverse shadow-sm hover:bg-whatsapp-hover hover:shadow-md",
        subtle: "bg-primary-soft text-primary hover:bg-highlight",
        inverse: "bg-surface text-primary hover:bg-surface-muted",
      },
      size: {
        sm: "h-9 min-h-9 px-3 text-[11px]",
        md: "h-11 min-h-11 px-5",
        lg: "h-[52px] min-h-[52px] px-7 text-[13px]",
        icon: "h-11 w-11 min-h-11 min-w-11 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      children,
      iconLeft,
      iconRight,
      ...props
    },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size, fullWidth }), className);
    if (asChild) {
      return (
        <Slot ref={ref} className={classes} aria-disabled={disabled || loading} {...props}>
          {children}
        </Slot>
      );
    }
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <Spinner className="size-4" />
        ) : (
          <>
            {iconLeft ? <span aria-hidden="true">{iconLeft}</span> : null}
            <span>{children}</span>
            {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
          </>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
