import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

export default function Welcome({ auth, tenants }) {
    const [showTenantModal, setShowTenantModal] = useState(false);
    const { t, lang, setLang } = useLang();

    return (
        <>
            <Head title="Antriku" />
            <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 selection:bg-primary selection:text-white relative overflow-hidden">
                
                {/* Subtle Radial Gradient Background like in screenshot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute w-[600px] h-[600px] bg-white rounded-full blur-2xl"></div>
                </div>

                {/* Header Navbar with Lang Toggle */}
                <nav className="absolute top-0 right-0 p-6 z-20 flex gap-4">
                    <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                        <button 
                            onClick={() => setLang('id')}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'id' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            ID
                        </button>
                        <button 
                            onClick={() => setLang('en')}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            EN
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
                    
                    {/* Centered Logo block */}
                    <div className="w-20 h-20 bg-[#F4F8F7] border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            {/* Simple ticket icon */}
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2V6c0-1.1-.9-2-2-2zm-8 12h-2v-2h2v2zm0-4h-2V9h2v3z"/>
                        </svg>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-3">
                        Antriku
                    </h1>
                    <p className="text-lg text-slate-500 mb-12 font-medium">
                        {t('welcome_title')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg w-full justify-center">
                        
                        {/* Button 1: Portal Warga */}
                        <button 
                            onClick={() => setShowTenantModal(true)}
                            className="flex-1 bg-primary hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('portal_warga')}
                        </button>

                        {/* Button 2: Login Pegawai */}
                        <Link 
                            href={auth.user ? route('dashboard') : route('login')}
                            className="flex-1 bg-white border-2 border-slate-200 text-primary hover:border-primary hover:bg-teal-50 font-bold py-4 px-6 rounded-xl shadow-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('login_pegawai')}
                        </Link>

                    </div>
                </div>

                {/* Footer */}
                <footer className="py-8 px-12 border-t border-slate-100 bg-[#F8FAFC] z-20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-800">
                        &copy; 2024 Antriku Queue Systems. {t('welcome_title')}.
                    </p>
                    <div className="flex gap-6 text-xs font-semibold text-slate-400">
                        <Link href={route('terms')} className="hover:text-slate-600 transition-colors">{t('terms')}</Link>
                        <Link href={route('privacy')} className="hover:text-slate-600 transition-colors">{t('privacy')}</Link>
                        <Link href={route('status')} className="hover:text-slate-600 transition-colors">{t('status')}</Link>
                        <Link href={route('support')} className="hover:text-slate-600 transition-colors">{t('support')}</Link>
                    </div>
                </footer>
            </div>

            {/* Modal Pilih Tenant untuk Portal Warga */}
            {showTenantModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white rounded-[2rem] p-8 max-w-xl w-full shadow-2xl relative border border-slate-100">
                        <button onClick={() => setShowTenantModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-2">{t('tenants')}</h2>
                        <p className="text-sm text-slate-500 mb-8">Pilih instansi untuk Kios atau TV.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-4">
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-black text-xl mb-3 border border-slate-100">
                                        {tenant.logo ? <img src={tenant.logo} className="w-8 h-8 object-contain" /> : tenant.nama_instansi.charAt(0)}
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-4 leading-tight">{tenant.nama_instansi}</h4>
                                    
                                    <div className="flex w-full gap-2 mt-auto">
                                        <a href={`/kiosk/${tenant.slug}`} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/50 text-xs font-bold py-2 rounded-lg transition-colors">
                                            Kios
                                        </a>
                                        <a href={`/tv/${tenant.slug}`} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:text-accent hover:border-accent/50 text-xs font-bold py-2 rounded-lg transition-colors">
                                            TV
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
