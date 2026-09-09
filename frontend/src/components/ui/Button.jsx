import "./Button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`button button-${variant} button-${size}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;