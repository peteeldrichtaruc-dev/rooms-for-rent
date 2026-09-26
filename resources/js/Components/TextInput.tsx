import { forwardRef, InputHTMLAttributes, useState, ReactNode } from 'react';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    isFocused?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            type = 'text',
            className = '',
            isFocused = false,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            id,
            disabled,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPasswordType = type === 'password';
        const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative rounded-xl shadow-sm">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            {leftIcon}
                        </div>
                    )}

                    {/* Main Input Field */}
                    <input
                        {...props}
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        disabled={disabled}
                        className={`
                            block w-full rounded-xl text-sm text-slate-900 bg-white
                            placeholder:text-slate-400
                            transition duration-150 ease-in-out
                            ${leftIcon ? 'pl-10' : 'pl-4'}
                            ${rightIcon || isPasswordType ? 'pr-10' : 'pr-4'}
                            py-2.5
                            ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
                            }
                            focus:outline-none focus:ring-4
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed
                            ${className}
                        `}
                    />

                    {/* Password Toggle Button */}
                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 012.122-.163c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.5 1.5l-9-9" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Custom Right Icon */}
                    {!isPasswordType && rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {/* Helper Text or Error Message */}
                {error ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1" data-aos="fade-in">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;