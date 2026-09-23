import React from 'react';
import { HeartPulse, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand column */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                <HeartPulse size={20} />
                            </div>
                            <span className="text-xl font-black text-slate-900">
                                Health<span className="text-blue-600">Find</span>
                            </span>
                        </Link>
                        <p className="mt-3 max-w-md text-sm text-slate-500">
                            AI-powered hospital discovery, comparison, and emergency assistance platform across Punjab.
                            Designed to turn fragmented healthcare data into transparent decisions.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                            <Sparkles size={14} className="text-amber-500" />
                            <span>Natural Language AI Search interprets intent without altering medical data.</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
                        <ul className="mt-3 space-y-2 text-sm">
                            <li><Link to="/hospitals" className="hover:text-blue-600">Hospitals Directory</Link></li>
                            <li><Link to="/treatments" className="hover:text-blue-600">Browse Treatments</Link></li>
                            <li><Link to="/compare" className="hover:text-blue-600">Compare Shortlist</Link></li>
                            <li><Link to="/emergency" className="font-bold text-red-600 hover:text-red-700">🚨 Emergency Connect</Link></li>
                            <li><Link to="/about" className="hover:text-blue-600">About & Data Transparency</Link></li>
                        </ul>
                    </div>

                    {/* Emergency Notice */}
                    <div>
                        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700">
                            <ShieldAlert size={14} />
                            <span>Emergency Notice</span>
                        </h4>
                        <p className="mt-2 text-xs text-slate-500">
                            In life-threatening situations, dial <strong>108</strong> (Ambulance) or <strong>112</strong> (National Emergency) immediately. HealthFind is a hospital discovery tool, not a diagnostic or emergency medical provider.
                        </p>
                        <p className="mt-3 text-[11px] text-slate-400">
                            * Treatment costs and outcome rates displayed are demo estimates from the Punjab hackathon dataset.
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                    <p>© 2026 HealthFind. Built with care for Punjab. Open healthcare discovery for all.</p>
                </div>
            </div>
        </footer>
    );
}
