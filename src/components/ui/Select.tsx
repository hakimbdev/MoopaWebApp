import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            className={cn(
              "flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
        
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
        
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;