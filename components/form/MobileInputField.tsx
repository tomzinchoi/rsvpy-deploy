import React from 'react';

interface MobileInputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  options?: { value: string, label: string }[];
  disabled?: boolean;
}

const MobileInputField: React.FC<MobileInputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  helpText,
  error,
  placeholder = '',
  className = '',
  options = [],
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium mb-1.5 text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${
            error 
              ? 'bg-red-900/10 border-red-900/50 text-red-100' 
              : 'bg-zinc-800/50 border-zinc-700 text-white'
          } border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary`}
          disabled={disabled}
          required={required}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-3 ${
            error 
              ? 'bg-red-900/10 border-red-900/50 text-red-100' 
              : 'bg-zinc-800/50 border-zinc-700 text-white'
          } border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none`}
          disabled={disabled}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${
            error 
              ? 'bg-red-900/10 border-red-900/50 text-red-100' 
              : 'bg-zinc-800/50 border-zinc-700 text-white'
          } border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary`}
          disabled={disabled}
          required={required}
        />
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default MobileInputField;
