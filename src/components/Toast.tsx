'use client';

import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

export function Toast({ message, type, duration = 2000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      data-testid="toast"
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${typeStyles[type]} transition-all duration-300`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
