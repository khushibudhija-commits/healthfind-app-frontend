import React, { useEffect, useState } from 'react';
import { ArrowLeft, Filter, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import HospitalCard, { hospitalSlug } from '../components/HospitalCard.jsx';
import Loading, { HospitalCardSkeleton } from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { api } from '../services/api.js';

export default function SearchResults({ compare = [], toggleCompare, userLocation = null }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialQuery = location.state?.query || searchParams.get('query') || '';

    const [query, setQuery] = useState(initialQuery);
    const [understoodFilters, setUnderstoodFilters] = useState({});
    const [hospitals, setHospitals] = useState([]);
    const [status, setStatus] = useState('loading');

    const executeSearch = async (queryString, customFilters = {}) => {
        if (!queryString && Object.keys(customFilters).length === 0) {
            navigate('/');
            return;
        }

        setStatus('loading');
        try {
            const res = await api.aiSearch(queryString, customFilters, userLocation);
            setUnderstoodFilters(res.filters || {});
            setHospitals(res.data || []);
            setStatus('ready');

            const newParams = new URLSearchParams();
            if (queryString) newParams.set('query', queryString);
            if (res.filters?.location) newParams.set('location', res.filters.location);
            if (res.filters?.treatment) newParams.set('treatment', res.filters.treatment);
            if (res.filters?.budget) newParams.set('budget', res.filters.budget);
            if (res.filters?.type) newParams.set('type', res.filters.type);
            setSearchParams(newParams, { replace: true });
        } catch {
            setStatus('error');
        }
    };

    useEffect(() => {
        const activeQuery = location.state?.query || searchParams.get('query') || '';
        setQuery(activeQuery);
        const urlFilters = {};
        if (searchParams.get('location')) urlFilters.location = searchParams.get('location');
        if (searchParams.get('treatment')) urlFilters.treatment = searchParams.get('treatment');
        if (searchParams.get('budget')) urlFilters.budget = Number(searchParams.get('budget'));
        if (searchParams.get('type')) urlFilters.type = searchParams.get('type');

        executeSearch(activeQuery, urlFilters);
    }, [location.state?.query]);

    const removeFilter = (filterKey, valueToRemove = null) => {
        const nextFilters = { ...understoodFilters };

        if (filterKey === 'facilities' && valueToRemove) {
            const currentFacs = Array.isArray(nextFilters.facilities) ? nextFilters.facilities : [];
            nextFilters.facilities = currentFacs.filter((f) => f !== valueToRemove);
        } else {
            delete nextFilters[filterKey];
            if (filterKey === 'hospitalType') delete nextFilters.type;
            if (filterKey === 'type') delete nextFilters.hospitalType;
        }

        setUnderstoodFilters(nextFilters);
        executeSearch(query, nextFilters);
    };

    const handleNewSearch = (newQuery) => {
        setQuery(newQuery);
        executeSearch(newQuery, {});
    };

    const activePills = [];
    if (understoodFilters.location) {
        activePills.push({
            key: 'location',
            label: `📍 ${understoodFilters.location}`,
            action: () => removeFilter('location')
        });
    }
    if (understoodFilters.treatment) {
        activePills.push({
            key: 'treatment',
            label: `🦴 ${understoodFilters.treatment}`,
            action: () => removeFilter('treatment')
        });
    }
    if (understoodFilters.budget) {
        activePills.push({
            key: 'budget',
            label: `💰 Under ₹${Number(understoodFilters.budget).toLocaleString()}`,
            action: () => removeFilter('budget')
        });
    }
    if (understoodFilters.hospitalType || understoodFilters.type) {
        const t = understoodFilters.hospitalType || understoodFilters.type;
        activePills.push({
            key: 'type',
            label: `🏛️ ${t}`,
            action: () => removeFilter('type')
        });
    }
    if (understoodFilters.facilities?.length > 0) {
        understoodFilters.facilities.forEach((fac) => {
            activePills.push({
                key: `fac-${fac}`,
                label: `🏥 ${fac}`,
                action: () => removeFilter('facilities', fac)
            });
        });
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        to="/hospitals"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Hospital Directory</span>
                    </Link>
                    <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                        AI Search Results
                    </h1>
                </div>

                <div className="w-full sm:max-w-md">
                    <SearchBar initialValue={query} onSearch={handleNewSearch} compact />
                </div>
            </div>

            {/* AI UNDERSTOOD PANEL */}
            <div className="mb-8 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 via-sky-50/60 to-indigo-50/60 p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                            <Sparkles size={15} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-blue-950">AI Interpretation</h2>
                            <p className="text-xs text-blue-800">
                                Click any tag below to remove it and adjust your search in real time:
                            </p>
                        </div>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                        {status === 'ready' ? `${hospitals.length} matching hospitals found` : 'Searching...'}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {activePills.map((pill) => (
                        <button
                            key={pill.key}
                            type="button"
                            onClick={pill.action}
                            className="group inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                            title="Click to remove this filter"
                        >
                            <span>{pill.label}</span>
                            <X size={13} className="text-slate-400 group-hover:text-red-600" />
                        </button>
                    ))}

                    {activePills.length === 0 && (
                        <span className="text-xs italic text-slate-500">
                            No specific filters applied. Showing all hospitals.
                        </span>
                    )}

                    {activePills.length > 0 && (
                        <button
                            type="button"
                            onClick={() => executeSearch('', {})}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                            <RotateCcw size={12} />
                            <span>Reset all filters</span>
                        </button>
                    )}
                </div>
            </div>

            {/* RESULTS VIEW */}
            {status === 'loading' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <HospitalCardSkeleton />
                    <HospitalCardSkeleton />
                    <HospitalCardSkeleton />
                </div>
            )}

            {status === 'error' && (
                <ErrorMessage
                    title="Search Failed"
                    message="We couldn't process your search query. Please try searching with a different term."
                    onRetry={() => executeSearch(query, understoodFilters)}
                />
            )}

            {status === 'ready' && hospitals.length === 0 && (
                <div className="mx-auto my-12 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                        <Search size={26} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900">No Hospitals Found</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        We could not find any hospitals matching all of your criteria. Try removing one of the filter tags above or increasing your budget.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => executeSearch('', {})}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                            Clear Filters
                        </button>
                        <Link
                            to="/hospitals"
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                        >
                            Browse All Hospitals
                        </Link>
                    </div>
                </div>
            )}

            {status === 'ready' && hospitals.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {hospitals.map((hospital) => {
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
    );
}
