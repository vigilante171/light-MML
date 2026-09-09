import "./Input.css";

function Input({
  label,
  error,
  id,
  ...props
}) {
  return (
    <div className="input-field">
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        className={
          error
            ? "input input-error"
            : "input"
        }
        {...props}
      />

      {error && (
        <span className="input-error-message">
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;