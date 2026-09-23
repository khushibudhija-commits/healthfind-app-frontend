import React from 'react';
import {
    AlertCircle,
    CheckCircle,
    Database,
    HeartPulse,
    Info,
    Lock,
    Server,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-800">
                    <HeartPulse size={14} className="text-blue-600" />
                    <span>Open Care Discovery Platform</span>
                </div>
                <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                    About HealthFind & Data Transparency
                </h1>
                <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 leading-relaxed">
                    HealthFind was built for the 3-day hackathon to solve one of the most stressful problems citizens face: finding, understanding, and comparing hospitals during illness or unexpected emergencies.
                </p>
            </div>

            {/* DEMO / SIMULATED DATA NOTICE */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertCircle size={22} className="shrink-0 text-amber-600 mt-0.5" />
                    <div className="space-y-2 text-xs text-amber-900 leading-relaxed">
                        <strong className="block text-sm font-bold text-amber-950">
                            Hackathon Demonstration & Data Disclaimer
                        </strong>
                        <p>
                            • <strong>Verified Real Data:</strong> Hospital names, hospital types (Government, Private, Trust), addresses, cities, districts, coordinates, verified facilities (ICU, MRI, Emergency units), and doctor OPD timings represent actual institutional facilities across Punjab.
                        </p>
                        <p>
                            • <strong>Simulated Demo Statistics:</strong> Specific treatment cost brackets (e.g. ₹30,000 – ₹50,000) and outcome success rates (e.g. 92.5%) are simulated benchmark figures provided in the hackathon dataset for feature illustration. They are <strong>not clinical accreditations or medical guarantees</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* ARCHITECTURE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-900">How HealthFind AI Works</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    HealthFind decouples natural language interpretation from hospital record searching. The AI service <strong>never queries or modifies the database directly</strong>; it acts purely as a semantic interpreter.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Sparkles size={16} className="text-amber-500" />
                            <span>1. AI Intent Parsing</span>
                        </div>
                        <p className="mt-2 text-slate-500">
                            Parses user queries like "knee surgery near Hoshiarpur under 50k" into structured filters: <code>location</code>, <code>treatment</code>, <code>budget</code>, <code>hospitalType</code>.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Server size={16} className="text-blue-600" />
                            <span>2. Backend Matching</span>
                        </div>
                        <p className="mt-2 text-slate-500">
                            Express controllers and Mongoose execute deterministic queries against the MongoDB database using indexed geospatial and attribute filters.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                            <CheckCircle size={16} className="text-emerald-600" />
                            <span>3. Transparent Matching</span>
                        </div>
                        <p className="mt-2 text-slate-500">
                            Every matching result includes an explainable breakdown showing why it satisfied your request, with no black-box scores.
                        </p>
                    </div>
                </div>
            </div>

            {/* PRIVACY & NO MANDATORY LOGIN */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Lock size={20} />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 space-y-1.5">
                        <strong className="block text-base font-bold text-slate-900">
                            Zero Barrier: No Mandatory Sign Up or Login
                        </strong>
                        <p>
                            Healthcare is time-critical. HealthFind does not enforce user accounts or passwords. Comparison shortlists and recent search history are stored purely on your device using client-side LocalStorage.
                        </p>
                    </div>
                </div>
            </div>

            {/* EMERGENCY SAFETY PROTOCOL */}
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 shadow-sm">
                <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                        <ShieldAlert size={20} />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 space-y-2">
                        <strong className="block text-base font-bold text-red-950">
                            Emergency Response Disclaimer
                        </strong>
                        <p>
                            HealthFind is an informational platform providing discovery, hospital telephone links, and Google Maps GPS navigation. It is not an ambulance dispatch service.
                        </p>
                        <p className="font-semibold text-red-900">
                            For urgent life-threatening crises in Punjab/India, please call <strong>108</strong> (Medical Ambulance) or <strong>112</strong> (National Emergency Helpline) immediately.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/emergency"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                            >
                                <span>Go to Emergency Mode</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
