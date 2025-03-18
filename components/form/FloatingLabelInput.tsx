import React, { useState } from 'react';

interface FloatingLabelInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  helpText,
  error,
  disabled = false,
  placeholder = '',
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(name, e.target.value);
  };
  
  // Determine if the label should be floating
  const isFloating = isFocused || value !== '';

  // Generate base classes for the container
  const containerClasses = `
    relative border rounded-lg transition-all duration-200
    ${isFloating ? 'border-primary' : 'border-zinc-700'}
    ${error ? 'border-red-500' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;
  
  // Generate label classes
  const labelClasses = `
    absolute transition-all duration-200 pointer-events-none
    ${isFloating 
      ? 'text-xs top-2 left-3 text-primary' 
      : 'text-sm top-1/2 left-4 transform -translate-y-1/2 text-gray-400'}
    ${error ? 'text-red-500' : ''}
    ${disabled ? 'text-gray-500' : ''}
  `;

  return (
    <div className="mb-1">
      <div className={containerClasses}>
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-3 pt-6 pb-2 bg-transparent text-white focus:outline-none resize-none min-h-[120px]"
            placeholder={isFloating ? placeholder : ''}
            disabled={disabled}
            required={required}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-3 pt-6 pb-2 bg-transparent text-white focus:outline-none"
            placeholder={isFloating ? placeholder : ''}
            disabled={disabled}
            required={required}
          />
        )}
        <label htmlFor={name} className={labelClasses}>
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500 pl-1">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
