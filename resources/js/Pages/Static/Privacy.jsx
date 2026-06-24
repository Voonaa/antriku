import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Head title="Privacy Policy - Antriku" />
            
            <nav className="p-6">
                <Link href="/" className="text-primary font-bold hover:underline">
                    &larr; Back to Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto py-12 px-6">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
                    <h1 className="text-4xl font-black text-slate-900 mb-6">Privacy Policy</h1>
                    <p className="text-slate-500 mb-8 font-medium">Last updated: April 24, 2026</p>

                    <div className="space-y-6 text-slate-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h2>
                            <p>We collect information that you provide directly to us when setting up tenants, services, and counters. This includes names, emails, and organizational details.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Your Information</h2>
                            <p>Your information is used solely to provide and improve the Antriku queue management service, process your queue tickets, and communicate with you about your account.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Data Security</h2>
                            <p>We implement robust security measures designed to protect your information. Your queue data is stored securely and is only accessible to authorized personnel within your organization.</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
