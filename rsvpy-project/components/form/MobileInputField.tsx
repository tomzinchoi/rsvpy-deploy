import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MobileInputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

const MobileInputField: React.FC<MobileInputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error,
  helpText
}) => {
  const [focused, setFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(name, e.target.value);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className="space-y-1">
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${focused ? 'border-primary ring-primary/20' : 'border-zinc-700'}
            ${error ? 'border-red-500 ring-red-500/20' : ''}`}
          placeholder={placeholder}
          rows={4}
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
          className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:outline-none focus:ring-2 transition-colors
            ${focused ? 'border-primary ring-primary/20' : 'border-zinc-700'}
            ${error ? 'border-red-500 ring-red-500/20' : ''}`}
          placeholder={placeholder}
          required={required}
        />
      )}

      <div className="min-h-[1.5rem]">
        {error ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        ) : helpText ? (
          <p className="text-xs text-gray-500">
            {helpText}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default MobileInputField;
