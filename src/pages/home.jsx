import React, { useEffect, useState } from 'react';
import {
    Activity,
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    HeartPulse,
    MapPin,
    Navigation,
    Search,
    ShieldCheck,
    Siren,
    Sparkles,
    Stethoscope,
    Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import { EmergencyBanner } from '../components/EmergencyButton.jsx';

const popularTreatments = [
    { name: 'Knee Replacement', category: 'Orthopaedics', icon: '🦴' },
    { name: 'Cataract Surgery', category: 'Ophthalmology', icon: '👁️' },
    { name: 'Heart Surgery', category: 'Cardiology', icon: '❤️' },
    { name: 'Fracture Treatment', category: 'Orthopaedics', icon: '🩹' },
    { name: 'Gallbladder Surgery', category: 'General Surgery', icon: '🔬' },
    { name: 'Chest Treatment', category: 'Pulmonology', icon: '🫁' }
];

const quickSearchCategories = [
    { label: 'Orthopedic', emoji: '🦴', query: 'Orthopedic fracture knee surgery' },
    { label: 'Cardiac', emoji: '❤️', query: 'Heart cardiac surgery' },
    { label: 'Eye Care', emoji: '👁️', query: 'Cataract eye surgery' },
    { label: 'Chest / Lungs', emoji: '🫁', query: 'Chest asthma pulmonology' },
    { label: 'Neurology', emoji: '🧠', query: 'Neurology stroke brain' },
    { label: 'General / Govt', emoji: '🏛️', query: 'Government civil hospital' },
    { label: 'Emergency', emoji: '🚨', isEmergency: true }
];

const suggestionChips = [
    'Knee surgery near Hoshiarpur',
    'Government hospitals in Jalandhar',
    'Cataract surgery under ₹30,000',
    'Hospitals with ICU and MRI',
    'Heart treatment near me'
];

export default function Home() {
    const navigate = useNavigate();
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('healthfind_recent_searches') || '[]');
            setRecentSearches(saved.slice(0, 5));
        } catch {
            setRecentSearches([]);
        }
    }, []);

    const handleSearch = (query) => {
        if (!query.trim()) return;
        const q = query.trim();
        try {
            const current = JSON.parse(localStorage.getItem('healthfind_recent_searches') || '[]');
            const updated = [q, ...current.filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 6);
            localStorage.setItem('healthfind_recent_searches', JSON.stringify(updated));
            setRecentSearches(updated.slice(0, 5));
        } catch {
            // ignore
        }
        navigate('/search', { state: { query: q } });
    };

    const clearRecentSearches = () => {
        localStorage.removeItem('healthfind_recent_searches');
        setRecentSearches([]);
    };

    const handleCategoryClick = (cat) => {
        if (cat.isEmergency) {
            navigate('/emergency');
        } else {
            handleSearch(cat.query);
        }
    };

    return (
        <div className="space-y-16 pb-16">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-10 sm:pt-16">
                <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-800 shadow-sm backdrop-blur-sm">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>AI-Powered Hospital Discovery & Comparison across Punjab</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                        Find the Right Hospital. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                            When It Matters Most.
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
                        Discover hospitals by treatment, condition, location, verified facilities, and cost ranges. Ask in everyday words — our AI parses your intent.
                    </p>

                    {/* Search Bar Container */}
                    <div className="mx-auto mt-8 max-w-3xl">
                        <SearchBar onSearch={handleSearch} />

                        {/* Search Suggestions */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                            <span className="font-semibold text-slate-500">Try searching:</span>
                            {suggestionChips.map((chip) => (
                                <button
                                    key={chip}
                                    type="button"
                                    onClick={() => handleSearch(chip)}
                                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-slate-50/80 p-2.5 text-xs">
                                <span className="font-semibold text-slate-500">Recent:</span>
                                {recentSearches.map((term) => (
                                    <button
                                        key={term}
                                        type="button"
                                        onClick={() => handleSearch(term)}
                                        className="rounded-md bg-white px-2 py-0.5 text-slate-600 shadow-sm hover:text-blue-600"
                                    >
                                        {term}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={clearRecentSearches}
                                    className="inline-flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-red-500"
                                    title="Clear recent searches"
                                >
                                    <Trash2 size={12} />
                                    <span>Clear</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
                {/* EMERGENCY BANNER */}
                <EmergencyBanner />

                {/* QUICK SEARCH CATEGORIES */}
                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Quick Browse</span>
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">What are you looking for?</h2>
                        </div>
                        <Link to="/hospitals" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                            <span>View all hospitals</span>
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                        {quickSearchCategories.map((cat) => (
                            <button
                                key={cat.label}
                                type="button"
                                onClick={() => handleCategoryClick(cat)}
                                className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md ${
                                    cat.isEmergency
                                        ? 'border-red-200 bg-red-50/60 hover:bg-red-50 text-red-800'
                                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 text-slate-800'
                                }`}
                            >
                                <span className="text-2xl">{cat.emoji}</span>
                                <span className="mt-2 text-xs font-bold">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* STORY & ARCHITECTURE SECTION: HOW HEALTHFIND WORKS */}
                <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-10 text-white shadow-xl">
                    <div className="max-w-2xl">
                        <span className="rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                            Transparent Product Vision
                        </span>
                        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                            From fragmented records to clear healthcare decisions.
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                            Healthcare info in Punjab is often scattered across phone directories, individual hospital notices, and unverified word-of-mouth. HealthFind unifies this into a single, explainable discovery engine.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                step: '01',
                                title: 'Natural Language Query',
                                text: 'Type naturally like "knee hospital near Hoshiarpur under 50k with MRI".'
                            },
                            {
                                step: '02',
                                title: 'AI Interprets Intent',
                                text: 'Our AI converts your sentence into structured filters without touching your private data.'
                            },
                            {
                                step: '03',
                                title: 'Transparent Matches',
                                text: 'Hospitals are matched directly from verified records, showing exactly why each result matches.'
                            },
                            {
                                step: '04',
                                title: 'Compare & Decide',
                                text: 'Review treatment costs, outcome rates, facilities matrix, or trigger one-tap emergency calling.'
                            }
                        ].map((card) => (
                            <div key={card.step} className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-5 backdrop-blur-sm">
                                <span className="text-xs font-black text-blue-400">{card.step}</span>
                                <h3 className="mt-1 text-base font-bold text-white">{card.title}</h3>
                                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* POPULAR TREATMENTS STRIP */}
                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Procedures</span>
                            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Explore by Common Treatment</h2>
                        </div>
                        <Link to="/treatments" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                            <span>Browse all 50+ treatments</span>
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {popularTreatments.map((tr) => (
                            <button
                                key={tr.name}
                                type="button"
                                onClick={() => navigate('/hospitals', { state: { treatment: tr.name } })}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{tr.icon}</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{tr.name}</h3>
                                        <p className="text-xs text-slate-500">{tr.category}</p>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-slate-400" />
                            </button>
                        ))}
                    </div>
                </section>

                {/* PLATFORM STATS */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                        <div className="border-r border-slate-100 last:border-0">
                            <span className="text-2xl font-black text-blue-600 sm:text-3xl">30+</span>
                            <p className="mt-1 text-xs font-semibold text-slate-600">Punjab Hospitals Listed</p>
                        </div>
                        <div className="border-r border-slate-100 last:border-0">
                            <span className="text-2xl font-black text-blue-600 sm:text-3xl">50+</span>
                            <p className="mt-1 text-xs font-semibold text-slate-600">Treatments Covered</p>
                        </div>
                        <div className="border-r border-slate-100 last:border-0">
                            <span className="text-2xl font-black text-emerald-600 sm:text-3xl">100%</span>
                            <p className="mt-1 text-xs font-semibold text-slate-600">Free, No Login Required</p>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-red-600 sm:text-3xl">24/7</span>
                            <p className="mt-1 text-xs font-semibold text-slate-600">Emergency Quick Connect</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
