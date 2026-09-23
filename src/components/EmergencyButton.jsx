import React from 'react';
import { Siren } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmergencyNavButton() {
    return (
        <Link
            to="/emergency"
            className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-red-500/20 transition-all hover:scale-105 hover:from-red-700 hover:to-rose-700 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
            aria-label="Emergency Assistance"
        >
            <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
            </span>
            <Siren size={16} className="transition-transform group-hover:rotate-12" />
            <span>Emergency</span>
        </Link>
    );
}

export function EmergencyFloatingButton() {
    return (
        <div className="fixed bottom-5 right-5 z-40 md:hidden">
            <Link
                to="/emergency"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-red-600/40 ring-4 ring-red-100 transition-all active:scale-95"
                aria-label="Emergency Assistance"
            >
                <Siren size={18} className="animate-pulse" />
                <span>🚨 Emergency</span>
            </Link>
        </div>
    );
}

export function EmergencyBanner() {
    return (
        <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 p-5 shadow-sm transition-all hover:border-red-300">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-500/30">
                        <Siren size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                                Immediate Help
                            </span>
                            <span className="text-xs font-semibold text-red-700">HealthFind Emergency Connect</span>
                        </div>
                        <h3 className="mt-1 text-base font-bold text-slate-900">
                            Need urgent care? Find nearest emergency hospitals right now.
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600">
                            Detects location instantly, sorts hospitals by distance, with direct one-tap calling and directions.
                        </p>
                    </div>
                </div>
                <Link
                    to="/emergency"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-lg active:scale-95"
                >
                    <Siren size={16} />
                    <span>Open Emergency Mode</span>
                </Link>
            </div>
        </div>
    );
}
