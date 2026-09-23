import React from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

const allFacilityOptions = [
    'Emergency',
    'ICU',
    'MRI',
    'CT Scan',
    'Blood Bank',
    'Pharmacy',
    'Ambulance',
    'Dialysis'
];

export default function FilterPanel({
    filters,
    setFilters,
    options = { treatments: [], facilities: [] },
    onApply,
    onReset
}) {
    const update = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const toggleFacility = (facility) => {
        const current = Array.isArray(filters.facilities)
            ? filters.facilities
            : filters.facilities
            ? [filters.facilities]
            : [];
        const next = current.includes(facility)
            ? current.filter((f) => f !== facility)
            : [...current, facility];
        update('facilities', next);
    };

    const facilityList = options.facilities?.length > 0 ? options.facilities : allFacilityOptions;
    const currentFacilities = Array.isArray(filters.facilities)
        ? filters.facilities
        : filters.facilities
        ? [filters.facilities]
        : [];

    return (
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Filters</h2>
                </div>
                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600"
                    >
                        <RotateCcw size={12} />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            <div className="mt-4 space-y-4">
                {/* Location Filter */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        City or District
                    </label>
                    <input
                        type="text"
                        value={filters.location || ''}
                        onChange={(e) => update('location', e.target.value)}
                        placeholder="e.g. Hoshiarpur, Jalandhar..."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Hospital Type */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Hospital Type
                    </label>
                    <select
                        value={filters.type || ''}
                        onChange={(e) => update('type', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">All Types (Govt, Private, Trust)</option>
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                        <option value="Trust/Charitable">Trust / Charitable</option>
                    </select>
                </div>

                {/* Treatment Filter */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Treatment
                    </label>
                    <select
                        value={filters.treatment || ''}
                        onChange={(e) => update('treatment', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">All Treatments</option>
                        {options.treatments?.map((treatment) => (
                            <option key={treatment} value={treatment}>
                                {treatment}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Maximum Budget Slider */}
                <div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Budget Under
                        </label>
                        <span className="text-xs font-bold text-blue-600">
                            {filters.budget ? `₹${Number(filters.budget).toLocaleString()}` : 'Any Budget'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10000"
                        max="300000"
                        step="10000"
                        value={filters.budget || 300000}
                        onChange={(e) => update('budget', e.target.value === '300000' ? '' : e.target.value)}
                        className="mt-2 w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                        <span>₹10,000</span>
                        <span>₹1,50,000</span>
                        <span>₹3,00,000+</span>
                    </div>
                </div>

                {/* Facilities Checkboxes */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Required Facilities
                    </label>
                    <div className="mt-2 space-y-1.5">
                        {facilityList.slice(0, 8).map((fac) => (
                            <label
                                key={fac}
                                className="flex cursor-pointer items-center gap-2 rounded-lg p-1 hover:bg-slate-50 text-xs text-slate-700"
                            >
                                <input
                                    type="checkbox"
                                    checked={currentFacilities.includes(fac)}
                                    onChange={() => toggleFacility(fac)}
                                    className="rounded border-slate-300 text-blue-600 accent-blue-600"
                                />
                                <span>{fac}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply Filters Button */}
                <button
                    type="button"
                    onClick={onApply}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                >
                    Apply Filters
                </button>
            </div>
        </aside>
    );
}
