import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export default function MatchReasons({ reasons = [] }) {
    if (!reasons || reasons.length === 0) return null;

    return (
        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-2.5 text-xs text-slate-700">
            <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-blue-900">
                <Sparkles size={13} className="text-amber-500" />
                <span>Why this hospital matches</span>
            </div>
            <ul className="space-y-1">
                {reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-700">
                        <Check size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                        <span>{reason}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
