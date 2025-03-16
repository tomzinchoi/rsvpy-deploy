import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingLabelInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  disabled = false,
  error,
  helpText
}) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(name, e.target.value);
  };

  const renderInput = () => {
    const commonClasses = `block w-full rounded-lg border bg-zinc-800 px-4 pb-2.5 pt-5 text-white focus:outline-none focus:ring-1 transition-colors ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : isActive
        ? 'border-primary focus:border-primary focus:ring-primary'
        : 'border-zinc-700'
    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`;

    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          rows={4}
          className={`${commonClasses} resize-none`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={error ? 'true' : 'false'}
        />
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        className={commonClasses}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={error ? 'true' : 'false'}
      />
    );
  };

  return (
    <div className="relative">
      {/* 입력 필드 */}
      <div className="relative">
        {renderInput()}

        {/* 플로팅 라벨 */}
        <label
          htmlFor={name}
          className={`absolute left-3 top-2 z-10 origin-[0] -translate-y-1 transform text-sm duration-200 ${
            isActive ? 'text-primary' : 'text-gray-500'
          } ${error ? 'text-red-500' : ''} pointer-events-none`}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      </div>

      {/* 에러 메시지 또는 도움말 */}
      <div className="min-h-[24px] px-1 mt-1">
        {error ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.div>
        ) : helpText ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500 text-sm"
          >
            {helpText}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default FloatingLabelInput;
