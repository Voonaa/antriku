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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 print:p-0 print:bg-white print:items-start print:justify-start">
                <Ticket ticket={ticket} tenant={tenant} onClose={() => setTicket(null)} />
            </div>
        );
    }

    return (
        <>
            <Head title={`Kiosk Antrian - ${tenant.nama_instansi}`} />
            
            <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-800 flex flex-col items-center justify-center p-6 text-white">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-12">
                        {tenant.logo && (
                            <img src={tenant.logo} alt="Logo Instansi" className="h-28 mx-auto mb-6" />
                        )}
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 shadow-sm">
                            Selamat Datang di
                        </h1>
                        <h2 className="text-4xl md:text-5xl font-semibold text-blue-200">
                            {tenant.nama_instansi}
                        </h2>
                        <p className="mt-6 text-2xl text-blue-100 opacity-80">
                            Silakan sentuh layar pada layanan yang Anda butuhkan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                        {tenant.layanans.map((layanan) => (
                            <button
                                key={layanan.id}
                                disabled={loading}
                                onClick={() => takeTicket(layanan.id)}
                                className="group relative h-48 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 blur-2xl"></div>
                                
                                {/* Ikon Dinamis Sederhana */}
                                <svg className="w-16 h-16 mb-4 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                
                                <h3 className="text-4xl font-extrabold text-center relative z-10">
                                    {layanan.nama_layanan}
                                </h3>
                                <p className="text-center text-blue-200 mt-3 relative z-10 text-lg">
                                    Estimasi: {layanan.estimasi_menit} menit
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
