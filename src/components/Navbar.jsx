import React, { useState } from 'react';
import { HeartPulse, Menu, MessageCircle, Navigation, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { EmergencyNavButton } from './EmergencyButton.jsx';

export default function Navbar({ compareCount = 0, onOpenAssistant }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [locating, setLocating] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Hospitals', to: '/hospitals' },
        { label: 'Treatments', to: '/treatments' },
        {
            label: 'Compare',
            to: '/compare',
            badge: compareCount > 0 ? compareCount : null
        },
        { label: 'About', to: '/about' }
    ];

    const handleFindNearMe = () => {
        if (!navigator.geolocation) {
            navigate('/hospitals', { state: { error: 'Location not supported by browser' } });
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setLocating(false);
                setMobileOpen(false);
                navigate('/hospitals', {
                    state: {
                        nearMe: true,
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    }
                });
            },
            () => {
                setLocating(false);
                setMobileOpen(false);
                navigate('/hospitals', { state: { nearMeError: 'Location access denied. Please search by city.' } });
            },
            { timeout: 8000 }
        );
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25">
                        <HeartPulse size={22} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-slate-900">
                            Health<span className="text-blue-600">Find</span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                            Punjab Care Discovery
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`
                            }
                        >
                            <span className="flex items-center gap-1.5">
                                {item.label}
                                {item.badge != null && (
                                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-extrabold text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <button
                        type="button"
                        onClick={onOpenAssistant}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-2 text-xs font-bold text-blue-800 transition-all hover:bg-blue-100 active:scale-95"
                        title="Open care assistant"
                    >
                        <MessageCircle size={14} />
                        <span>Care Assistant</span>
                    </button>

                    {/* Find Near Me button */}
                    <button
                        type="button"
                        onClick={handleFindNearMe}
                        disabled={locating}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-95 disabled:opacity-60"
                        title="Find hospitals closest to current GPS location"
                    >
                        <Navigation size={14} className={locating ? 'animate-spin' : ''} />
                        <span>{locating ? 'Locating...' : 'Find Near Me'}</span>
                    </button>

                    {/* Distinctive Emergency Button */}
                    <EmergencyNavButton />
                </div>

                {/* Mobile Menu Hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <EmergencyNavButton />
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="border-b border-slate-200 bg-white p-4 md:hidden">
                    <nav className="flex flex-col space-y-1">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold ${
                                        isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                                    }`
                                }
                            >
                                <span>{item.label}</span>
                                {item.badge != null && (
                                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-extrabold text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    onOpenAssistant?.();
                                }}
                                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-bold text-blue-800"
                            >
                                <MessageCircle size={16} />
                                <span>Care Assistant</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleFindNearMe}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 py-3 text-sm font-bold text-emerald-800"
                            >
                                <Navigation size={16} />
                                <span>{locating ? 'Locating...' : 'Find Near Me'}</span>
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
