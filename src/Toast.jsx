import { CloseIcon } from './icons.jsx';

function Toast({ message, onUndo, onDismiss }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast-message">{message}</span>

      {onUndo && (
        <button type="button" className="toast-undo" onClick={onUndo}>
          Undo
        </button>
      )}

      <button
        type="button"
        className="toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

export default Toast;
