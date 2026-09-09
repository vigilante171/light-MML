import "./ErrorState.css";

function ErrorState({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="error-state">
      <h3>Something went wrong</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="error-retry"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;