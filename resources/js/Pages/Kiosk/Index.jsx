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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <Ticket ticket={ticket} tenant={tenant} onClose={() => setTicket(null)} />
            </div>
        );
    }

    return (
        <>
            <Head title={`Kiosk Antrian - ${tenant.nama_instansi}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex flex-col items-center justify-center p-6 text-white">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        {tenant.logo && (
                            <img src={tenant.logo} alt="Logo Instansi" className="h-24 mx-auto mb-6" />
                        )}
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 shadow-sm">
                            Selamat Datang di
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-semibold text-blue-200">
                            {tenant.nama_instansi}
                        </h2>
                        <p className="mt-4 text-xl text-blue-100 opacity-80">
                            Silakan pilih layanan yang Anda butuhkan di bawah ini
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tenant.layanans.map((layanan) => (
                            <button
                                key={layanan.id}
                                disabled={loading}
                                onClick={() => takeTicket(layanan.id)}
                                className="group relative bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
                                <h3 className="text-3xl font-bold text-center relative z-10">
                                    {layanan.nama_layanan}
                                </h3>
                                <p className="text-center text-blue-200 mt-2 relative z-10 text-sm">
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
