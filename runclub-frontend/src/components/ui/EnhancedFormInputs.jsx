import { motion } from "framer-motion";
import { useState, useRef } from "react";

/**
 * Enhanced form input with floating label animation
 */
export function EnhancedInput({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  placeholder = "",
  error = null,
  disabled = false,
  icon: Icon = null,
  hint = null,
  required = false,
  className = "",
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <motion.div className="relative w-full" layout>
      {/* Label with floating animation */}
      {label && (
        <motion.label
          htmlFor={props.id}
          initial={false}
          animate={{
            y: isFocused || hasValue ? -24 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? "rgb(255, 102, 102)" : "rgb(161, 140, 700)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute left-3 top-4 origin-left text-sm font-medium pointer-events-none"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}

      {/* Container with animated border */}
      <motion.div
        animate={{
          borderColor: isFocused
            ? "rgba(255, 102, 102, 0.5)"
            : error
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(255, 255, 255, 0.1)",
          boxShadow: isFocused
            ? "0 0 20px rgba(255, 26, 26, 0.2), inset 0 0 20px rgba(255, 26, 26, 0.05)"
            : error
            ? "0 0 20px rgba(239, 68, 68, 0.1)"
            : "inset 0 0 10px rgba(255, 255, 255, 0.02)",
        }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-2xl border-2 border-white/10 bg-black/40 backdrop-blur-md overflow-hidden ${className}`}
      >
        {/* Animated focus glow */}
        {isFocused && (
          <motion.div
            layoutId="input-glow"
            className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/5 to-transparent rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative flex items-center">
          {Icon && (
            <motion.div
              animate={{ color: isFocused ? "rgb(255, 102, 102)" : "rgb(113, 113, 122)" }}
              className="absolute left-4 flex items-center justify-center pointer-events-none"
            >
              <Icon size={18} />
            </motion.div>
          )}

          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-transparent border-0 outline-none py-3 text-white placeholder-zinc-500 transition-all duration-200 ${
              Icon ? "pl-12 pr-4" : "px-4"
            } disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
            {...props}
          />
        </div>
      </motion.div>

      {/* Error message with slide animation */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-2 text-xs font-medium text-red-400 flex items-center gap-1"
        >
          ⚠ {error}
        </motion.p>
      )}

      {/* Hint text with fade animation */}
      {hint && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-zinc-500"
        >
          {hint}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * Enhanced textarea with character count and animations
 */
export function EnhancedTextarea({
  label,
  value,
  onChange,
  placeholder = "",
  maxLength = 500,
  error = null,
  disabled = false,
  rows = 4,
  showCount = true,
  required = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const charCount = value?.length || 0;
  const isNearLimit = charCount > maxLength * 0.8;

  const handleChange = (e) => {
    if (maxLength && e.target.value.length <= maxLength) {
      setHasValue(!!e.target.value);
      onChange?.(e);
    }
  };

  return (
    <motion.div className="relative w-full" layout>
      {/* Label */}
      {label && (
        <motion.label
          animate={{
            y: isFocused || hasValue ? -24 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? "rgb(255, 102, 102)" : "rgb(161, 140, 700)",
          }}
          className="absolute left-3 top-3 origin-left text-sm font-medium pointer-events-none"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </motion.label>
      )}

      {/* Textarea container */}
      <motion.div
        animate={{
          borderColor: isFocused
            ? "rgba(255, 102, 102, 0.5)"
            : error
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(255, 255, 255, 0.1)",
        }}
        className="relative rounded-2xl border-2 border-white/10 bg-black/40 backdrop-blur-md overflow-hidden"
      >
        {isFocused && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/5 to-transparent rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="relative w-full bg-transparent border-0 outline-none py-3 px-4 text-white placeholder-zinc-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          {...props}
        />
      </motion.div>

      {/* Character count and error/hint */}
      <div className="mt-2 flex items-center justify-between">
        {error ? (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-medium text-red-400 flex items-center gap-1"
          >
            ⚠ {error}
          </motion.p>
        ) : null}

        {showCount && (
          <motion.p
            animate={{ color: isNearLimit ? "rgb(248, 113, 113)" : "rgb(113, 113, 122)" }}
            className="text-xs font-medium ml-auto"
          >
            {charCount}/{maxLength}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Form container with staggered field animations
 */
export function AnimatedForm({ children, onSubmit, className = "" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit?.(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
      className={`space-y-5 ${className}`}
    >
      {children}
    </motion.form>
  );
}

/**
 * Animated form field wrapper with stagger
 */
export function FormField({ children, error, hint, label, required, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="space-y-2"
    >
      {children}
    </motion.div>
  );
}

/**
 * Checkbox with animated toggle
 */
export function EnhancedCheckbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  error = null,
  hint = null,
  ...props
}) {
  return (
    <motion.div
      layout
      className="flex items-start gap-3"
    >
      <motion.button
        type="button"
        onClick={() => onChange?.(!checked)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.08 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        className={`relative mt-1 flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all flex-shrink-0 ${
          checked
            ? "border-red-500 bg-red-500/20"
            : "border-zinc-600 bg-black/40 hover:border-red-400/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        {...props}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-4 h-4 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}
      </motion.button>

      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-white cursor-pointer select-none">
            {label}
          </label>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>
        )}
      </div>
    </motion.div>
  );
}
