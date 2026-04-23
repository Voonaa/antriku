import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth, layanans, lokets, waitingQueues, activeQueues }) {
    const [selectedLayanan, setSelectedLayanan] = useState(layanans[0]?.id || '');
    const [selectedLoket, setSelectedLoket] = useState(lokets[0]?.id || '');
    const [processing, setProcessing] = useState(false);

    const callNext = () => {
        if (!selectedLayanan || !selectedLoket) {
            alert('Pilih Layanan dan Loket terlebih dahulu!');
            return;
        }

        setProcessing(true);
        router.post(route('petugas.call'), {
            layanan_id: selectedLayanan,
            loket_id: selectedLoket,
        }, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const markAsDone = (id) => {
        router.put(route('petugas.done', id), {}, { preserveScroll: true });
    };

    const skipQueue = (id) => {
        if (confirm('Yakin ingin melewati antrian ini?')) {
            router.put(route('petugas.skip', id), {}, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Petugas</h2>}
        >
            <Head title="Dashboard Petugas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Panel Kontrol Pemanggilan */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg col-span-2">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Kontrol Pemanggilan</h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Layanan</label>
                                        <select 
                                            value={selectedLayanan} 
                                            onChange={(e) => setSelectedLayanan(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        >
                                            {layanans.map(l => (
                                                <option key={l.id} value={l.id}>{l.nama_layanan} ({waitingQueues.filter(q => q.layanan_id === l.id).length} menunggu)</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Loket Anda</label>
                                        <select 
                                            value={selectedLoket} 
                                            onChange={(e) => setSelectedLoket(e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        >
                                            {lokets.map(l => (
                                                <option key={l.id} value={l.id}>{l.nomor_loket}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={callNext}
                                    disabled={processing || waitingQueues.filter(q => q.layanan_id == selectedLayanan).length === 0}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                                >
                                    {processing ? 'Memproses...' : '📢 PANGGIL SELANJUTNYA'}
                                </button>
                            </div>
                        </div>

                        {/* Panel Status Sisa Antrian */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200 h-full flex flex-col justify-center items-center">
                                <h3 className="text-gray-500 font-medium mb-2 uppercase tracking-wide text-sm">Sisa Antrian Global</h3>
                                <span className="text-7xl font-black text-gray-800">{waitingQueues.length}</span>
                                <p className="text-gray-400 mt-2 text-sm">Orang sedang menunggu</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Antrian Aktif */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Antrian Sedang Dilayani</h3>
                            
                            {activeQueues.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    Belum ada antrian yang sedang Anda layani.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layanan</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loket</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Panggil</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {activeQueues.map((queue) => (
                                                <tr key={queue.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-xl font-bold text-blue-600">{queue.nomor_lengkap}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{queue.layanan?.nama_layanan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{queue.loket?.nomor_loket}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(queue.waktu_panggil).toLocaleTimeString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <button 
                                                            onClick={() => markAsDone(queue.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            Selesai ✓
                                                        </button>
                                                        <button 
                                                            onClick={() => skipQueue(queue.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Lewati ⏭
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
