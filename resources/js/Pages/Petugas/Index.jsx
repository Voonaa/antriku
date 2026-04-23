import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function PetugasIndex({ auth, layanans, lokets, waitingQueues, activeQueues }) {
    const { flash } = usePage().props;
    const [selectedLayanan, setSelectedLayanan] = useState(layanans[0]?.id || '');
    const [selectedLoket, setSelectedLoket] = useState(lokets[0]?.id || '');

    // Form untuk memanggil antrian berikutnya
    const { data, setData, post, processing } = useForm({
        layanan_id: layanans[0]?.id || '',
        loket_id: lokets[0]?.id || '',
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
        post(route('petugas.call'), { preserveScroll: true });
    };

    const markDone  = (id) => router.put(route('petugas.done', id), {}, { preserveScroll: true });
    const skipQueue = (id) => router.put(route('petugas.skip', id), {}, { preserveScroll: true });
    const recall    = (id) => router.put(route('petugas.recall', id), {}, { preserveScroll: true });

    const toggleBreak = () => {
        if (!selectedLoket) return;
        router.post(route('petugas.toggle-break'), { loket_id: selectedLoket }, { preserveScroll: true });
    };

    // Filter antrian yang sedang aktif untuk loket yang dipilih
    const currentActive = activeQueues.find(q => q.loket_id == selectedLoket);

    // Filter waiting list untuk layanan yang dipilih
    const filteredWaiting = waitingQueues.filter(q => q.layanan_id == selectedLayanan);

    // Cek status loket yang dipilih
    const currentLoket = lokets.find(l => l.id == selectedLoket);
    const isOnBreak = currentLoket ? !currentLoket.status : false;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Petugas Loket</h2>
                    {/* Tombol Istirahat di pojok kanan header */}
                    {selectedLoket && (
                        <button
                            onClick={toggleBreak}
                            className={`flex items-center gap-2 font-bold py-2 px-5 rounded-xl shadow-sm transition-colors text-sm ${
                                isOnBreak
                                    ? 'bg-green-100 hover:bg-green-200 text-green-800 border border-green-300'
                                    : 'bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300'
                            }`}
                        >
                            {isOnBreak ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Selesai Istirahat
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Mulai Istirahat
                                </>
                            )}
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Petugas Loket" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl text-sm font-medium">
                            ✅ {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-3 rounded-xl text-sm font-medium">
                            ⚠️ {flash.error}
                        </div>
                    )}

                    {/* Status Loket Istirahat Banner */}
                    {isOnBreak && (
                        <div className="bg-orange-50 border-2 border-orange-300 text-orange-800 px-5 py-4 rounded-2xl flex items-center gap-3 font-bold">
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            <span>Loket {currentLoket?.nomor_loket} sedang ISTIRAHAT — sistem tidak menerima panggilan baru.</span>
                        </div>
                    )}

                    {/* Panel Konfigurasi */}
                    <div className="bg-white p-6 shadow-sm sm:rounded-2xl border-l-4 border-indigo-500 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Posisi Penjagaan Saya</h3>
                            <p className="text-sm text-gray-500">Pilih loket dan layanan yang Anda tangani hari ini.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <select
                                className="border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full md:w-52 font-semibold"
                                value={selectedLayanan}
                                onChange={handleLayananChange}
                            >
                                {layanans.map(l => (
                                    <option key={l.id} value={l.id}>{l.nama_layanan}</option>
                                ))}
                            </select>
                            <select
                                className="border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full md:w-36 font-semibold"
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
                        <div className="lg:col-span-2 space-y-4">

                            {/* Layar Nomor Aktif */}
                            <div className="bg-white overflow-hidden shadow-xl sm:rounded-3xl border border-gray-100">
                                <div className="p-8 text-center bg-gradient-to-b from-gray-50 to-white">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Sedang Dilayani di Loket {currentLoket?.nomor_loket || '-'}</p>

                                    {currentActive ? (
                                        <div>
                                            <h1 className="text-8xl md:text-9xl font-black text-indigo-600 mb-2 tracking-tighter animate-pulse">
                                                {currentActive.nomor_lengkap}
                                            </h1>
                                            <p className="text-lg font-semibold text-gray-600">Layanan: {currentActive.layanan?.nama_layanan}</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Dipanggil: {new Date(currentActive.waktu_panggil).toLocaleTimeString('id-ID')}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-12">
                                            <h1 className="text-6xl font-bold text-gray-200 mb-4">--</h1>
                                            <p className="text-gray-400 font-medium">Belum ada antrian aktif di loket ini.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tombol Aksi */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                    {currentActive ? (
                                        /* Antrian sedang aktif: tampilkan 3 tombol */
                                        <div className="grid grid-cols-3 gap-3">
                                            {/* Panggil Lagi */}
                                            <button
                                                onClick={() => recall(currentActive.id)}
                                                className="flex flex-col items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-4 px-3 rounded-2xl shadow-md transition-all transform active:scale-95"
                                            >
                                                <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                                                <span className="text-sm">Panggil Lagi</span>
                                            </button>

                                            {/* Selesai */}
                                            <button
                                                onClick={() => markDone(currentActive.id)}
                                                className="flex flex-col items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-3 rounded-2xl shadow-md transition-all transform active:scale-95"
                                            >
                                                <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                <span className="text-sm">Selesai</span>
                                            </button>

                                            {/* Lewati */}
                                            <button
                                                onClick={() => skipQueue(currentActive.id)}
                                                className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-3 rounded-2xl shadow-md transition-all transform active:scale-95"
                                            >
                                                <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                                                <span className="text-sm">Lewati</span>
                                            </button>
                                        </div>
                                    ) : (
                                        /* Tidak ada antrian aktif: tampilkan tombol Panggil Selanjutnya */
                                        <button
                                            onClick={callNext}
                                            disabled={processing || filteredWaiting.length === 0 || isOnBreak}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-5 px-8 rounded-2xl shadow-lg transition-transform transform active:scale-95 text-xl tracking-wide uppercase"
                                        >
                                            {isOnBreak
                                                ? '⏸ Loket Istirahat'
                                                : filteredWaiting.length === 0
                                                    ? 'Antrian Kosong'
                                                    : '📢 Panggil Selanjutnya'
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Panel Waiting List */}
                        <div className="bg-white shadow-sm sm:rounded-3xl border border-gray-100 overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
                            <div className="p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                                <h3 className="text-lg font-bold text-gray-800">Daftar Tunggu</h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    <span className="font-bold text-indigo-600">{filteredWaiting.length}</span> orang menunggu layanan ini.
                                </p>
                            </div>

                            <div className="overflow-y-auto flex-1 p-2">
                                {filteredWaiting.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {filteredWaiting.map((queue, index) => (
                                            <li
                                                key={queue.id}
                                                className={`p-4 rounded-xl ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className={`font-black text-xl ${index === 0 ? 'text-blue-700' : 'text-gray-800'}`}>
                                                            {queue.nomor_lengkap}
                                                        </span>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            Tunggu ±{Math.round((new Date() - new Date(queue.created_at)) / 60000)} mnt
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
