import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import Ticket from './Ticket';

export default function KioskIndex({ tenant }) {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);

    const takeTicket = async (layananId) => {
        setLoading(true);
        try {
            const response = await axios.post(route('kiosk.ticket'), {
                tenant_id: tenant.id,
                layanan_id: layananId,
            });
            
            if (response.data.success) {
                setTicket(response.data.ticket);
            }
        } catch (error) {
            console.error("Gagal mengambil tiket:", error);
            alert("Terjadi kesalahan saat mengambil tiket.");
        } finally {
            setLoading(false);
        }
    };

    if (ticket) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 print:p-0 print:bg-white print:items-start print:justify-start">
                <Ticket ticket={ticket} tenant={tenant} onClose={() => setTicket(null)} />
            </div>
        );
    }

    return (
        <>
            <Head title={`Kiosk Antrian - ${tenant.nama_instansi}`} />
            
            <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-accent selection:text-white">
                {/* Header Section */}
                <div className="bg-primary pt-12 pb-24 px-6 text-white text-center shadow-lg rounded-b-[4rem] relative z-10">
                    <img 
                        src="/storage/logo.png" 
                        alt="Logo Instansi" 
                        className="h-28 mx-auto mb-6 object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div className="hidden mb-6">
                        <span className="text-4xl font-black bg-white text-primary px-6 py-2 rounded-2xl">Antriku</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">
                        Selamat Datang
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold opacity-90">
                        {tenant.nama_instansi}
                    </h2>
                    <p className="mt-8 text-xl md:text-2xl font-medium bg-white/20 inline-block px-8 py-3 rounded-full backdrop-blur-sm">
                        👆 Silakan sentuh layar pada layanan yang Anda tuju
                    </p>
                </div>

                {/* Content Section - Cards overlapping header slightly */}
                <div className="flex-grow px-6 md:px-12 pb-12 -mt-12 relative z-20 flex items-center justify-center">
                    <div className="max-w-7xl w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
                            {tenant.layanans.map((layanan) => (
                                <button
                                    key={layanan.id}
                                    disabled={loading}
                                    onClick={() => takeTicket(layanan.id)}
                                    className="group h-64 bg-white rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-200 shadow-2xl active:scale-95 focus:outline-none focus:ring-8 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed border-4 border-transparent hover:border-accent/10"
                                >
                                    {/* Icon Container */}
                                    <div className="w-20 h-20 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                                        </svg>
                                    </div>
                                    
                                    <h3 className="text-4xl md:text-5xl font-bold text-dark text-center leading-tight mb-3">
                                        {layanan.nama_layanan}
                                    </h3>
                                    
                                    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-lg font-bold">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Estimasi {layanan.estimasi_menit} menit
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
