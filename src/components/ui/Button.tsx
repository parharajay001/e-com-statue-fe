import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button-variants';

export interface ButtonProps
  extends Omit<MuiButtonProps, 'variant' | 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? 'span' : MuiButton;
    return (
      <Comp 
        className={buttonVariants({ variant, size, className })} 
        ref={ref} 
        {...props} 
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
