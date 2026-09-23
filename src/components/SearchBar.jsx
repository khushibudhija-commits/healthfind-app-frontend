import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

export default function SearchBar({
    onSearch,
    initialValue = '',
    placeholder = 'Find government knee hospitals near Hoshiarpur under 50k with MRI...',
    compact = false
}) {
    const [query, setQuery] = useState(initialValue);

    const submit = (event) => {
        event.preventDefault();
        if (query.trim()) onSearch(query.trim());
    };

    const clear = () => {
        setQuery('');
    };

    return (
        <form
            onSubmit={submit}
            className={`group relative flex w-full items-center rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-900/5 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 ${
                compact ? 'p-1.5' : 'p-2 sm:p-2.5'
            }`}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Sparkles size={18} className="animate-pulse" />
            </div>

            <input
                type="text"
                aria-label="Describe what you need in natural language"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none sm:text-base"
            />

            {query && (
                <button
                    type="button"
                    onClick={clear}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                    aria-label="Clear input"
                >
                    <X size={16} />
                </button>
            )}

            <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 sm:px-6 sm:text-sm"
            >
                <Search size={16} />
                <span>Search</span>
            </button>
        </form>
    );
}
