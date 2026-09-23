
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function ErrorMessage({
    title = "Something went wrong",
    message = "We couldn't find the page you're looking for.",
}) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6 relative overflow-hidden">

            {/* Background Decorations */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-60"></div>

            <div className="relative max-w-3xl w-full text-center">

                {/* Error Icon */}
                <div className="flex justify-center mb-7">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center">
                        <AlertCircle
                            size={42}
                            strokeWidth={1.7}
                            className="text-slate-500"
                        />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
                    {title}
                </h1>

                {/* Message */}
                <p className="max-w-xl mx-auto mt-5 text-slate-500 text-base md:text-lg leading-relaxed">
                    {message}
                </p>

              
                {/* Bottom Message */}
                <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Please try again </span>
                </div>

            </div>
        </div>
    );
}