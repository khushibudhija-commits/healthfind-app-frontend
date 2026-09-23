import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function Loading({ message = 'Finding care that fits...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <HeartPulse size={30} className="animate-pulse" />
                <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-blue-400 opacity-20" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">{message}</p>
            <p className="mt-1 text-xs text-slate-400">Searching Punjab verified hospital directory</p>
        </div>
    );
}

export function HospitalCardSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
            <div className="h-44 w-full rounded-xl bg-slate-200" />
            <div className="mt-4 flex justify-between">
                <div className="h-4 w-3/5 rounded bg-slate-200" />
                <div className="h-4 w-1/5 rounded bg-slate-200" />
            </div>
            <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
            <div className="mt-3 flex gap-2">
                <div className="h-6 w-16 rounded-lg bg-slate-200" />
                <div className="h-6 w-16 rounded-lg bg-slate-200" />
            </div>
            <div className="mt-4 h-12 rounded-xl bg-slate-100" />
            <div className="mt-4 h-9 rounded-xl bg-slate-200" />
        </div>
    );
}
