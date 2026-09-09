import "./Loading.css";

function Loading({
  message = "Loading...",
}) {
  return (
    <div className="loading">
      <span className="loading-spinner" />
      <span>{message}</span>
    </div>
  );
}

export default Loading;