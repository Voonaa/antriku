import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Status() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="System Status - Antriku" />
            
            <nav className="p-6">
                <Link href="/" className="text-primary font-bold hover:underline">
                    &larr; Back to Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-black text-slate-900">System Status</h1>
                        <span className="flex items-center gap-2 bg-teal-50 text-primary border border-teal-200 px-4 py-2 rounded-full font-bold text-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            All Systems Operational
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="font-bold text-slate-700">Web Application</span>
                            <span className="text-primary font-bold">Operational</span>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="font-bold text-slate-700">WebSocket / Realtime Events</span>
                            <span className="text-primary font-bold">Operational</span>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="font-bold text-slate-700">Database Services</span>
                            <span className="text-primary font-bold">Operational</span>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="font-bold text-slate-700">Text-to-Speech Engine</span>
                            <span className="text-primary font-bold">Operational</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
