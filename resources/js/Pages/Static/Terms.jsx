import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { useLang } from '@/Contexts/LangContext';

export default function Terms() {
    const { t } = useLang();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Terms of Service - Antriku" />
            
            <nav className="p-6">
                <Link href="/" className="text-primary font-bold hover:underline">
                    &larr; Back to Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
                    <h1 className="text-4xl font-black text-slate-900 mb-6">Terms of Service</h1>
                    <p className="text-slate-500 mb-8 font-medium">Last updated: April 24, 2026</p>

                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing or using Antriku's queue management system, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Service Usage</h2>
                            <p>Antriku is provided as a SaaS platform for queue management. You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Data Integrity</h2>
                            <p>You are solely responsible for the data you input into the system. Antriku ensures that your queue data is kept secure, but we are not liable for any data loss resulting from unauthorized access to your account.</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
