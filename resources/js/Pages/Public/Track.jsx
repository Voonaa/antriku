import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function TrackQueue({ ticket, sisaAntrian, currentServing, tenant }) {
    const [liveSisa, setLiveSisa] = useState(sisaAntrian);
    const [liveServing, setLiveServing] = useState(currentServing);
    const [myStatus, setMyStatus] = useState(ticket.status);

    useEffect(() => {
        // Listen to Public Channel for Queue Updates
        const channel = window.Echo.channel(`public.tenant.${tenant.id}`);

        channel.listen('QueueCalled', (e) => {
            const calledAntrian = e.antrian;

            // Jika yang dipanggil adalah nomor layanan yang SAMA dengan tiket kita
            if (calledAntrian.layanan_id === ticket.layanan_id) {
                // Update widget antrian yang sedang dilayani
                setLiveServing(calledAntrian);

                // Jika yang dipanggil adalah tiket milik KITA SENDIRI
                if (calledAntrian.id === ticket.id) {
                    setMyStatus(calledAntrian.status);
                    
                    // Vibration API (bergetar 3x)
                    if ('vibrate' in navigator) {
                        navigator.vibrate([500, 300, 500, 300, 500]);
                    }
                } 
                // Jika yang dipanggil tiket orang lain, dan status kita masih waiting
                else if (myStatus === 'waiting') {
                    // Refresh data sisa antrian via API (Inertia reload) agar akurat
                    router.reload({ only: ['sisaAntrian'], onSuccess: (page) => {
                        setLiveSisa(page.props.sisaAntrian);
                    }});
                }
            }
        });

        return () => {
            channel.stopListening('QueueCalled');
            window.Echo.leave(`public.tenant.${tenant.id}`);
        };
    }, [tenant.id, ticket.id, ticket.layanan_id, myStatus]);

    // UI Helper for Status
    const renderStatusBadge = () => {
        if (myStatus === 'waiting') return <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">⏳ Menunggu</span>;
        if (myStatus === 'calling' || myStatus === 'serving') return <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">📢 Sedang Dipanggil</span>;
        if (myStatus === 'done') return <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">✅ Selesai</span>;
        return <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">{myStatus}</span>;
    };

    return (
        <>
            <Head title={`Live Tracking - ${ticket.nomor_lengkap}`} />
            
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
                
                {/* Header Instansi */}
                <div className="w-full max-w-md text-center mt-4 mb-6">
                    {tenant.logo && <img src={tenant.logo} alt="Logo" className="h-16 mx-auto mb-3" />}
                    <h1 className="text-xl font-extrabold text-gray-800 uppercase tracking-tight">{tenant.nama_instansi}</h1>
                    <p className="text-sm text-gray-500 font-medium">{ticket.layanan?.nama_layanan}</p>
                </div>

                {/* Tiket Utama */}
                <div className={`w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-t-8 transition-colors duration-500 ${myStatus === 'calling' ? 'border-blue-500 bg-blue-50/30' : myStatus === 'done' ? 'border-green-500' : 'border-indigo-500'}`}>
                    <div className="p-8 text-center">
                        <p className="text-sm text-gray-500 font-semibold mb-2">NOMOR ANTRIAN ANDA</p>
                        <h2 className={`text-6xl font-black mb-6 tracking-tighter ${myStatus === 'calling' ? 'text-blue-600' : 'text-gray-900'}`}>
                            {ticket.nomor_lengkap}
                        </h2>
                        
                        <div className="flex justify-center mb-4">
                            {renderStatusBadge()}
                        </div>
                    </div>
                </div>

                {/* Widget Info (Hanya tampil jika masih waiting) */}
                {myStatus === 'waiting' && (
                    <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-6">
                        {/* Sisa Antrian */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Sisa di Depan</p>
                            <p className="text-4xl font-black text-indigo-600">{liveSisa}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Orang</p>
                        </div>
                        
                        {/* Sedang Dilayani */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Dipanggil</p>
                            <p className="text-4xl font-black text-gray-800">{liveServing ? liveServing.nomor_lengkap : '-'}</p>
                            <p className="text-[10px] text-gray-400 mt-1">Loket {liveServing?.loket?.nomor_loket || '-'}</p>
                        </div>
                    </div>
                )}

                {/* Layar Sedang Dipanggil / Selesai */}
                {(myStatus === 'calling' || myStatus === 'serving') && (
                    <div className="w-full max-w-md bg-blue-600 rounded-2xl p-6 shadow-lg text-center text-white mb-6 animate-bounce">
                        <p className="text-sm font-medium mb-1 opacity-90">GILIRAN ANDA TIBA!</p>
                        <p className="text-2xl font-bold">Silakan menuju Loket {liveServing?.loket?.nomor_loket}</p>
                    </div>
                )}

                {myStatus === 'done' && (
                    <div className="w-full max-w-md bg-green-50 rounded-2xl p-6 border border-green-200 text-center text-green-800 mb-6">
                        <p className="font-bold mb-1">Pelayanan Selesai</p>
                        <p className="text-sm">Terima kasih telah menggunakan layanan kami.</p>
                    </div>
                )}

                {/* Footer Info */}
                <div className="w-full max-w-md text-center mt-auto pb-4">
                    <p className="text-xs text-gray-400">
                        Halaman ini akan diperbarui secara otomatis. Tidak perlu di-refresh.
                    </p>
                </div>

            </div>
        </>
    );
}
