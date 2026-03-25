import { useCallback, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import { ToastContext } from '@/hooks/useToast';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, tone = 'success' }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, title, description, tone }]);
      window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex flex-col items-center gap-3 px-4">
        {toasts.map((toast) => {
          const isError = toast.tone === 'error';
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-card ${
                isError ? 'border-brand-100 bg-brand-50' : 'border-ink-200 bg-white'
              }`}
            >
              {isError ? <CircleAlert className="mt-0.5 h-5 w-5 text-brand-600" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 text-ink-700" />}
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-ink-600">{toast.description}</p> : null}
              </div>
              <button type="button" className="text-ink-500 transition hover:text-ink-800" onClick={() => removeToast(toast.id)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
