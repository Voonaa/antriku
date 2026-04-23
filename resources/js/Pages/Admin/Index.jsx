import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
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

export default function AdminIndex({ auth, metrics, lokets, layanans, staff }) {
    const { flash } = usePage().props;
    const [showLayananModal, setShowLayananModal] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);

    // Form: Tambah Layanan
    const layananForm = useForm({ nama_layanan: '', kode_huruf: '', estimasi_menit: 15 });
    const submitLayanan = (e) => {
        e.preventDefault();
        layananForm.post(route('admin.layanans.store'), {
            onSuccess: () => { setShowLayananModal(false); layananForm.reset(); }
        });
    };

    // Form: Tambah Petugas
    const staffForm = useForm({ name: '', email: '', password: '' });
    const submitStaff = (e) => {
        e.preventDefault();
        staffForm.post(route('admin.staff.store'), {
            onSuccess: () => { setShowStaffModal(false); staffForm.reset(); }
        });
    };

    const deleteLayanan = (id) => {
        if (!confirm('Yakin ingin menghapus layanan ini? Semua data antrian terkait juga akan ikut terhapus.')) return;
        router.delete(route('admin.layanans.destroy', id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Admin Instansi</h2>}
        >
            <Head title="Admin Instansi" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Flash message */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl text-sm font-medium">
                            ✅ {flash.success}
                        </div>
                    )}

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Antrian', value: metrics.total_hari_ini, color: 'blue', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                            { label: 'Selesai', value: metrics.total_selesai, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Menunggu', value: metrics.sisa_menunggu, color: 'yellow', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Rata-rata Tunggu (mnt)', value: metrics.avg_wait_time, color: 'purple', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                        ].map(({ label, value, color, icon }) => (
                            <div key={label} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4`}>
                                <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-xl`}>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                                    <p className="text-3xl font-black text-gray-800">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tabel Layanan */}
                        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Manajemen Layanan</h3>
                                <button
                                    onClick={() => setShowLayananModal(true)}
                                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    + Tambah Layanan
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-500 text-sm border-b">
                                            <th className="p-4 font-semibold">Kode</th>
                                            <th className="p-4 font-semibold">Nama Layanan</th>
                                            <th className="p-4 font-semibold text-center">Estimasi</th>
                                            <th className="p-4 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {layanans?.map((layanan) => (
                                            <tr key={layanan.id} className="hover:bg-gray-50">
                                                <td className="p-4">
                                                    <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg font-black">{layanan.kode_huruf}</span>
                                                </td>
                                                <td className="p-4 font-medium text-gray-800">{layanan.nama_layanan}</td>
                                                <td className="p-4 text-center text-gray-500">{layanan.estimasi_menit} mnt</td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => deleteLayanan(layanan.id)}
                                                        className="text-sm text-red-600 hover:text-red-900 font-bold"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!layanans || layanans.length === 0) && (
                                            <tr><td colSpan="4" className="p-6 text-center text-gray-400">Belum ada layanan. Tambahkan sekarang!</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tabel Loket */}
                        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">Status Loket Hari Ini</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-500 text-sm border-b">
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
                                                <td className="p-4 text-gray-600">{loket.nama_layanan}</td>
                                                <td className="p-4 text-center">
                                                    {loket.status
                                                        ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Buka</span>
                                                        : <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">Tutup</span>
                                                    }
                                                </td>
                                                <td className="p-4 text-center font-bold text-indigo-600">{loket.jumlah_dilayani}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Staff / Petugas */}
                    <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Manajemen Petugas Loket</h3>
                            <button
                                onClick={() => setShowStaffModal(true)}
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                + Tambah Petugas
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b">
                                        <th className="p-4 font-semibold">Nama Petugas</th>
                                        <th className="p-4 font-semibold">Email Login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {staff?.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                                    {s.name.charAt(0)}
                                                </div>
                                                {s.name}
                                            </td>
                                            <td className="p-4 text-gray-500">{s.email}</td>
                                        </tr>
                                    ))}
                                    {(!staff || staff.length === 0) && (
                                        <tr><td colSpan="2" className="p-6 text-center text-gray-400">Belum ada petugas. Tambahkan sekarang!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal: Tambah Layanan */}
            <Modal show={showLayananModal} title="Tambah Layanan Baru" onClose={() => setShowLayananModal(false)}>
                <form onSubmit={submitLayanan} className="space-y-4">
                    <InputField
                        label="Nama Layanan"
                        id="nama_layanan"
                        type="text"
                        placeholder="Contoh: Pembuatan KTP"
                        value={layananForm.data.nama_layanan}
                        onChange={e => layananForm.setData('nama_layanan', e.target.value)}
                        error={layananForm.errors.nama_layanan}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Kode Awalan Antrian"
                            id="kode_huruf"
                            type="text"
                            placeholder="Contoh: A"
                            maxLength="5"
                            value={layananForm.data.kode_huruf}
                            onChange={e => layananForm.setData('kode_huruf', e.target.value.toUpperCase())}
                            error={layananForm.errors.kode_huruf}
                            required
                        />
                        <InputField
                            label="Estimasi (menit)"
                            id="estimasi_menit"
                            type="number"
                            min="1"
                            value={layananForm.data.estimasi_menit}
                            onChange={e => layananForm.setData('estimasi_menit', e.target.value)}
                            error={layananForm.errors.estimasi_menit}
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-400">Nomor antrian akan terformat: <strong>{layananForm.data.kode_huruf || 'A'}-001</strong></p>
                    <button
                        type="submit"
                        disabled={layananForm.processing}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
                    >
                        {layananForm.processing ? 'Menyimpan...' : 'Simpan Layanan'}
                    </button>
                </form>
            </Modal>

            {/* Modal: Tambah Petugas */}
            <Modal show={showStaffModal} title="Tambah Petugas Baru" onClose={() => setShowStaffModal(false)}>
                <form onSubmit={submitStaff} className="space-y-4">
                    <InputField
                        label="Nama Lengkap"
                        id="staff_name"
                        type="text"
                        placeholder="Nama Petugas"
                        value={staffForm.data.name}
                        onChange={e => staffForm.setData('name', e.target.value)}
                        error={staffForm.errors.name}
                        required
                    />
                    <InputField
                        label="Email (untuk login)"
                        id="staff_email"
                        type="email"
                        placeholder="petugas@instansi.com"
                        value={staffForm.data.email}
                        onChange={e => staffForm.setData('email', e.target.value)}
                        error={staffForm.errors.email}
                        required
                    />
                    <InputField
                        label="Password (min. 8 karakter)"
                        id="staff_password"
                        type="password"
                        placeholder="••••••••"
                        value={staffForm.data.password}
                        onChange={e => staffForm.setData('password', e.target.value)}
                        error={staffForm.errors.password}
                        required
                    />
                    <button
                        type="submit"
                        disabled={staffForm.processing}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
                    >
                        {staffForm.processing ? 'Mendaftarkan...' : 'Daftarkan Petugas'}
                    </button>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
