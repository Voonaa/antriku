import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Welcome({ canLogin, tenants }) {
    return (
        <>
            <Head title="Selamat Datang - Antriku" />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 flex flex-col items-center justify-center p-6 text-white font-sans">
                
                {/* Header Logo & Judul */}
                <div className="text-center mb-16">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                        Antriku
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-200 font-medium max-w-2xl mx-auto">
                        Sistem Antrian Digital Multi-Tenant Modern. Mengelola antrian lebih pintar, cepat, dan profesional.
                    </p>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Opsi 1: Kiosk Warga */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
                        
                        <div className="flex items-center space-x-4 mb-6 relative z-10">
                            <div className="p-4 bg-blue-500 rounded-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Masuk sebagai Warga (Kiosk)</h2>
                        </div>
                        <p className="text-blue-100 mb-8 relative z-10">Pilih instansi tujuan Anda di bawah ini untuk mengambil nomor antrian secara digital.</p>
                        
                        <div className="grid grid-cols-1 gap-3 relative z-10 mt-auto">
                            {tenants && tenants.map(tenant => (
                                <Link 
                                    key={tenant.id} 
                                    href={route('kiosk.show', tenant.slug)}
                                    className="bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-6 rounded-xl text-center transition-colors shadow-sm flex items-center justify-between group"
                                >
                                    <span className="text-lg">{tenant.nama_instansi}</span>
                                    <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Opsi 2: Login Pegawai */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
                        
                        <div className="flex items-center space-x-4 mb-6 relative z-10">
                            <div className="p-4 bg-indigo-500 rounded-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Login Pegawai & Admin</h2>
                        </div>
                        <p className="text-indigo-100 mb-8 relative z-10">Area khusus staf untuk memanggil antrian, melihat metrik kinerja, dan mengatur sistem.</p>
                        
                        <div className="mt-auto relative z-10">
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="w-full flex justify-center py-5 px-6 border-2 border-white/30 rounded-xl text-xl font-bold text-white bg-transparent hover:bg-white hover:text-indigo-900 transition-colors shadow-sm"
                                >
                                    Masuk ke Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center text-sm text-blue-300 opacity-60">
                    &copy; {new Date().getFullYear()} Antriku Queueing System.
                </div>
            </div>
        </>
    );
}
