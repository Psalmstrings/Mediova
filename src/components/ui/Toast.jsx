import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

let toastFn = null;

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  useEffect(() => {
    toastFn = addToast;
    return () => { toastFn = null; };
  }, [addToast]);

  const icons = { success: '', error: '❌', warning: '⚠️', info: 'ℹ️' };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>{icons[toast.type] || 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export const toast = {
  success: (msg) => toastFn?.(msg, 'success'),
  error: (msg) => toastFn?.(msg, 'error'),
  warning: (msg) => toastFn?.(msg, 'warning'),
  info: (msg) => toastFn?.(msg, 'info'),
};
