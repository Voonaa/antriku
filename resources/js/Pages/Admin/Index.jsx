import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';

// ─── Reusable Modal ───────────────────────────────────────────
function Modal({ show, title, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
}

// ─── Reusable Input ───────────────────────────────────────────
function Field({ label, id, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function InputField({ label, id, error, ...props }) {
    return (
        <Field label={label} id={id} error={error}>
            <input id={id} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500" {...props} />
        </Field>
    );
}

// Removed STAT_COLORS

export default function AdminIndex({ auth, metrics, lokets, layanans, staff, tenant }) {
    const { flash } = usePage().props;

    // Modal state
    const [showLayananModal, setShowLayananModal] = useState(false);
    const [showLoketModal,   setShowLoketModal]   = useState(false);
    const [showStaffModal,   setShowStaffModal]   = useState(false);
    const [logoPreview,      setLogoPreview]      = useState(tenant?.logo || null);

    // ─── Form: Tambah Layanan ─────────────────────────────────
    const layananForm = useForm({ nama_layanan: '', kode_huruf: '', estimasi_menit: 15 });
    const submitLayanan = (e) => {
        e.preventDefault();
        layananForm.post(route('admin.layanans.store'), {
            onSuccess: () => { setShowLayananModal(false); layananForm.reset(); }
        });
    };

    // ─── Form: Tambah Loket ───────────────────────────────────
    const loketForm = useForm({ nomor_loket: '', layanan_id: layanans[0]?.id || '' });
    const submitLoket = (e) => {
        e.preventDefault();
        loketForm.post(route('admin.lokets.store'), {
            onSuccess: () => { setShowLoketModal(false); loketForm.reset(); }
        });
    };

    // ─── Form: Tambah Petugas ─────────────────────────────────
    const staffForm = useForm({ name: '', email: '', password: '' });
    const submitStaff = (e) => {
        e.preventDefault();
        staffForm.post(route('admin.staff.store'), {
            onSuccess: () => { setShowStaffModal(false); staffForm.reset(); }
        });
    };

    // ─── Form: Upload Logo ────────────────────────────────────
    const logoForm = useForm({ logo: null });
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) { logoForm.setData('logo', file); setLogoPreview(URL.createObjectURL(file)); }
    };
    const submitLogo = (e) => {
        e.preventDefault();
        logoForm.post(route('admin.logo.upload'), {
            forceFormData: true,
            onSuccess: () => logoForm.reset(),
        });
    };

    // ─── Actions ──────────────────────────────────────────────
    const deleteLayanan = (id) => {
        if (!confirm('Yakin hapus layanan ini? Semua antrian terkait juga akan ikut terhapus.')) return;
        router.delete(route('admin.layanans.destroy', id), { preserveScroll: true });
    };
    const deleteLoket = (id) => {
        if (!confirm('Yakin hapus loket ini?')) return;
        router.delete(route('admin.lokets.destroy', id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-gray-800 leading-tight">Dashboard Admin Instansi</h2>}
        >
            <Head title="Admin Instansi" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Flash */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-3 rounded-xl text-sm font-medium">
                            ⚠️ {flash.error}
                        </div>
                    )}

                    {/* ── Profil & Logo ─────────────────────────────────── */}
                    <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Profil &amp; Branding Instansi</h3>
                            <p className="text-sm text-gray-500">Logo ini akan tampil di Kiosk, TV Display, dan struk tiket.</p>
                        </div>
                        <div className="p-6 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="h-24 w-auto object-contain rounded-xl border border-gray-200 p-2 bg-gray-50 shadow-sm"/>
                                ) : (
                                    <div className="h-24 w-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                                        <p className="text-xs text-gray-400 text-center px-2">Belum ada logo</p>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={submitLogo} className="flex-1 flex flex-col sm:flex-row items-start sm:items-end gap-4">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Upload Logo Baru</label>
                                    <input type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={handleLogoChange}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 border border-gray-300 rounded-xl p-1"/>
                                    <p className="text-xs text-gray-400 mt-1">Format: PNG, JPG, SVG, WebP. Maks: 2MB.</p>
                                    {logoForm.errors.logo && <p className="text-red-500 text-xs mt-1">{logoForm.errors.logo}</p>}
                                </div>
                                <button type="submit" disabled={logoForm.processing || !logoForm.data.logo}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition-colors text-sm whitespace-nowrap">
                                    {logoForm.processing ? 'Mengunggah...' : '⬆️ Simpan Logo'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ── Stat Cards ────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Antrian',  value: metrics.total_hari_ini, color: 'blue',   icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                            { label: 'Selesai',         value: metrics.total_selesai,  color: 'green',  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Menunggu',        value: metrics.sisa_menunggu,  color: 'yellow', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Rata-rata (mnt)', value: metrics.avg_wait_time,  color: 'purple', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                        ].map(({ label, value, color, icon }) => {
                            const isAccent = ['yellow', 'orange', 'purple'].includes(color);
                            const iconClass = isAccent ? 'bg-orange-50 text-accent' : 'bg-teal-50 text-primary';
                            return (
                                <div key={label} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                                    <div className={`p-3 rounded-xl flex-shrink-0 ${iconClass}`}>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                                        <p className="text-3xl font-black text-slate-800 leading-none mt-1">{value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Layanan & Loket side by side ──────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Tabel Layanan */}
                        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Manajemen Layanan</h3>
                                    <p className="text-xs text-gray-500">{layanans?.length || 0} layanan terdaftar</p>
                                </div>
                                <button onClick={() => setShowLayananModal(true)}
                                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    + Tambah Layanan
                                </button>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-500 text-xs border-b bg-white">
                                            <th className="p-4 font-semibold">Kode</th>
                                            <th className="p-4 font-semibold">Nama Layanan</th>
                                            <th className="p-4 font-semibold text-center">Estimasi</th>
                                            <th className="p-4 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {layanans?.map(l => (
                                            <tr key={l.id} className="hover:bg-gray-50">
                                                <td className="p-4">
                                                    <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg font-black text-sm">{l.kode_huruf}</span>
                                                </td>
                                                <td className="p-4 font-medium text-gray-800 text-sm">{l.nama_layanan}</td>
                                                <td className="p-4 text-center text-gray-500 text-sm">{l.estimasi_menit} mnt</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => deleteLayanan(l.id)} className="text-red-600 hover:text-red-900 font-bold text-sm">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!layanans || layanans.length === 0) && (
                                            <tr><td colSpan="4" className="p-6 text-center text-gray-400 text-sm">Belum ada layanan. Tambahkan sekarang!</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tabel Loket */}
                        <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Manajemen Loket</h3>
                                    <p className="text-xs text-gray-500">{lokets?.length || 0} loket terdaftar</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!layanans || layanans.length === 0) {
                                            alert('Tambahkan Layanan terlebih dahulu sebelum membuat Loket.');
                                            return;
                                        }
                                        setShowLoketModal(true);
                                    }}
                                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                    + Tambah Loket
                                </button>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-500 text-xs border-b bg-white">
                                            <th className="p-4 font-semibold">No. Loket</th>
                                            <th className="p-4 font-semibold">Layanan</th>
                                            <th className="p-4 font-semibold text-center">Status</th>
                                            <th className="p-4 font-semibold text-center">Dilayani</th>
                                            <th className="p-4 font-semibold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {lokets?.map(l => (
                                            <tr key={l.id} className="hover:bg-gray-50">
                                                <td className="p-4 font-bold text-gray-800 text-sm">Loket {l.nomor_loket}</td>
                                                <td className="p-4 text-gray-600 text-sm">{l.nama_layanan}</td>
                                                <td className="p-4 text-center">
                                                    {l.status
                                                        ? <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">Buka</span>
                                                        : <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-bold">Istirahat</span>
                                                    }
                                                </td>
                                                <td className="p-4 text-center font-bold text-indigo-600 text-sm">{l.jumlah_dilayani}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => deleteLoket(l.id)} className="text-red-600 hover:text-red-900 font-bold text-sm">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!lokets || lokets.length === 0) && (
                                            <tr><td colSpan="5" className="p-6 text-center text-sm">
                                                <p className="text-orange-600 font-semibold">⚠️ Belum ada loket!</p>
                                                <p className="text-gray-400 text-xs mt-1">Tambahkan loket agar petugas bisa memanggil antrian.</p>
                                            </td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ── Tabel Petugas ─────────────────────────────────── */}
                    <div className="bg-white shadow-sm sm:rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-bold text-gray-800">Manajemen Petugas Loket</h3>
                                <p className="text-xs text-gray-500">{staff?.length || 0} petugas terdaftar</p>
                            </div>
                            <button onClick={() => setShowStaffModal(true)}
                                className="text-sm bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                + Tambah Petugas
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-500 text-xs border-b bg-white">
                                        <th className="p-4 font-semibold">Nama Petugas</th>
                                        <th className="p-4 font-semibold">Email Login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {staff?.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                                                        {s.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {s.name}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">{s.email}</td>
                                        </tr>
                                    ))}
                                    {(!staff || staff.length === 0) && (
                                        <tr><td colSpan="2" className="p-6 text-center text-gray-400 text-sm">Belum ada petugas. Tambahkan sekarang!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Modal: Tambah Layanan ──────────────────────────────── */}
            <Modal show={showLayananModal} title="Tambah Layanan Baru" onClose={() => setShowLayananModal(false)}>
                <form onSubmit={submitLayanan} className="space-y-4">
                    <InputField label="Nama Layanan" id="nama_layanan" type="text" placeholder="Contoh: Pembuatan KTP"
                        value={layananForm.data.nama_layanan} onChange={e => layananForm.setData('nama_layanan', e.target.value)}
                        error={layananForm.errors.nama_layanan} required/>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Kode Awalan" id="kode_huruf" type="text" placeholder="A" maxLength="5"
                            value={layananForm.data.kode_huruf} onChange={e => layananForm.setData('kode_huruf', e.target.value.toUpperCase())}
                            error={layananForm.errors.kode_huruf} required/>
                        <InputField label="Estimasi (menit)" id="estimasi_menit" type="number" min="1"
                            value={layananForm.data.estimasi_menit} onChange={e => layananForm.setData('estimasi_menit', e.target.value)}
                            error={layananForm.errors.estimasi_menit} required/>
                    </div>
                    <p className="text-xs text-gray-400">Nomor antrian: <strong>{layananForm.data.kode_huruf || 'A'}-001</strong></p>
                    <button type="submit" disabled={layananForm.processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50">
                        {layananForm.processing ? 'Menyimpan...' : 'Simpan Layanan'}
                    </button>
                </form>
            </Modal>

            {/* ── Modal: Tambah Loket ────────────────────────────────── */}
            <Modal show={showLoketModal} title="Tambah Loket Baru" onClose={() => setShowLoketModal(false)}>
                <form onSubmit={submitLoket} className="space-y-4">
                    <InputField label="Nomor Loket" id="nomor_loket" type="text" placeholder="Contoh: 1"
                        value={loketForm.data.nomor_loket} onChange={e => loketForm.setData('nomor_loket', e.target.value)}
                        error={loketForm.errors.nomor_loket} required/>
                    <Field label="Layanan yang Ditangani" id="layanan_id" error={loketForm.errors.layanan_id}>
                        <select id="layanan_id" value={loketForm.data.layanan_id}
                            onChange={e => loketForm.setData('layanan_id', e.target.value)}
                            className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="">-- Pilih Layanan --</option>
                            {layanans?.map(l => (
                                <option key={l.id} value={l.id}>{l.kode_huruf} — {l.nama_layanan}</option>
                            ))}
                        </select>
                    </Field>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                        💡 Loket akan otomatis berstatus <strong>Buka</strong> setelah dibuat. Petugas bisa mengubah status istirahat dari dashboard mereka.
                    </div>
                    <button type="submit" disabled={loketForm.processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50">
                        {loketForm.processing ? 'Menyimpan...' : 'Simpan Loket'}
                    </button>
                </form>
            </Modal>

            {/* ── Modal: Tambah Petugas ──────────────────────────────── */}
            <Modal show={showStaffModal} title="Tambah Petugas Baru" onClose={() => setShowStaffModal(false)}>
                <form onSubmit={submitStaff} className="space-y-4">
                    <InputField label="Nama Lengkap" id="staff_name" type="text" placeholder="Nama Petugas"
                        value={staffForm.data.name} onChange={e => staffForm.setData('name', e.target.value)}
                        error={staffForm.errors.name} required/>
                    <InputField label="Email (untuk login)" id="staff_email" type="email" placeholder="petugas@instansi.com"
                        value={staffForm.data.email} onChange={e => staffForm.setData('email', e.target.value)}
                        error={staffForm.errors.email} required/>
                    <InputField label="Password (min. 8 karakter)" id="staff_password" type="password" placeholder="••••••••"
                        value={staffForm.data.password} onChange={e => staffForm.setData('password', e.target.value)}
                        error={staffForm.errors.password} required/>
                    <button type="submit" disabled={staffForm.processing}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50">
                        {staffForm.processing ? 'Mendaftarkan...' : 'Daftarkan Petugas'}
                    </button>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
