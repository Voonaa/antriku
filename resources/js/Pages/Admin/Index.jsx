import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function AdminIndex({ auth, metrics, lokets, layanans }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Admin Instansi</h2>}
        >
            <Head title="Admin Instansi" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Antrian</p>
                                <p className="text-3xl font-black text-gray-800">{metrics.total_hari_ini}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Selesai</p>
                                <p className="text-3xl font-black text-gray-800">{metrics.total_selesai}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Menunggu</p>
                                <p className="text-3xl font-black text-gray-800">{metrics.sisa_menunggu}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Rata-rata Waktu (mnt)</p>
                                <p className="text-3xl font-black text-gray-800">{metrics.avg_wait_time}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tabel Layanan */}
                        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Manajemen Layanan</h3>
                                <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                                    + Tambah Layanan
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white text-gray-500 text-sm border-b">
                                            <th className="p-4 font-semibold">Kode</th>
                                            <th className="p-4 font-semibold">Nama Layanan</th>
                                            <th className="p-4 font-semibold text-center">Estimasi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {layanans && layanans.map((layanan) => (
                                            <tr key={layanan.id} className="hover:bg-gray-50">
                                                <td className="p-4 font-bold text-gray-700">{layanan.kode_huruf}</td>
                                                <td className="p-4">{layanan.nama_layanan}</td>
                                                <td className="p-4 text-center">{layanan.estimasi_menit} mnt</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tabel Loket */}
                        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Manajemen Loket</h3>
                                <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                                    + Tambah Loket
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white text-gray-500 text-sm border-b">
                                            <th className="p-4 font-semibold">Loket</th>
                                            <th className="p-4 font-semibold">Layanan</th>
                                            <th className="p-4 font-semibold text-center">Status</th>
                                            <th className="p-4 font-semibold text-center">Dilayani</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {lokets.map((loket) => (
                                            <tr key={loket.id} className="hover:bg-gray-50">
                                                <td className="p-4 font-bold text-gray-700">Loket {loket.nomor_loket}</td>
                                                <td className="p-4">{loket.nama_layanan}</td>
                                                <td className="p-4 text-center">
                                                    {loket.status ? (
                                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Buka</span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">Tutup</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center font-bold text-indigo-600">{loket.jumlah_dilayani}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
