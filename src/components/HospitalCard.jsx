import React from 'react';
import { ArrowUpRight, Check, MapPin, Navigation, Phone, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import MatchReasons from './MatchReasons.jsx';
import { createGoogleMapsDirectionsUrl, formatDistance } from '../utils/distance.js';

export const hospitalSlug = (hospital) => hospital._id || hospital.name.toLowerCase().replaceAll(' ', '-');

const directFallbackImage = 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80';

export default function HospitalCard({
    hospital,
    selected = false,
    onCompare,
    userLocation = null
}) {
    if (!hospital) return null;

    const treatment = hospital.selectedTreatment || hospital.treatments?.[0];
    const image = hospital.image || directFallbackImage;
    const distanceKm = hospital.distanceKm;
    const distanceFormatted = formatDistance(distanceKm);

    const typeBadgeStyles = {
        Government: 'bg-blue-100 text-blue-800 border-blue-200',
        Private: 'bg-purple-100 text-purple-800 border-purple-200',
        'Trust/Charitable': 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    const badgeStyle = typeBadgeStyles[hospital.type] || 'bg-slate-100 text-slate-700 border-slate-200';

    const handleDirections = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const coords = hospital.location?.coordinates;
        const url = createGoogleMapsDirectionsUrl(
            userLocation?.latitude,
            userLocation?.longitude,
            coords?.[1],
            coords?.[0],
            [hospital.address, hospital.city, hospital.state].filter(Boolean).join(', '),
            hospital.name
        );
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
            {/* Visual Header */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                    src={image}
                    alt={hospital.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        if (e.currentTarget.src !== directFallbackImage) {
                            e.currentTarget.src = directFallbackImage;
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${badgeStyle}`}>
                        {hospital.type || 'Healthcare Provider'}
                    </span>
                </div>

                {/* Monogram Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-base font-black text-slate-800 shadow-md backdrop-blur-sm">
                        {hospital.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className="text-white">
                        <p className="flex items-center gap-1 text-xs font-medium text-slate-200 drop-shadow-sm">
                            <MapPin size={12} className="text-sky-300" />
                            <span>{[hospital.name, hospital.address, hospital.city, hospital.state].filter(Boolean).join(', ')}</span>
                        </p>
                        {distanceFormatted && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                                <Navigation size={10} />
                                {distanceFormatted}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold leading-tight text-slate-900 group-hover:text-blue-600">
                        <Link to={`/hospitals/${hospitalSlug(hospital)}`}>
                            {hospital.name}
                        </Link>
                    </h3>
                </div>

                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                    {hospital.address}
                </p>

                {/* Facility Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {hospital.facilities?.slice(0, 4).map((facility) => (
                        <span
                            key={facility}
                            className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${
                                facility === 'Emergency'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : facility === 'ICU'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                            {facility}
                        </span>
                    ))}
                    {hospital.facilities?.length > 4 && (
                        <span className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                            +{hospital.facilities.length - 4} more
                        </span>
                    )}
                </div>

                {/* Treatment & Cost Preview */}
                {treatment && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 truncate max-w-[160px]">
                                {treatment.name}
                            </span>
                            <span className="font-bold text-blue-700">
                                {treatment.estimatedCost?.min != null
                                    ? `₹${treatment.estimatedCost.min.toLocaleString()} – ₹${treatment.estimatedCost.max.toLocaleString()}`
                                    : 'Cost on request'}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Average Treatment Cost</span>
                            <span className="font-bold text-blue-700">
                                {hospital.treatmentMetrics?.averageCost != null
                                    ? `₹${hospital.treatmentMetrics.averageCost.toLocaleString()}`
                                    : treatment.estimatedCost?.min != null
                                    ? `₹${Math.round((treatment.estimatedCost.min + treatment.estimatedCost.max) / 2).toLocaleString()}`
                                    : 'Cost on request'}
                            </span>
                        </div>
                        {treatment.outcomeRate != null && (
                            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                                <span>Treatment Success Rate</span>
                                <span className="font-bold text-emerald-600">{treatment.outcomeRate}%</span>
                            </div>
                        )}
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Patients Treated</span>
                            <span className="font-bold text-slate-700">
                                {(hospital.treatmentMetrics?.totalPatientsTreated ?? treatment.patientsTreated ?? 120).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Explainable Match Reasons (from AI search) */}
                {hospital.matchReasons?.length > 0 && (
                    <MatchReasons reasons={hospital.matchReasons} />
                )}

                {/* Card Actions Footer */}
                <div className="mt-auto pt-5">
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/hospitals/${hospitalSlug(hospital)}`}
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-600 active:scale-95"
                        >
                            <span>View Details</span>
                            <ArrowUpRight size={14} />
                        </Link>

                        {onCompare && (
                            <button
                                type="button"
                                onClick={() => onCompare(hospital)}
                                className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-all active:scale-95 ${
                                    selected
                                        ? 'border border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                                title={selected ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                            >
                                {selected ? 'Shortlisted ✓' : 'Compare'}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleDirections}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                            title="Get directions in Google Maps"
                            aria-label={`Get directions to ${hospital.name}`}
                        >
                            <Navigation size={14} />
                        </button>
                    </div>

                    {hospital.phone && (
                        <div className="mt-2 text-center">
                            <a
                                href={`tel:${hospital.phone}`}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600"
                            >
                                <Phone size={11} />
                                <span>Call: {hospital.phone}</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
