import { useId } from "react";

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

function hasValue(value) {
  if (value === undefined || value === null) {
    return false;
  }

  return String(value).length > 0;
}

export function FloatingInput({ label, className, inputClassName, id, value, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const active = hasValue(value);

  return (
    <div className={joinClasses("floating-field", className)}>
      <input
        id={fieldId}
        value={value}
        placeholder=" "
        className={joinClasses("floating-control", inputClassName)}
        {...props}
      />
      <label htmlFor={fieldId} className={joinClasses("floating-label", active && "floating-label-active")}>
        {label}
      </label>
    </div>
  );
}

export function FloatingSelect({ label, className, selectClassName, id, value, children, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const active = hasValue(value);

  return (
    <div className={joinClasses("floating-field", className)}>
      <select
        id={fieldId}
        value={value}
        className={joinClasses("floating-control floating-select", selectClassName)}
        {...props}
      >
        {children}
      </select>
      <label htmlFor={fieldId} className={joinClasses("floating-label", active && "floating-label-active")}>
        {label}
      </label>
    </div>
  );
}

export function FloatingTextarea({
  label,
  className,
  textareaClassName,
  id,
  value,
  ...props
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const active = hasValue(value);

  return (
    <div className={joinClasses("floating-field", className)}>
      <textarea
        id={fieldId}
        value={value}
        placeholder=" "
        className={joinClasses("floating-control min-h-[140px] resize-none pt-8", textareaClassName)}
        {...props}
      />
      <label htmlFor={fieldId} className={joinClasses("floating-label", active && "floating-label-active")}>
        {label}
      </label>
    </div>
  );
}
