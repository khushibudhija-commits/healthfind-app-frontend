import React from 'react';
import {
    ArrowRight,
    Building2,
    Check,
    MapPin,
    Navigation,
    Phone,
    Plus,
    Trash2,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hospitalSlug } from '../components/HospitalCard.jsx';
import { formatDistance } from '../utils/distance.js';

const comparisonFacilities = [
    'Emergency',
    'ICU',
    'MRI',
    'CT Scan',
    'Blood Bank',
    'Pharmacy',
    'Ambulance',
    'Dialysis'
];

export default function CompareHospitals({ hospitals = [], toggleCompare, clearCompare }) {
    if (!hospitals || hospitals.length === 0) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Building2 size={32} />
                </div>
                <h1 className="mt-4 text-2xl font-black text-slate-900">Your Comparison List is Empty</h1>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-slate-500">
                    You can shortlist up to 3 hospitals side-by-side to review treatment costs, facilities, and outcome rates.
                </p>
                <div className="mt-6">
                    <Link
                        to="/hospitals"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                    >
                        <span>Explore Hospitals Directory</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Side-by-Side Evaluation</span>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Compare Hospitals</h1>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Comparing {hospitals.length} of 3 maximum selected hospitals
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {hospitals.length < 3 && (
                        <Link
                            to="/hospitals"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <Plus size={14} />
                            <span>Add Hospital</span>
                        </Link>
                    )}

                    {clearCompare && (
                        <button
                            type="button"
                            onClick={clearCompare}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600"
                        >
                            <Trash2 size={13} />
                            <span>Clear Shortlist</span>
                        </button>
                    )}
                </div>
            </div>

            {/* COMPARISON MATRIX (Prompt #19 & #20) */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="w-48 p-4 font-bold uppercase tracking-wider text-slate-500">
                                Feature
                            </th>
                            {hospitals.map((hospital) => (
                                <th key={hospitalSlug(hospital)} className="p-4 align-top">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                                                {hospital.type}
                                            </span>
                                            <h3 className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">
                                                <Link to={`/hospitals/${hospitalSlug(hospital)}`} className="hover:text-blue-600">
                                                    {hospital.name}
                                                </Link>
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleCompare(hospital)}
                                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                            title="Remove from comparison"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </th>
                            ))}
                            {hospitals.length < 3 && (
                                <th className="p-4 align-middle text-center text-slate-400">
                                    <Link
                                        to="/hospitals"
                                        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 hover:border-blue-400 hover:bg-blue-50/30"
                                    >
                                        <Plus size={20} className="text-slate-400" />
                                        <span className="mt-1 text-xs font-semibold text-slate-600">Add 3rd Hospital</span>
                                    </Link>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Location */}
                        <tr>
                            <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Location</td>
                            {hospitals.map((h) => (
                                <td key={hospitalSlug(h)} className="p-4 text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={13} className="text-slate-400" />
                                        <span>{h.city}, {h.district}</span>
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-slate-400 truncate max-w-[200px]">{h.address}</div>
                                </td>
                            ))}
                            {hospitals.length < 3 && <td />}
                        </tr>

                        {/* Distance */}
                        <tr>
                            <td className="p-4 font-bold text-slate-700 bg-slate-50/40">GPS Distance</td>
                            {hospitals.map((h) => (
                                <td key={hospitalSlug(h)} className="p-4 text-slate-800 font-semibold">
                                    {h.distanceKm != null ? formatDistance(h.distanceKm) : 'Location not provided'}
                                </td>
                            ))}
                            {hospitals.length < 3 && <td />}
                        </tr>

                        {/* Primary Treatment & Cost */}
                        <tr className="bg-blue-50/20">
                            <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Treatment Cost Range</td>
                            {hospitals.map((h) => {
                                const tr = h.selectedTreatment || h.treatments?.[0];
                                return (
                                    <td key={hospitalSlug(h)} className="p-4">
                                        {tr ? (
                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 block truncate">{tr.name}</span>
                                                <strong className="text-sm font-bold text-blue-700">
                                                    {tr.estimatedCost?.min != null
                                                        ? `₹${tr.estimatedCost.min.toLocaleString()} – ₹${tr.estimatedCost.max.toLocaleString()}`
                                                        : 'On request'}
                                                </strong>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">Not listed</span>
                                        )}
                                    </td>
                                );
                            })}
                            {hospitals.length < 3 && <td />}
                        </tr>

                        {/* Outcome Rate */}
                        <tr>
                            <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Demo Outcome Rate</td>
                            {hospitals.map((h) => {
                                const tr = h.selectedTreatment || h.treatments?.[0];
                                return (
                                    <td key={hospitalSlug(h)} className="p-4 font-bold text-emerald-600">
                                        {tr?.outcomeRate != null ? `${tr.outcomeRate}%` : 'N/A'}
                                    </td>
                                );
                            })}
                            {hospitals.length < 3 && <td />}
                        </tr>

                        {/* FACILITIES MATRIX (Prompt #20) */}
                        <tr className="border-t-2 border-slate-200">
                            <td colSpan={hospitals.length + (hospitals.length < 3 ? 2 : 1)} className="bg-slate-100/70 p-2.5 font-bold uppercase tracking-wider text-[11px] text-slate-600">
                                Verified Facilities & Medical Units
                            </td>
                        </tr>

                        {comparisonFacilities.map((facility) => (
                            <tr key={facility} className="hover:bg-slate-50/50">
                                <td className="p-3 font-semibold text-slate-700 bg-slate-50/40">
                                    {facility}
                                </td>
                                {hospitals.map((h) => {
                                    const has = h.facilities?.some((f) => f.toLowerCase() === facility.toLowerCase());
                                    return (
                                        <td key={hospitalSlug(h)} className="p-3">
                                            {has ? (
                                                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                                                    <Check size={16} />
                                                    <span>Available</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-slate-400">
                                                    <X size={15} />
                                                    <span>-</span>
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                                {hospitals.length < 3 && <td />}
                            </tr>
                        ))}

                        {/* Actions Row */}
                        <tr className="border-t-2 border-slate-200 bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Actions</td>
                            {hospitals.map((h) => (
                                <td key={hospitalSlug(h)} className="p-4">
                                    <Link
                                        to={`/hospitals/${hospitalSlug(h)}`}
                                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                                    >
                                        <span>View Details</span>
                                        <ArrowRight size={13} />
                                    </Link>
                                </td>
                            ))}
                            {hospitals.length < 3 && <td />}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
