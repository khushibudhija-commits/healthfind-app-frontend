import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorMessage({
    title = 'Unable to Load Hospitals',
    message = 'Please check your connection or make sure the backend server is running.',
    onRetry = null
}) {
    return (
        <div className="mx-auto my-8 max-w-lg rounded-2xl border border-red-200 bg-red-50/70 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <AlertCircle size={26} />
            </div>
            <h3 className="mt-3 text-base font-bold text-red-900">{title}</h3>
            <p className="mt-1 text-xs text-red-700">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95"
                >
                    <RotateCcw size={14} />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    );
}
