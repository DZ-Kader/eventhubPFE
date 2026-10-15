import React from "react";
import { cn } from "../lib/utils";

export const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-primary text-slate-950 hover:bg-primary-hover shadow-[0_0_15px_rgba(16,185,129,0.3)]": variant === "primary",
            "bg-slate-800 text-slate-100 hover:bg-slate-700": variant === "secondary",
            "border border-border bg-transparent hover:bg-slate-800 text-slate-300": variant === "outline",
            "hover:bg-slate-800 text-slate-300": variant === "ghost",
            "bg-rose-500 text-white hover:bg-rose-600": variant === "destructive",
            "h-9 px-3": size === "sm",
            "h-11 px-6": size === "md",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-[32px] border border-border bg-surface shadow-sm", className)} {...props} />
);

export const Input = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-slate-900/50 px-3 py-1 text-sm text-slate-100 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Select = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-slate-900/50 px-3 py-1 text-sm text-slate-100 shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export const Badge = ({ className, variant = "default", ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
        {
          "border-transparent bg-slate-800 text-slate-100": variant === "default",
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20": variant === "success",
          "bg-blue-500/10 text-blue-400 border-blue-500/20": variant === "warning",
          "bg-rose-500/10 text-rose-400 border-rose-500/20": variant === "destructive",
          "text-slate-300 border-border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
};

export const Label = React.forwardRef(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
