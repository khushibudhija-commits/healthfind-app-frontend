import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, Building2, Search, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { api } from '../services/api.js';

export default function Treatments() {
    const navigate = useNavigate();
    const [treatments, setTreatments] = useState([]);
    const [status, setStatus] = useState('loading');
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.treatments()
            .then((res) => {
                setTreatments(res.data || []);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    }, []);

    const filtered = treatments.filter((t) => t.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Medical Procedures</span>
                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Treatments Directory</h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Explore available medical procedures and find verified hospitals across Punjab offering them.
                    </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search treatment..."
                        className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {status === 'loading' && <Loading message="Loading treatments directory..." />}
            {status === 'error' && (
                <ErrorMessage
                    title="Unable to Load Treatments"
                    message="Please check your backend connection."
                    onRetry={() => {
                        setStatus('loading');
                        api.treatments().then((r) => { setTreatments(r.data); setStatus('ready'); });
                    }}
                />
            )}

            {status === 'ready' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((item, index) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => navigate('/hospitals', { state: { treatment: item } })}
                            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                                        {item}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500">Click to view matching hospitals</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
