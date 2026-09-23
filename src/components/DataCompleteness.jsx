import React from 'react';
import { Check, Info, X } from 'lucide-react';

export default function DataCompleteness({ hospital }) {
    if (!hospital) return null;

    const fields = [
        { label: 'Address & City', present: Boolean(hospital.address && hospital.city) },
        { label: 'Verified Facilities', present: Boolean(hospital.facilities?.length > 0) },
        { label: 'Treatments & Cost Ranges', present: Boolean(hospital.treatments?.length > 0) },
        { label: 'GPS Location Coordinates', present: Boolean(hospital.location?.coordinates?.length === 2) },
        { label: 'Direct Phone / Reception', present: Boolean(hospital.phone || hospital.receptionPhone) },
        { label: 'Doctor Availability Schedule', present: Boolean(hospital.doctorAvailability?.length > 0) }
    ];

    const presentCount = fields.filter((f) => f.present).length;
    const percentage = Math.round((presentCount / fields.length) * 100);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Directory Data Completeness</h3>
                    <p className="text-xs text-slate-500">Based on verified listings in Punjab directory</p>
                </div>
                <span className="text-base font-extrabold text-blue-600">{percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Field breakdown */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {fields.map((field) => (
                    <div
                        key={field.label}
                        className={`flex items-center gap-1.5 rounded-lg p-1.5 ${
                            field.present ? 'bg-emerald-50/60 text-emerald-800' : 'bg-slate-50 text-slate-400'
                        }`}
                    >
                        {field.present ? (
                            <Check size={13} className="shrink-0 text-emerald-600" />
                        ) : (
                            <X size={13} className="shrink-0 text-slate-400" />
                        )}
                        <span className="truncate">{field.label}</span>
                    </div>
                ))}
            </div>

            <p className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                <Info size={12} />
                <span>Reflects record completeness, not clinical endorsement or medical rating.</span>
            </p>
        </div>
    );
}
