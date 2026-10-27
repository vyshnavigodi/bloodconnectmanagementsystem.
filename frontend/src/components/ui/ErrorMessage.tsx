import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 px-3 py-1.5 rounded-lg transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
