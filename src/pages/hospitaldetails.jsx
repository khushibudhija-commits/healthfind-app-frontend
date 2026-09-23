import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Check,
    Clock,
    Globe,
    Info,
    MapPin,
    Navigation,
    Phone,
    PhoneCall,
    Share2,
    ShieldAlert,
    ShieldCheck,
    Siren,
    Star
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import DataCompleteness from '../components/DataCompleteness.jsx';
import { api } from '../services/api.js';
import { hospitalSlug } from '../components/HospitalCard.jsx';
import { createGoogleMapsDirectionsUrl, formatDistance, sanitizePhoneNumber } from '../utils/distance.js';

const directFallbackImage = 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80';

export default function HospitalDetails({
    compare = [],
    toggleCompare,
    userLocation = null
}) {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    const [status, setStatus] = useState('loading');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setStatus('loading');
        api.hospital(id, userLocation)
            .then((res) => {
                setHospital(res.data);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    }, [id, userLocation]);

    if (status === 'loading') return <Loading message="Loading hospital profile..." />;
    if (status === 'error' || !hospital) {
        return (
            <ErrorMessage
                title="Hospital Not Found"
                message="We could not find records for this hospital. It may have been renamed or removed."
            />
        );
    }

    const isShortlisted = compare.some((c) => hospitalSlug(c) === hospitalSlug(hospital));
    const image = hospital.image || directFallbackImage;
    const phone = hospital.phone || hospital.receptionPhone;
    const cleanPhone = sanitizePhoneNumber(phone);

    const coords = hospital.location?.coordinates;
    const directionsUrl = createGoogleMapsDirectionsUrl(
        userLocation?.latitude,
        userLocation?.longitude,
        coords?.[1],
        coords?.[0],
        [hospital.address, hospital.city, hospital.state].filter(Boolean).join(', '),
        hospital.name
    );

    const distanceFormatted = formatDistance(hospital.distanceKm);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    to="/hospitals"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Hospitals</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        title="Copy profile link"
                    >
                        <Share2 size={13} />
                        <span>{copied ? 'Copied Link!' : 'Share'}</span>
                    </button>

                </div>
            </div>

            {/* HERO PROFILE CARD */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
                    <img
                        src={image}
                        alt={hospital.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            if (e.currentTarget.src !== directFallbackImage) {
                                e.currentTarget.src = directFallbackImage;
                            }
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                                    {hospital.type} Care Provider
                                </span>
                                {distanceFormatted && (
                                    <span className="rounded-lg bg-emerald-500/90 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                                        {distanceFormatted}
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-2 text-2xl font-black sm:text-4xl text-white">
                                {hospital.name}
                            </h1>
                            <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-slate-200">
                                <MapPin size={14} className="text-sky-400" />
                                <span>{hospital.address}, {hospital.city}, {hospital.district}, {hospital.state}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* ACTION BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-5 bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-2">
                        {cleanPhone ? (
                            <a
                                href={`tel:${cleanPhone}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95"
                            >
                                <Phone size={14} />
                                <span>Call Hospital: {cleanPhone}</span>
                            </a>
                        ) : (
                            <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-500">
                                Phone unavailable
                            </span>
                        )}

                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95"
                        >
                            <Navigation size={14} className="text-blue-600" />
                            <span>Get Directions</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => toggleCompare(hospital)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                                isShortlisted
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Check size={14} className={isShortlisted ? 'text-blue-600' : 'text-slate-400'} />
                            <span>{isShortlisted ? 'In Shortlist' : 'Add to Compare'}</span>
                        </button>
                    </div>

                    <Link
                        to="/emergency"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
                    >
                        <Siren size={14} />
                        <span>Emergency Assistance</span>
                    </Link>
                </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    {/* AVAILABLE FACILITIES */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-base font-bold text-slate-900">Available Facilities & Units</h2>
                            <span className="text-xs font-semibold text-slate-500">
                                {hospital.facilities?.length || 0} verified listings
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {hospital.facilities?.map((facility) => (
                                <div
                                    key={facility}
                                    className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                                        facility === 'Emergency'
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : facility === 'ICU'
                                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                            : 'bg-slate-50 text-slate-700 border border-slate-100'
                                    }`}
                                >
                                    <Check size={14} className={facility === 'Emergency' ? 'text-red-600' : 'text-emerald-600'} />
                                    <span>{facility}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TREATMENTS & ESTIMATED COSTS TABLE */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Treatments & Estimated Costs</h2>
                                <p className="text-xs text-slate-500">Includes simulated outcome rates for hackathon demonstration</p>
                            </div>
                            <span className="text-xs font-semibold text-blue-600">
                                {hospital.treatments?.length || 0} procedures
                            </span>
                        </div>

                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400">
                                        <th className="pb-2.5 font-bold uppercase tracking-wider">Treatment / Procedure</th>
                                        <th className="pb-2.5 font-bold uppercase tracking-wider">Specialty</th>
                                        <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Cost Range</th>
                                        <th className="pb-2.5 font-bold uppercase tracking-wider text-right">Outcome Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {hospital.treatments?.map((treatment) => (
                                        <tr key={treatment.name} className="hover:bg-slate-50/60">
                                            <td className="py-3 font-bold text-slate-900">{treatment.name}</td>
                                            <td className="py-3 text-slate-500">{treatment.category || 'General'}</td>
                                            <td className="py-3 text-right font-semibold text-blue-700">
                                                {treatment.estimatedCost?.min != null
                                                    ? `₹${treatment.estimatedCost.min.toLocaleString()} – ₹${treatment.estimatedCost.max.toLocaleString()}`
                                                    : 'Not available'}
                                            </td>
                                            <td className="py-3 text-right font-bold text-emerald-600">
                                                {treatment.outcomeRate != null ? `${treatment.outcomeRate}%` : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Info size={12} />
                            <span>Treatment cost ranges and outcome rates shown above are demo data from the Punjab hospital dataset.</span>
                        </div>
                    </div>

                    {/* DOCTOR AVAILABILITY SCHEDULE */}
                    {hospital.doctorAvailability?.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h2 className="text-base font-bold text-slate-900">Doctor OPD Schedule</h2>
                                <span className="text-xs font-semibold text-slate-500">
                                    {hospital.doctorAvailability.length} scheduled days
                                </span>
                            </div>

                            <div className="mt-4 space-y-2.5">
                                {hospital.doctorAvailability.map((slot) => (
                                    <div
                                        key={slot.day}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-50 p-3 text-xs gap-1"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-blue-600" />
                                            <span className="font-bold text-slate-900">{slot.day}</span>
                                            <span className="text-slate-500">({slot.timing})</span>
                                        </div>
                                        <div className="text-slate-600">
                                            <span>Departments: </span>
                                            <strong>{slot.departments?.join(', ')}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Transparency, Contact & Map */}
                <div className="space-y-6">
                    <DataCompleteness hospital={hospital} />

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900">Contact & Location</h3>

                        <div className="mt-4 space-y-3 text-xs">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                                <div>
                                    <strong className="block text-slate-800">Physical Address</strong>
                                    <span className="text-slate-600">{hospital.address}, {hospital.city}, {hospital.district}, {hospital.state}</span>
                                </div>
                            </div>

                            {phone && (
                                <div className="flex items-start gap-2.5">
                                    <Phone size={15} className="mt-0.5 shrink-0 text-slate-400" />
                                    <div>
                                        <strong className="block text-slate-800">Phone</strong>
                                        <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
                                    </div>
                                </div>
                            )}

                            {hospital.receptionPhone && hospital.receptionPhone !== hospital.phone && (
                                <div className="flex items-start gap-2.5">
                                    <Phone size={15} className="mt-0.5 shrink-0 text-slate-400" />
                                    <div>
                                        <strong className="block text-slate-800">Reception</strong>
                                        <a href={`tel:${hospital.receptionPhone}`} className="text-blue-600 hover:underline">{hospital.receptionPhone}</a>
                                    </div>
                                </div>
                            )}

                            {hospital.website && (
                                <div className="flex items-start gap-2.5">
                                    <Globe size={15} className="mt-0.5 shrink-0 text-slate-400" />
                                    <div>
                                        <strong className="block text-slate-800">Official Website</strong>
                                        <a href={hospital.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-[200px]">
                                            {hospital.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100">
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                            >
                                <Navigation size={14} />
                                <span>Open in Google Maps</span>
                            </a>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs text-blue-950">
                        <strong className="flex items-center gap-1 font-bold text-blue-900">
                            <ShieldCheck size={14} className="text-blue-600" />
                            <span>Verified Punjab Listing</span>
                        </strong>
                        <p className="mt-1 leading-relaxed text-slate-600">
                            All facilities, doctor schedules, and phone numbers are sourced from the verified Punjab healthcare dataset. For changes or inaccuracies, contact administrative support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
