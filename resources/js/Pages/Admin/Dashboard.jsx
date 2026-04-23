import { Head } from '@inertiajs/react';
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminDashboard({ auth, metrics, lokets }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Laporan Instansi</h2>}
        >
            <Head title="Analytics Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Summary */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Performa Layanan Hari Ini</h3>
                        <p className="text-gray-500 mt-1">Ringkasan aktivitas antrian dan kinerja loket secara real-time.</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {/* Total Antrian */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Antrian</p>
                                <p className="text-3xl font-black text-gray-900">{metrics.total_hari_ini}</p>
                            </div>
                        </div>

                        {/* Selesai */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-4 bg-green-50 rounded-xl">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Selesai</p>
                                <p className="text-3xl font-black text-gray-900">{metrics.total_selesai}</p>
                            </div>
                        </div>

                        {/* Menunggu */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-4 bg-yellow-50 rounded-xl">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Sisa Menunggu</p>
                                <p className="text-3xl font-black text-gray-900">{metrics.sisa_menunggu}</p>
                            </div>
                        </div>

                        {/* Rata-rata Tunggu */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Rata-rata Tunggu</p>
                                <div className="flex items-baseline space-x-1">
                                    <p className="text-3xl font-black text-gray-900">{metrics.avg_wait_time}</p>
                                    <span className="text-gray-500 text-sm font-medium">menit</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Loket */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">Status & Kinerja Loket</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Nomor Loket
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Layanan
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Warga Dilayani Hari Ini
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {lokets.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                Belum ada data loket untuk instansi ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        lokets.map((loket) => (
                                            <tr key={loket.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-base font-semibold text-gray-900">{loket.nomor_loket}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">{loket.nama_layanan}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {loket.status ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full"></span>
                                                            Buka
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <span className="w-2 h-2 mr-1.5 bg-red-500 rounded-full"></span>
                                                            Tutup
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-base font-bold text-gray-900">
                                                        {loket.jumlah_dilayani} <span className="text-sm font-normal text-gray-500 ml-1">orang</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
