import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Welcome({ auth, tenants }) {
    const [showTenantModal, setShowTenantModal] = useState(false);

    return (
        <>
            <Head title="Selamat Datang" />
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-dark selection:bg-accent selection:text-white">
                
                {/* Header Navbar */}
                <nav className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm relative z-20">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/storage/logo.png" 
                            alt="Antriku Logo" 
                            className="h-10 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <span className="hidden text-2xl font-black text-primary tracking-tight">Antriku</span>
                    </div>
                    <div>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-bold text-primary hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-5 py-2.5 rounded-full transition-colors border border-teal-100">
                                Buka Dashboard
                            </Link>
                        ) : (
                            <Link href={route('login')} className="text-sm font-bold text-slate-600 hover:text-slate-900 px-5 py-2.5 rounded-full transition-colors">
                                Login Staff
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center relative z-10">
                    {/* Background decor */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50 via-slate-50 to-slate-50 opacity-70 pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl w-full">
                        <img 
                            src="/storage/logo.png" 
                            alt="Antriku" 
                            className="h-24 mx-auto mb-8 drop-shadow-sm object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-4">
                            Sistem Antrian <span className="text-primary">Digital Pintar</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
                            Solusi antrian modern untuk Instansi. Lebih teratur, lebih cepat, dan tanpa ribet.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            
                            {/* Card 1: Portal Warga */}
                            <button 
                                onClick={() => setShowTenantModal(true)}
                                className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 text-left flex items-start gap-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                <div className="w-16 h-16 bg-teal-50 text-primary rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Portal Warga</h3>
                                    <p className="text-slate-500 text-sm font-medium">Akses layar Kios tiket sentuh dan Monitor TV antrian secara publik.</p>
                                </div>
                            </button>

                            {/* Card 2: Login Pegawai */}
                            <Link 
                                href={route('login')}
                                className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-300 text-left flex items-start gap-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                <div className="w-16 h-16 bg-orange-50 text-accent rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Login Pegawai</h3>
                                    <p className="text-slate-500 text-sm font-medium">Masuk ke Dashboard manajemen, panggil antrian, dan atur layanan.</p>
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white z-20 relative">
                    &copy; {new Date().getFullYear()} Antriku System. Ditenagai oleh Laravel & React.
                </footer>
            </div>

            {/* Modal Pilih Tenant untuk Portal Warga */}
            {showTenantModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white rounded-[2rem] p-8 max-w-xl w-full shadow-2xl relative border border-slate-100">
                        <button onClick={() => setShowTenantModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Pilih Instansi</h2>
                        <p className="text-sm text-slate-500 mb-8">Pilih instansi mana yang layar Kios atau TV-nya ingin Anda buka.</p>
                        
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
                            {tenants.length === 0 && (
                                <div className="col-span-full py-8 text-center text-slate-400 italic">Belum ada instansi yang terdaftar.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
