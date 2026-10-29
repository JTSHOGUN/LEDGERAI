import React, { useEffect, useState, useRef } from 'react';
import { useApp, ToastItem } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const duration = toast.duration ?? 5000;
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    const currentRemaining = remainingTimeRef.current;

    // Countdown interval for smooth progress bar
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const nextRemaining = Math.max(0, currentRemaining - elapsed);
      const nextProgress = (nextRemaining / duration) * 100;
      setProgress(nextProgress);

      if (nextRemaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    // Timeout to auto-dismiss after remaining duration
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, currentRemaining);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, toast.id, duration, onDismiss]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-teal-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'warning':
        return 'border-amber-500/30';
      default:
        return 'border-stone-700';
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-teal-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-stone-400';
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-3.5 bg-stone-900/95 text-stone-100 rounded-lg shadow-2xl border ${getBorderColor()} transition-all transform duration-200 hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-2`}
      role="alert"
      aria-live="polite"
    >
      <div className="mt-0.5 shrink-0">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
        {toast.type === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
        {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-stone-300" />}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs font-semibold text-stone-100 leading-tight">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-stone-400 mt-1 leading-relaxed line-clamp-3">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors p-1 rounded-md shrink-0 cursor-pointer"
        aria-label="Dismiss notification"
        title="Dismiss (or auto-closes in 5s)"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* 5-second auto-dismiss progress bar indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-800/80">
        <div
          className={`h-full ${getProgressColor()} transition-[width] duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.slice(0, 4).map(toast => (
        <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};
