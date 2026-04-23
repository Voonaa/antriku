import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

function Modal({ show, title, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
}

function InputField({ label, id, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <input id={id} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500" {...props} />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function SuperAdminIndex({ auth, tenants }) {
    const { flash } = usePage().props;
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    // Form: Tambah Tenant
    const tenantForm = useForm({ nama_instansi: '', slug: '' });
    const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    const submitTenant = (e) => {
        e.preventDefault();
        tenantForm.post(route('super-admin.tenants.store'), {
            onSuccess: () => { setShowTenantModal(false); tenantForm.reset(); }
        });
    };

    // Form: Tambah Admin
    const adminForm = useForm({ name: '', email: '', password: '' });

    const submitAdmin = (e) => {
        e.preventDefault();
        adminForm.post(route('super-admin.tenants.admins.store', selectedTenant.id), {
            onSuccess: () => { setShowAdminModal(false); adminForm.reset(); setSelectedTenant(null); }
        });
    };

    const openAdminModal = (tenant) => {
        setSelectedTenant(tenant);
        setShowAdminModal(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Super Admin</h2>}
        >
            <Head title="Super Admin" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Flash message */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl text-sm font-medium">
                            ✅ {flash.success}
                        </div>
                    )}

                    {/* Stat Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                            <div>
                                <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Total Instansi</p>
                                <p className="text-5xl font-black">{tenants.length}</p>
                            </div>
                            <svg className="w-14 h-14 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </div>
                    </div>

                    {/* Tabel Tenant */}
                    <div className="bg-white shadow-sm sm:rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Master Data Instansi (Tenants)</h3>
                                <p className="text-sm text-gray-500">Semua klien platform Antriku.</p>
                            </div>
                            <button
                                onClick={() => setShowTenantModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                                Tambah Instansi
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b">
                                        <th className="p-4 font-semibold w-12">ID</th>
                                        <th className="p-4 font-semibold">Nama Instansi</th>
                                        <th className="p-4 font-semibold">Slug (URL)</th>
                                        <th className="p-4 font-semibold text-center">Layanan</th>
                                        <th className="p-4 font-semibold text-center">Loket</th>
                                        <th className="p-4 font-semibold text-center">Admin</th>
                                        <th className="p-4 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tenants.map((tenant) => (
                                        <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-400 text-sm">#{tenant.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center font-black text-indigo-700 text-lg">
                                                        {tenant.nama_instansi.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-gray-800">{tenant.nama_instansi}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-sm text-gray-500">{tenant.slug}</td>
                                            <td className="p-4 text-center font-bold text-indigo-600">{tenant.layanans_count}</td>
                                            <td className="p-4 text-center font-bold text-blue-600">{tenant.lokets_count}</td>
                                            <td className="p-4 text-center text-gray-500 text-sm">
                                                {tenant.users?.filter(u => u.role === 'admin-instansi').length ?? 0}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openAdminModal(tenant)}
                                                    className="text-sm text-blue-600 hover:text-blue-900 font-bold border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    + Admin
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {tenants.length === 0 && (
                                        <tr><td colSpan="7" className="p-10 text-center text-gray-400">Belum ada instansi terdaftar.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Tambah Tenant */}
            <Modal show={showTenantModal} title="Tambah Instansi Baru" onClose={() => setShowTenantModal(false)}>
                <form onSubmit={submitTenant} className="space-y-4">
                    <InputField
                        label="Nama Instansi"
                        id="nama_instansi"
                        type="text"
                        placeholder="Contoh: Dinas Kependudukan"
                        value={tenantForm.data.nama_instansi}
                        onChange={e => {
                            tenantForm.setData('nama_instansi', e.target.value);
                            if (!tenantForm.data.slug) {
                                tenantForm.setData('slug', autoSlug(e.target.value));
                            }
                        }}
                        error={tenantForm.errors.nama_instansi}
                        required
                    />
                    <InputField
                        label="Slug URL (huruf kecil, tanpa spasi)"
                        id="slug"
                        type="text"
                        placeholder="contoh: dukcapil"
                        value={tenantForm.data.slug}
                        onChange={e => tenantForm.setData('slug', autoSlug(e.target.value))}
                        error={tenantForm.errors.slug}
                        required
                    />
                    <p className="text-xs text-gray-400">URL Kiosk: <code className="bg-gray-100 px-1 rounded">/kiosk/{tenantForm.data.slug || 'slug'}</code></p>
                    <button
                        type="submit"
                        disabled={tenantForm.processing}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
                    >
                        {tenantForm.processing ? 'Menyimpan...' : 'Simpan Instansi'}
                    </button>
                </form>
            </Modal>

            {/* Modal: Tambah Admin Instansi */}
            <Modal
                show={showAdminModal}
                title={`Tambah Admin untuk "${selectedTenant?.nama_instansi}"`}
                onClose={() => { setShowAdminModal(false); adminForm.reset(); }}
            >
                <form onSubmit={submitAdmin} className="space-y-4">
                    <InputField
                        label="Nama Lengkap"
                        id="admin_name"
                        type="text"
                        placeholder="Nama Admin"
                        value={adminForm.data.name}
                        onChange={e => adminForm.setData('name', e.target.value)}
                        error={adminForm.errors.name}
                        required
                    />
                    <InputField
                        label="Email"
                        id="admin_email"
                        type="email"
                        placeholder="admin@instansi.com"
                        value={adminForm.data.email}
                        onChange={e => adminForm.setData('email', e.target.value)}
                        error={adminForm.errors.email}
                        required
                    />
                    <InputField
                        label="Password (min. 8 karakter)"
                        id="admin_password"
                        type="password"
                        placeholder="••••••••"
                        value={adminForm.data.password}
                        onChange={e => adminForm.setData('password', e.target.value)}
                        error={adminForm.errors.password}
                        required
                    />
                    <button
                        type="submit"
                        disabled={adminForm.processing}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
                    >
                        {adminForm.processing ? 'Mendaftarkan...' : 'Daftarkan Admin'}
                    </button>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
