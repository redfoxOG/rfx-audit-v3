
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group font-fira-code',
	{
		variants: {
			variant: {
				default: 'bg-crimson text-white hover:bg-crimson/90 shadow-md shadow-crimson/20',
				destructive:
          'bg-red-800 text-red-100 hover:bg-red-800/90 border border-red-600 shadow-md shadow-red-800/30',
				outline:
          'border border-crimson/50 bg-transparent hover:bg-crimson/10 hover:text-crimson',
				secondary:
          'bg-gray-700 text-gray-200 hover:bg-gray-600',
				ghost: 'hover:bg-crimson/10 hover:text-crimson',
				link: 'text-crimson underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {props.children}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 2px, 0 2px)' }}></div>
    </Comp>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
