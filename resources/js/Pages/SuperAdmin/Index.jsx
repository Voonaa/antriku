import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';

// ── Reusable Components ────────────────────────────────────────
function Modal({ show, title, subtitle, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <h2 className="text-xl font-black text-gray-900 mb-1">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
                {!subtitle && <div className="mb-6"/>}
                {children}
            </div>
        </div>
    );
}

function InputField({ label, id, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
            <input id={id} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" {...props}/>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function StatCard({ label, value, color, icon }) {
    const colors = {
        indigo: 'from-indigo-600 to-indigo-500',
        blue:   'from-blue-600 to-blue-500',
        emerald:'from-emerald-600 to-emerald-500',
        violet: 'from-violet-600 to-violet-500',
        amber:  'from-amber-500 to-amber-400',
        rose:   'from-rose-600 to-rose-500',
        cyan:   'from-cyan-600 to-cyan-500',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 text-white shadow-lg flex items-center gap-4`}>
            <div className="bg-white/20 rounded-xl p-3 flex-shrink-0 text-2xl">{icon}</div>
            <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black leading-none mt-0.5">{value}</p>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────
export default function SuperAdminIndex({ auth, tenants, stats }) {
    const { flash } = usePage().props;
    const autoSlug = (s) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Modal states
    const [modal, setModal] = useState(null); // 'add-tenant' | 'edit-tenant' | 'add-admin' | 'reset-pass' | 'view-admins'
    const [activeTenant, setActiveTenant] = useState(null);
    const [activeAdmin,  setActiveAdmin]  = useState(null);

    const openModal = (type, tenant = null, admin = null) => {
        setActiveTenant(tenant);
        setActiveAdmin(admin);
        setModal(type);
        if (type === 'edit-tenant' && tenant) {
            editForm.setData({ nama_instansi: tenant.nama_instansi, slug: tenant.slug });
        }
    };
    const closeModal = () => { setModal(null); setActiveTenant(null); setActiveAdmin(null); };

    // ── Forms ──────────────────────────────────────────────────
    const addForm = useForm({ nama_instansi: '', slug: '' });
    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('super-admin.tenants.store'), { onSuccess: closeModal });
    };

    const editForm = useForm({ nama_instansi: '', slug: '' });
    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('super-admin.tenants.update', activeTenant.id), { onSuccess: closeModal });
    };

    const adminForm = useForm({ name: '', email: '', password: '' });
    const submitAdmin = (e) => {
        e.preventDefault();
        adminForm.post(route('super-admin.tenants.admins.store', activeTenant.id), { onSuccess: closeModal });
    };

    const passForm = useForm({ password: '', password_confirmation: '' });
    const submitPass = (e) => {
        e.preventDefault();
        passForm.put(route('super-admin.admins.reset-password', activeAdmin.id), { onSuccess: closeModal });
    };

    const deleteTenant = (id, name) => {
        if (!confirm(`⚠️ Hapus instansi "${name}"?\n\nSEMUA data (layanan, loket, antrian, staff) akan ikut terhapus permanen!`)) return;
        router.delete(route('super-admin.tenants.destroy', id), { preserveScroll: true });
    };

    const deleteAdmin = (userId, name) => {
        if (!confirm(`Hapus akun admin "${name}"?`)) return;
        router.delete(route('super-admin.admins.destroy', userId), { preserveScroll: true });
    };

    const resetAntrian = (id, name) => {
        if (!confirm(`Reset semua antrian hari ini untuk "${name}"?\n\nAksi ini tidak bisa dibatalkan.`)) return;
        router.post(route('super-admin.tenants.reset-antrian', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-black text-2xl text-gray-900">Super Admin Panel</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Kelola seluruh instansi platform Antriku</p>
                </div>
                <button onClick={() => openModal('add-tenant')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-colors flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    Tambah Instansi
                </button>
            </div>
        }>
            <Head title="Super Admin Panel" />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Flash */}
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            {flash.success}
                        </div>
                    )}

                    {/* ── Stat Cards ─────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Total Instansi"    value={stats.total_tenants}     color="indigo"  icon="🏢"/>
                        <StatCard label="Total Pengguna"    value={stats.total_users}        color="blue"    icon="👥"/>
                        <StatCard label="Antrian Hari Ini"  value={stats.antrian_hari_ini}   color="amber"   icon="🎫"/>
                        <StatCard label="Selesai Hari Ini"  value={stats.antrian_selesai}    color="emerald" icon="✅"/>
                        <StatCard label="Total Antrian"     value={stats.total_antrian}      color="violet"  icon="📊"/>
                        <StatCard label="Total Layanan"     value={stats.total_layanans}     color="cyan"    icon="⚙️"/>
                        <StatCard label="Total Loket"       value={stats.total_lokets}       color="rose"    icon="🪟"/>
                        <StatCard label="Platform"          value="Aktif"                    color="emerald" icon="🟢"/>
                    </div>

                    {/* ── Tenant Cards ───────────────────────────────── */}
                    <div>
                        <h3 className="text-lg font-black text-gray-800 mb-4">Daftar Instansi Terdaftar</h3>
                        {tenants.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
                                <p className="text-4xl mb-3">🏢</p>
                                <p className="text-gray-500 font-semibold">Belum ada instansi. Tambahkan instansi pertama!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {tenants.map(tenant => {
                                    const admins = tenant.users?.filter(u => u.role === 'admin-instansi') ?? [];
                                    return (
                                        <div key={tenant.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            {/* Card Header */}
                                            <div className="p-6 flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center font-black text-indigo-700 text-2xl flex-shrink-0">
                                                        {tenant.logo
                                                            ? <img src={tenant.logo} alt="" className="w-full h-full object-contain rounded-2xl p-1"/>
                                                            : tenant.nama_instansi.charAt(0)
                                                        }
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-base leading-tight">{tenant.nama_instansi}</h4>
                                                        <code className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg font-mono">/kiosk/{tenant.slug}</code>
                                                    </div>
                                                </div>
                                                {/* Quick Actions */}
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <button onClick={() => openModal('edit-tenant', tenant)} title="Edit"
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                                    </button>
                                                    <button onClick={() => deleteTenant(tenant.id, tenant.nama_instansi)} title="Hapus"
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stats Row */}
                                            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                                                <div className="p-3 text-center">
                                                    <p className="text-xs text-gray-400 font-semibold">Layanan</p>
                                                    <p className="text-xl font-black text-indigo-600">{tenant.layanans_count}</p>
                                                </div>
                                                <div className="p-3 text-center">
                                                    <p className="text-xs text-gray-400 font-semibold">Loket</p>
                                                    <p className="text-xl font-black text-blue-600">{tenant.lokets_count}</p>
                                                </div>
                                                <div className="p-3 text-center">
                                                    <p className="text-xs text-gray-400 font-semibold">Admin</p>
                                                    <p className="text-xl font-black text-emerald-600">{admins.length}</p>
                                                </div>
                                            </div>

                                            {/* Admins List */}
                                            <div className="px-5 pb-4 pt-3 border-t border-gray-100 bg-gray-50/60">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Instansi</p>
                                                {admins.length > 0 ? (
                                                    <div className="space-y-1.5">
                                                        {admins.map(a => (
                                                            <div key={a.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-gray-100">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                                                                        {a.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-800">{a.name}</p>
                                                                        <p className="text-xs text-gray-400">{a.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <button onClick={() => openModal('reset-pass', tenant, a)} title="Reset Password"
                                                                        className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password">
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                                                                    </button>
                                                                    <button onClick={() => deleteAdmin(a.id, a.name)} title="Hapus Admin"
                                                                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">Belum ada admin.</p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="px-5 pb-5 pt-3 flex gap-2 flex-wrap">
                                                <button onClick={() => openModal('add-admin', tenant)}
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors">
                                                    + Tambah Admin
                                                </button>
                                                <a href={`/kiosk/${tenant.slug}`} target="_blank"
                                                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 px-3 rounded-xl transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                                    Kiosk
                                                </a>
                                                <a href={`/tv/${tenant.slug}`} target="_blank"
                                                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 px-3 rounded-xl transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                                    TV
                                                </a>
                                                <button onClick={() => resetAntrian(tenant.id, tenant.nama_instansi)}
                                                    className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 px-3 rounded-xl transition-colors border border-rose-100">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                                    Reset Antrian
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Modal: Tambah Instansi ──────────────── */}
            <Modal show={modal === 'add-tenant'} title="Tambah Instansi Baru" subtitle="Daftarkan klien baru ke platform Antriku." onClose={closeModal}>
                <form onSubmit={submitAdd} className="space-y-4">
                    <InputField label="Nama Instansi" id="nama_instansi" type="text" placeholder="Contoh: Dinas Kependudukan"
                        value={addForm.data.nama_instansi} error={addForm.errors.nama_instansi} required
                        onChange={e => { addForm.setData('nama_instansi', e.target.value); addForm.setData('slug', autoSlug(e.target.value)); }}/>
                    <InputField label="Slug URL" id="add_slug" type="text" placeholder="dinas-kependudukan"
                        value={addForm.data.slug} error={addForm.errors.slug} required
                        onChange={e => addForm.setData('slug', autoSlug(e.target.value))}/>
                    <p className="text-xs text-gray-400">URL Kiosk: <code className="bg-gray-100 px-1.5 py-0.5 rounded">/kiosk/{addForm.data.slug || 'slug'}</code></p>
                    <button type="submit" disabled={addForm.processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                        {addForm.processing ? 'Menyimpan...' : 'Simpan Instansi'}
                    </button>
                </form>
            </Modal>

            {/* ── Modal: Edit Instansi ────────────────── */}
            <Modal show={modal === 'edit-tenant'} title="Edit Data Instansi" subtitle={activeTenant?.nama_instansi} onClose={closeModal}>
                <form onSubmit={submitEdit} className="space-y-4">
                    <InputField label="Nama Instansi" id="edit_nama" type="text"
                        value={editForm.data.nama_instansi} error={editForm.errors.nama_instansi} required
                        onChange={e => editForm.setData('nama_instansi', e.target.value)}/>
                    <InputField label="Slug URL" id="edit_slug" type="text"
                        value={editForm.data.slug} error={editForm.errors.slug} required
                        onChange={e => editForm.setData('slug', autoSlug(e.target.value))}/>
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">⚠️ Mengubah slug akan mengubah URL Kiosk dan TV. Pastikan menginformasikan ke admin instansi.</p>
                    <button type="submit" disabled={editForm.processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                        {editForm.processing ? 'Menyimpan...' : 'Perbarui Data'}
                    </button>
                </form>
            </Modal>

            {/* ── Modal: Tambah Admin ─────────────────── */}
            <Modal show={modal === 'add-admin'} title="Tambah Admin Instansi" subtitle={activeTenant?.nama_instansi} onClose={closeModal}>
                <form onSubmit={submitAdmin} className="space-y-4">
                    <InputField label="Nama Lengkap" id="admin_name" type="text" placeholder="Nama Admin"
                        value={adminForm.data.name} error={adminForm.errors.name} required
                        onChange={e => adminForm.setData('name', e.target.value)}/>
                    <InputField label="Email Login" id="admin_email" type="email" placeholder="admin@instansi.com"
                        value={adminForm.data.email} error={adminForm.errors.email} required
                        onChange={e => adminForm.setData('email', e.target.value)}/>
                    <InputField label="Password" id="admin_pass" type="password" placeholder="Min. 8 karakter"
                        value={adminForm.data.password} error={adminForm.errors.password} required
                        onChange={e => adminForm.setData('password', e.target.value)}/>
                    <button type="submit" disabled={adminForm.processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                        {adminForm.processing ? 'Mendaftarkan...' : 'Daftarkan Admin'}
                    </button>
                </form>
            </Modal>

            {/* ── Modal: Reset Password ───────────────── */}
            <Modal show={modal === 'reset-pass'} title="Reset Password Admin" subtitle={activeAdmin?.name} onClose={closeModal}>
                <form onSubmit={submitPass} className="space-y-4">
                    <InputField label="Password Baru" id="new_pass" type="password" placeholder="Min. 8 karakter"
                        value={passForm.data.password} error={passForm.errors.password} required
                        onChange={e => passForm.setData('password', e.target.value)}/>
                    <InputField label="Konfirmasi Password" id="confirm_pass" type="password" placeholder="Ulangi password"
                        value={passForm.data.password_confirmation} error={passForm.errors.password_confirmation} required
                        onChange={e => passForm.setData('password_confirmation', e.target.value)}/>
                    <button type="submit" disabled={passForm.processing}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                        {passForm.processing ? 'Menyimpan...' : '🔑 Reset Password'}
                    </button>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
