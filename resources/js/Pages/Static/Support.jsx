import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Support() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Support - Antriku" />
            
            <nav className="p-6">
                <Link href="/" className="text-primary font-bold hover:underline">
                    &larr; Back to Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 text-center">
                    <div className="w-20 h-20 bg-teal-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4">How can we help?</h1>
                    <p className="text-slate-500 mb-8 font-medium">Get in touch with our support team or browse our documentation.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="p-6 border border-slate-200 rounded-2xl hover:border-primary transition-colors cursor-pointer">
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Email Support</h3>
                            <p className="text-slate-500 text-sm mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                            <a href="mailto:support@antriku.id" className="text-primary font-bold">support@antriku.id</a>
                        </div>
                        <div className="p-6 border border-slate-200 rounded-2xl hover:border-primary transition-colors cursor-pointer">
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Documentation</h3>
                            <p className="text-slate-500 text-sm mb-4">Read our guides on how to set up queues and manage counters.</p>
                            <a href="#" className="text-primary font-bold">View Docs &rarr;</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
