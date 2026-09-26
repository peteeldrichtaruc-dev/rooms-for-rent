import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: ReactNode;
    error?: string;
    helperText?: string;
    indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            className = '',
            label,
            error,
            helperText,
            indeterminate = false,
            id,
            disabled,
            checked,
            onChange,
            ...props
        },
        ref
    ) => {
        const localRef = useRef<HTMLInputElement>(null);
        const inputRef = (ref as React.RefObject<HTMLInputElement>) || localRef;

        // Handle indeterminate state (e.g., select-all tables)
        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.indeterminate = indeterminate;
            }
        }, [indeterminate, inputRef]);

        const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                <div className="flex items-start">
                    {/* Checkbox Input Container */}
                    <div className="flex items-center h-5">
                        <input
                            {...props}
                            ref={inputRef}
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onChange={onChange}
                            disabled={disabled}
                            className={`
                                h-4 w-4 rounded text-blue-600 bg-white
                                border-slate-300 transition duration-150 ease-in-out
                                focus:ring-2 focus:ring-blue-600/20 focus:ring-offset-0 focus:outline-none
                                disabled:bg-slate-100 disabled:border-slate-200 disabled:cursor-not-allowed
                                ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
                                ${className}
                            `}
                        />
                    </div>

                    {/* Label and Helper Text */}
                    {(label || helperText) && (
                        <div className="ml-3 text-sm">
                            {label && (
                                <label
                                    htmlFor={inputId}
                                    className={`
                                        font-medium select-none cursor-pointer
                                        ${disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:text-slate-900'}
                                    `}
                                >
                                    {label}
                                </label>
                            )}

                            {helperText && (
                                <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1" data-aos="fade-in">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;