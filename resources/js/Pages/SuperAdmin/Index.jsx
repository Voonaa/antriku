import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function SuperAdminIndex({ auth, tenants }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        nama_instansi: '',
        slug: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Mocking submit since backend doesn't have the create endpoint yet
        alert('Fitur tambah tenant belum diimplementasi di backend. Data: ' + data.nama_instansi);
        setShowModal(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Super Admin</h2>}
        >
            <Head title="Super Admin" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Stat Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                            <div>
                                <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Total Instansi Aktif</p>
                                <p className="text-4xl font-black">{tenants.length}</p>
                            </div>
                            <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                    </div>

                    {/* Tabel Master Data Tenant */}
                    <div className="bg-white shadow-sm sm:rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Master Data Instansi (Tenants)</h3>
                                <p className="text-sm text-gray-500">Daftar semua klien yang menggunakan platform Antriku.</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Tambah Instansi
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-gray-500 text-sm border-b">
                                        <th className="p-4 font-semibold w-16">ID</th>
                                        <th className="p-4 font-semibold">Nama Instansi</th>
                                        <th className="p-4 font-semibold">Slug (URL)</th>
                                        <th className="p-4 font-semibold text-center">Jml Layanan</th>
                                        <th className="p-4 font-semibold text-center">Jml Loket</th>
                                        <th className="p-4 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tenants.map((tenant) => (
                                        <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-500">#{tenant.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {tenant.logo ? (
                                                        <img src={tenant.logo} className="w-8 h-8 rounded-full border border-gray-200" alt="Logo" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {tenant.nama_instansi.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-gray-800">{tenant.nama_instansi}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 font-mono text-sm">{tenant.slug}</td>
                                            <td className="p-4 text-center font-semibold text-indigo-600">{tenant.layanans_count}</td>
                                            <td className="p-4 text-center font-semibold text-blue-600">{tenant.lokets_count}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-sm text-indigo-600 hover:text-indigo-900 font-bold mr-3">Edit</button>
                                                <button className="text-sm text-red-600 hover:text-red-900 font-bold">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {tenants.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-400">Belum ada data Instansi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Tambah Tenant (Mockup) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Instansi Baru</h2>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Instansi</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                                    placeholder="Contoh: Dinas Pendapatan Daerah"
                                    value={data.nama_instansi}
                                    onChange={e => setData('nama_instansi', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Slug URL</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                                    placeholder="Contoh: dispenda"
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value)}
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50"
                            >
                                Simpan Instansi
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
