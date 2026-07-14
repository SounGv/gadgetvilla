import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'green' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-fg hover:shadow-md',
  accent: 'bg-accent text-accent-fg hover:shadow-md',
  green: 'bg-accent2 text-accent2-fg hover:shadow-md',
  ghost: 'bg-transparent border border-border text-fg hover:bg-bg-subtle',
  destructive: 'bg-error text-white hover:shadow-md',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-13 px-8 text-base',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-base ease-out-expo',
          'hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
