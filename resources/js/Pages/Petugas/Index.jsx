import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function PetugasIndex({ auth, layanans, lokets, waitingQueues, activeQueues }) {
    const [selectedLayanan, setSelectedLayanan] = useState(layanans[0]?.id || '');
    const [selectedLoket, setSelectedLoket] = useState(lokets[0]?.id || '');
    
    // Setup Form for Calling Next Queue
    const { data, setData, post, processing, errors } = useForm({
        layanan_id: selectedLayanan,
        loket_id: selectedLoket,
    });

    const handleLayananChange = (e) => {
        setSelectedLayanan(e.target.value);
        setData('layanan_id', e.target.value);
    };

    const handleLoketChange = (e) => {
        setSelectedLoket(e.target.value);
        setData('loket_id', e.target.value);
    };

    const callNext = (e) => {
        e.preventDefault();
        post(route('petugas.call'), {
            preserveScroll: true,
        });
    };

    const markDone = (id) => {
        router.put(route('petugas.done', id), {}, { preserveScroll: true });
    };

    const skipQueue = (id) => {
        router.put(route('petugas.skip', id), {}, { preserveScroll: true });
    };

    // Filter waiting queues for selected layanan
    const filteredWaiting = waitingQueues.filter(q => q.layanan_id == selectedLayanan);
    
    // Find active queue for selected loket
    const currentActive = activeQueues.find(q => q.loket_id == selectedLoket);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Petugas Loket</h2>}
        >
            <Head title="Petugas Loket" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Panel Konfigurasi Loket */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-2xl border-l-4 border-indigo-500 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Status Penjagaan</h3>
                            <p className="text-sm text-gray-500">Pastikan Anda memilih loket dan layanan yang benar sebelum memanggil.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <select 
                                className="border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full md:w-48 font-semibold"
                                value={selectedLayanan} 
                                onChange={handleLayananChange}
                            >
                                {layanans.map(l => (
                                    <option key={l.id} value={l.id}>{l.nama_layanan}</option>
                                ))}
                            </select>

                            <select 
                                className="border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full md:w-32 font-semibold"
                                value={selectedLoket} 
                                onChange={handleLoketChange}
                            >
                                {lokets.map(l => (
                                    <option key={l.id} value={l.id}>Loket {l.nomor_loket}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Panel Kontrol Utama */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Layar Nomor Aktif */}
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-3xl border border-gray-100">
                                <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Sedang Dilayani</p>
                                    
                                    {currentActive ? (
                                        <div className="animate-pulse">
                                            <h1 className="text-8xl md:text-9xl font-black text-indigo-600 mb-2 tracking-tighter">
                                                {currentActive.nomor_lengkap}
                                            </h1>
                                            <p className="text-lg font-semibold text-gray-600">Layanan: {currentActive.layanan.nama_layanan}</p>
                                            <p className="text-sm text-gray-400 mt-2">Dipanggil pada: {new Date(currentActive.waktu_panggil).toLocaleTimeString()}</p>
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <h1 className="text-6xl font-bold text-gray-300 mb-4">--</h1>
                                            <p className="text-gray-500 font-medium">Belum ada antrian yang dipanggil di loket ini.</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Tombol Aksi */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
                                    {currentActive ? (
                                        <>
                                            <button 
                                                onClick={() => markDone(currentActive.id)}
                                                className="flex-1 min-w-[140px] bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-colors text-lg"
                                            >
                                                ✅ Selesai
                                            </button>
                                            <button 
                                                onClick={() => skipQueue(currentActive.id)}
                                                className="flex-1 min-w-[140px] bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-colors text-lg"
                                            >
                                                ⏭️ Lewati
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={callNext}
                                            disabled={processing || filteredWaiting.length === 0}
                                            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-5 px-8 rounded-2xl shadow-lg transition-transform transform active:scale-95 text-xl tracking-wide uppercase"
                                        >
                                            {filteredWaiting.length === 0 ? 'Antrian Kosong' : '📢 Panggil Selanjutnya'}
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Panel Waiting List */}
                        <div className="bg-white shadow-sm sm:rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full max-h-[600px]">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Daftar Tunggu</h3>
                                <p className="text-sm text-gray-500">{filteredWaiting.length} orang mengantri untuk layanan ini.</p>
                            </div>
                            
                            <div className="overflow-y-auto flex-1 p-2">
                                {filteredWaiting.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {filteredWaiting.map((queue, index) => (
                                            <li key={queue.id} className={`p-4 rounded-xl ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className={`font-black text-xl ${index === 0 ? 'text-blue-700' : 'text-gray-800'}`}>
                                                            {queue.nomor_lengkap}
                                                        </span>
                                                        <p className="text-xs text-gray-400">
                                                            Tunggu: {Math.round((new Date() - new Date(queue.created_at)) / 60000)} mnt
                                                        </p>
                                                    </div>
                                                    {index === 0 && (
                                                        <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Next</span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center">
                                        <p>Belum ada warga yang mengambil tiket untuk layanan ini.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
