import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    ArrowUpDown,
    Filter,
    MapPin,
    Navigation,
    Search,
    SlidersHorizontal,
    X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel.jsx';
import HospitalCard, { hospitalSlug } from '../components/HospitalCard.jsx';
import Loading, { HospitalCardSkeleton } from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { api } from '../services/api.js';

export default function Hospitals({
    compare = [],
    toggleCompare,
    userLocation = null,
    setUserLocation
}) {
    const location = useLocation();

    const [filters, setFilters] = useState({
        search: '',
        location: location.state?.location || '',
        type: location.state?.type || '',
        treatment: location.state?.treatment || '',
        facilities: location.state?.facilities || [],
        budget: '',
        withinKm: '',
        sort: location.state?.nearMe ? 'distance' : 'success'
    });

    const [hospitals, setHospitals] = useState([]);
    const [treatmentsList, setTreatmentsList] = useState([]);
    const [facilitiesList, setFacilitiesList] = useState([]);
    const [status, setStatus] = useState('loading');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Initial load of treatments and facilities for filter options
    useEffect(() => {
        Promise.all([
            api.treatments().catch(() => ({ data: [] })),
            api.facilities().catch(() => ({ data: [] }))
        ]).then(([trRes, facRes]) => {
            setTreatmentsList(trRes.data || []);
            setFacilitiesList(facRes.data || []);
        });
    }, []);

    // Handle initial state navigation (e.g. Find Near Me clicked in Navbar)
    useEffect(() => {
        if (location.state?.nearMe && location.state?.latitude && location.state?.longitude) {
            const coords = { latitude: location.state.latitude, longitude: location.state.longitude };
            if (setUserLocation) setUserLocation(coords);
            setFilters((prev) => ({
                ...prev,
                sort: 'distance',
                originLatitude: coords.latitude,
                originLongitude: coords.longitude
            }));
        } else if (location.state?.treatment) {
            setFilters((prev) => ({ ...prev, treatment: location.state.treatment }));
        }
    }, [location.state]);

    const loadHospitals = async (customFilters = null) => {
        setStatus('loading');
        try {
            const activeFilters = customFilters || filters;
            const payload = {
                ...activeFilters,
                originLatitude: userLocation?.latitude || activeFilters.originLatitude,
                originLongitude: userLocation?.longitude || activeFilters.originLongitude
            };
            const result = await api.hospitals(payload);
            setHospitals(result.data || []);
            setStatus('ready');
        } catch {
            setStatus('error');
        }
    };

    useEffect(() => {
        loadHospitals();
    }, [filters.sort, userLocation]);

    const handleSortChange = (newSort) => {
        if (newSort === 'distance' && !userLocation) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        const loc = { latitude: coords.latitude, longitude: coords.longitude };
                        if (setUserLocation) setUserLocation(loc);
                        setFilters((prev) => ({
                            ...prev,
                            sort: 'distance',
                            originLatitude: loc.latitude,
                            originLongitude: loc.longitude
                        }));
                    },
                    () => {
                        setFilters((prev) => ({ ...prev, sort: newSort }));
                    }
                );
                return;
            }
        }
        setFilters((prev) => ({ ...prev, sort: newSort }));
    };

    const handleResetFilters = () => {
        const cleared = {
            search: '',
            location: '',
            type: '',
            treatment: '',
            facilities: [],
            budget: '',
            withinKm: '',
            sort: 'success'
        };
        setFilters(cleared);
        loadHospitals(cleared);
    };

    const displayedHospitals = hospitals;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Punjab Healthcare Directory</span>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Hospitals</h1>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Discover, filter, and compare hospitals across Punjab with transparent records.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Compare shortlist link */}
                    <Link
                        to="/compare"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95"
                    >
                        <span>Compare Shortlist ({compare.length})</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Search Input Bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') loadHospitals(); }}
                        placeholder="Search hospital name, city, district or treatment..."
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => loadHospitals()}
                    className="shrink-0 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800"
                >
                    Search Directory
                </button>

                {/* Mobile Filter Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 lg:hidden"
                >
                    <Filter size={16} />
                    <span>Filters</span>
                </button>
            </div>

            {/* Layout: Sidebar & Results Grid */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Desktop Filter Sidebar */}
                <div className="hidden lg:block">
                    <FilterPanel
                        filters={filters}
                        setFilters={setFilters}
                        options={{ treatments: treatmentsList, facilities: facilitiesList }}
                        onApply={() => loadHospitals()}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* Results Area */}
                <div className="lg:col-span-3">
                    {/* Results Toolbar */}
                    <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs font-bold text-slate-700">
                            {status === 'ready'
                                ? `Showing ${displayedHospitals.length} hospital${displayedHospitals.length === 1 ? '' : 's'}`
                                : 'Searching hospitals...'}
                        </span>

                        {/* Sort Controls (Prompt #14) */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <ArrowUpDown size={12} />
                                <span>Sort:</span>
                            </span>
                            <select
                                value={filters.sort || 'success'}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                            >
                                <option value="success">Highest Outcome Rate</option>
                                <option value="distance">Nearest Distance (GPS)</option>
                                <option value="cost_asc">Cost: Low → High</option>
                                <option value="cost_desc">Cost: High → Low</option>
                                <option value="name">Name (A → Z)</option>
                            </select>
                        </div>
                    </div>

                    {/* Skeletons on loading */}
                    {status === 'loading' && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            <HospitalCardSkeleton />
                            <HospitalCardSkeleton />
                            <HospitalCardSkeleton />
                        </div>
                    )}

                    {status === 'error' && (
                        <ErrorMessage
                            title="Error Loading Hospitals"
                            message="We were unable to load the hospital directory. Please ensure the backend is running."
                            onRetry={() => loadHospitals()}
                        />
                    )}

                    {status === 'ready' && displayedHospitals.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <Search size={36} className="mx-auto text-slate-300" />
                            <h3 className="mt-4 text-base font-bold text-slate-800">No Hospitals Found</h3>
                            <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
                                Try changing your city/district, clearing treatment or facility filters, or broadening your budget.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}

                    {status === 'ready' && displayedHospitals.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {displayedHospitals.map((hospital) => {
                                const isShortlisted = compare.some((c) => hospitalSlug(c) === hospitalSlug(hospital));
                                return (
                                    <HospitalCard
                                        key={hospitalSlug(hospital)}
                                        hospital={hospital}
                                        selected={isShortlisted}
                                        onCompare={toggleCompare}
                                        userLocation={userLocation}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal/Drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm lg:hidden">
                    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Filter Directory</h3>
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <FilterPanel
                            filters={filters}
                            setFilters={setFilters}
                            options={{ treatments: treatmentsList, facilities: facilitiesList }}
                            onApply={() => {
                                setMobileFiltersOpen(false);
                                loadHospitals();
                            }}
                            onReset={handleResetFilters}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
