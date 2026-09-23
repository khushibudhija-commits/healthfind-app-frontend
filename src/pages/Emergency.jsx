import React, { useEffect, useState } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Crosshair,
    HeartPulse,
    MapPin,
    Navigation,
    Phone,
    PhoneCall,
    Search,
    ShieldAlert,
    Siren
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { createGoogleMapsDirectionsUrl, formatDistance, sanitizePhoneNumber } from '../utils/distance.js';

export default function Emergency() {
    const [locationState, setLocationState] = useState('idle'); // 'idle' | 'detecting' | 'detected' | 'denied'
    const [userCoords, setUserCoords] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [manualCity, setManualCity] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [savingContact, setSavingContact] = useState(false);
    const [contactSaved, setContactSaved] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingHospitals, setLoadingHospitals] = useState(false);

    // Prompt #23: Automatically attempt location detection or offer clear one-tap button
    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationState('denied');
            setErrorMessage('Geolocation is not supported by your browser. Please search manually below.');
            return;
        }

        setLocationState('detecting');
        setErrorMessage('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserCoords({ latitude, longitude });
                setLocationState('detected');
                fetchNearbyHospitals(latitude, longitude);
            },
            (error) => {
                setLocationState('denied');
                if (error.code === error.PERMISSION_DENIED) {
                    setErrorMessage('Location permission was denied. You can search manually by entering your city or district.');
                } else {
                    setErrorMessage('Unable to determine location. Please search manually.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const fetchNearbyHospitals = async (lat, lng) => {
        setLoadingHospitals(true);
        try {
            const res = await api.nearby(lat, lng);
            setHospitals(res.data || []);
        } catch {
            setErrorMessage('Failed to fetch nearby hospitals. Please try manual search.');
        } finally {
            setLoadingHospitals(false);
        }
    };

    const handleManualSearch = async (e) => {
        e?.preventDefault();
        if (!manualCity.trim()) return;

        setLoadingHospitals(true);
        setErrorMessage('');
        try {
            const res = await api.hospitals({ location: manualCity.trim() });
            setHospitals(res.data || []);
            setLocationState('detected');
        } catch {
            setErrorMessage('Unable to find hospitals in that area.');
        } finally {
            setLoadingHospitals(false);
        }
    };

    const handleEmergencyContactSubmit = async (e) => {
        e.preventDefault();
        if (!userCoords || !contactNumber.trim()) return;

        setSavingContact(true);
        setContactSaved(false);
        setErrorMessage('');
        try {
            const response = await api.submitEmergencyRequest(contactNumber, userCoords.latitude, userCoords.longitude);
            setContactNumber(response.data?.contactNumber || contactNumber.trim());
            setContactSaved(true);
        } catch (error) {
            setErrorMessage(error.message || 'Unable to save your emergency contact.');
        } finally {
            setSavingContact(false);
        }
    };

    // Auto-detect on initial load if possible
    useEffect(() => {
        detectLocation();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Urgent Header Banner */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 py-8 text-white shadow-lg shadow-red-900/10">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
                                <Siren size={32} className="animate-pulse" />
                            </div>
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                                    🚨 HealthFind Emergency Connect
                                </span>
                                <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                                    Emergency Hospital Finder
                                </h1>
                                <p className="text-xs text-red-100 sm:text-sm">
                                    Instant nearest hospital ranking • One-tap direct call • Turn-by-turn navigation
                                </p>
                            </div>
                        </div>

                        {/* National Helpline Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <a
                                href="tel:108"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-red-600 shadow-md transition-all hover:bg-red-50 active:scale-95"
                            >
                                <PhoneCall size={14} />
                                <span>Dial 108 (Ambulance)</span>
                            </a>
                            <a
                                href="tel:112"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-red-800/40 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-red-800/60"
                            >
                                <ShieldAlert size={14} />
                                <span>Dial 112</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-6 space-y-6">
                {/* SAFETY NOTICE (Prompt #27) */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm">
                    <div className="flex items-start gap-2.5">
                        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                        <div>
                            <strong className="font-bold">Important Emergency Medical Notice:</strong>
                            <p className="mt-0.5 leading-relaxed text-amber-800">
                                HealthFind helps citizens locate nearby hospitals and access navigation/call options. HealthFind does not provide medical diagnosis or emergency treatment. For critical, life-threatening emergencies, dial <strong>108</strong> or <strong>112</strong> immediately.
                            </p>
                        </div>
                    </div>
                </div>

                {/* LOCATION STATUS CARD */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Geographic Detection
                            </span>
                            {locationState === 'detecting' && (
                                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-blue-600">
                                    <Crosshair size={16} className="animate-spin" />
                                    <span>Detecting your live GPS coordinates...</span>
                                </p>
                            )}
                            {locationState === 'detected' && (
                                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                    <CheckCircle size={16} className="text-emerald-600" />
                                    <span>
                                        {userCoords
                                            ? `Location detected (${userCoords.latitude.toFixed(3)}, ${userCoords.longitude.toFixed(3)})`
                                            : `Displaying hospitals for ${manualCity || 'Punjab'}`}
                                    </span>
                                </p>
                            )}
                            {locationState === 'denied' && (
                                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-red-600">
                                    <AlertCircle size={16} />
                                    <span>Location unavailable or denied</span>
                                </p>
                            )}
                            {locationState === 'idle' && (
                                <p className="mt-1 text-sm text-slate-600">
                                    Click detect location to find the nearest hospital within seconds.
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={detectLocation}
                            disabled={locationState === 'detecting'}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                        >
                            <Crosshair size={15} />
                            <span>{locationState === 'detecting' ? 'Detecting...' : 'Detect My Location'}</span>
                        </button>
                    </div>

                    {locationState === 'detected' && userCoords && (
                        <form onSubmit={handleEmergencyContactSubmit} className="mt-4 border-t border-slate-100 pt-4">
                            <label htmlFor="emergency-contact" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Patient Contact Number
                            </label>
                            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                                <input
                                    id="emergency-contact"
                                    name="contactNumber"
                                    type="tel"
                                    value={contactNumber}
                                    onChange={(e) => {
                                        setContactNumber(e.target.value);
                                        setContactSaved(false);
                                    }}
                                    placeholder="Enter mobile number"
                                    required
                                    inputMode="tel"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
                                />
                                <button
                                    type="submit"
                                    disabled={savingContact || contactSaved}
                                    className="shrink-0 rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {savingContact ? 'Saving...' : contactSaved ? 'Contact Saved' : 'Send Contact'}
                                </button>
                            </div>
                            <p className="mt-1.5 text-[11px] text-slate-500">
                                Your contact number will be saved with your live GPS location for emergency follow-up.
                            </p>
                            {contactSaved && (
                                <p className="mt-2 text-xs font-semibold text-emerald-700">
                                    Saved contact: {contactNumber}
                                </p>
                            )}
                        </form>
                    )}

                    {/* MANUAL SEARCH FALLBACK (Prompt #28) */}
                    {(locationState === 'denied' || locationState === 'idle') && (
                        <form onSubmit={handleManualSearch} className="mt-4 border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-slate-700">
                                Or search manually by city or district:
                            </p>
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="text"
                                    value={manualCity}
                                    onChange={(e) => setManualCity(e.target.value)}
                                    placeholder="Enter city or district (e.g. Hoshiarpur, Jalandhar, Mohali)..."
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="shrink-0 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                                >
                                    Find Hospitals
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="mt-2 text-xs font-medium text-red-600">{errorMessage}</p>
                            )}
                        </form>
                    )}
                </div>

                {/* RESULTS: NEAREST HOSPITALS (Prompt #23, #24, #25, #26) */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                                Fast Response Shortlist
                            </span>
                            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                                Nearest Hospitals
                            </h2>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                            {hospitals.length} facilities ready
                        </span>
                    </div>

                    {loadingHospitals && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/3 rounded bg-slate-200" />
                                            <div className="h-3 w-1/2 rounded bg-slate-200" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loadingHospitals && hospitals.length === 0 && locationState !== 'detecting' && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                            <HeartPulse size={36} className="mx-auto text-slate-300" />
                            <h3 className="mt-3 text-base font-bold text-slate-800">No Hospitals Found Nearby</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Try searching for another city or broadening your search.
                            </p>
                        </div>
                    )}

                    {!loadingHospitals && hospitals.length > 0 && (
                        <div className="space-y-4">
                            {hospitals.map((hospital, index) => {
                                const hasEmergency = hospital.facilities?.includes('Emergency');
                                const hasICU = hospital.facilities?.includes('ICU');
                                const phone = hospital.phone || hospital.receptionPhone;
                                const cleanPhone = sanitizePhoneNumber(phone);

                                const coords = hospital.location?.coordinates;
                                const directionsUrl = createGoogleMapsDirectionsUrl(
                                    userCoords?.latitude,
                                    userCoords?.longitude,
                                    coords?.[1],
                                    coords?.[0],
                                    hospital.address,
                                    hospital.name
                                );

                                const distFormatted = formatDistance(hospital.distanceKm);

                                return (
                                    <div
                                        key={hospital._id || hospital.name}
                                        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-3.5">
                                                {/* Numerical Priority Rank (Prompt #23) */}
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-base font-black text-white">
                                                    #{index + 1}
                                                </div>

                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            <Link
                                                                to={`/hospitals/${hospital._id || hospital.name.toLowerCase().replaceAll(' ', '-')}`}
                                                                className="hover:text-blue-600"
                                                            >
                                                                {hospital.name}
                                                            </Link>
                                                        </h3>
                                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                                                            {hospital.type}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                                                        <MapPin size={13} className="text-slate-400" />
                                                        <span>{hospital.address}, {hospital.city}, {hospital.district}</span>
                                                    </p>

                                                    {/* Prioritized Badges (Prompt #26) */}
                                                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                                        {distFormatted && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">
                                                                <Navigation size={12} />
                                                                <span>{distFormatted}</span>
                                                            </span>
                                                        )}

                                                        {hasEmergency && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-black text-red-800">
                                                                <Siren size={12} />
                                                                <span>24/7 Emergency</span>
                                                            </span>
                                                        )}

                                                        {hasICU && (
                                                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                                                                <span>ICU Available</span>
                                                            </span>
                                                        )}

                                                        {hospital.facilities?.filter((f) => f !== 'Emergency' && f !== 'ICU').slice(0, 3).map((f) => (
                                                            <span key={f} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PRIMARY EMERGENCY ACTIONS (Prompt #24 & #25) */}
                                            <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:w-44">
                                                {/* Direct Call Button */}
                                                {cleanPhone ? (
                                                    <a
                                                        href={`tel:${cleanPhone}`}
                                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95"
                                                    >
                                                        <PhoneCall size={14} />
                                                        <span>CALL HOSPITAL</span>
                                                    </a>
                                                ) : (
                                                    <div className="flex flex-1 items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-500">
                                                        Phone unavailable
                                                    </div>
                                                )}

                                                {/* Get Directions Button */}
                                                <a
                                                    href={directionsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95"
                                                >
                                                    <Navigation size={14} className="text-blue-600" />
                                                    <span>GET DIRECTIONS</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
