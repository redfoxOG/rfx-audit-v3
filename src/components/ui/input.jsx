
import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-neon-red/30 bg-dark-gray/50 px-3 py-2 text-sm text-gray-200 ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-200 ease-in-out focus:border-crimson focus:shadow-lg focus:shadow-crimson/20 font-fira-code',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
