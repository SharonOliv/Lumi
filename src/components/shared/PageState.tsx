import "./PageState.css";

export const LoadingState = ({ label }: { label: string }) => (
  <div className="page-state" role="status">
    <span className="page-state-spinner" aria-hidden="true" />
    {label}
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="page-state page-state-error" role="alert">
    {message}
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="page-state page-state-empty">{message}</div>
);
