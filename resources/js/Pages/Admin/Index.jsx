import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

function Modal({ show, title, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <h2 className="text-2xl font-black text-slate-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
}

function InputField({ label, id, error, ...props }) {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{label}</label>
            <input id={id} className="w-full border-slate-200 rounded-xl px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-primary/20 outline-none transition" {...props} />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function StatCard({ label, value, subtext, icon, iconColorClass = "bg-teal-50 text-primary" }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${iconColorClass} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">{value}</span>
                    {subtext && <span className="text-sm font-bold text-slate-500">{subtext}</span>}
                </div>
            </div>
        </div>
    );
}

export default function AdminIndex({ auth, metrics, lokets, layanans, staff, tenant }) {
    const { flash } = usePage().props;
    const { t } = useLang();

    const [showLayananModal, setShowLayananModal] = useState(false);
    const [showLoketModal,   setShowLoketModal]   = useState(false);
    const [showStaffModal,   setShowStaffModal]   = useState(false);
    const [logoPreview,      setLogoPreview]      = useState(tenant?.logo || null);

    const [editLayananData, setEditLayananData] = useState(null);
    const [editLoketData,   setEditLoketData]   = useState(null);

    const layananForm = useForm({ nama_layanan: '', kode_huruf: '', estimasi_menit: 15 });
    const submitLayanan = (e) => {
        e.preventDefault();
        layananForm.post(route('admin.layanans.store'), {
            onSuccess: () => { setShowLayananModal(false); layananForm.reset(); }
        });
    };

    const editLayananForm = useForm({ nama_layanan: '', kode_huruf: '', estimasi_menit: 15 });
    const openEditLayanan = (l) => {
        setEditLayananData(l);
        editLayananForm.setData({ nama_layanan: l.nama_layanan, kode_huruf: l.kode_huruf, estimasi_menit: l.estimasi_menit });
    };
    const submitEditLayanan = (e) => {
        e.preventDefault();
        editLayananForm.put(route('admin.layanans.update', editLayananData.id), {
            onSuccess: () => { setEditLayananData(null); editLayananForm.reset(); }
        });
    };

    const loketForm = useForm({ nomor_loket: '', layanan_id: layanans[0]?.id || '' });
    const submitLoket = (e) => {
        e.preventDefault();
        loketForm.post(route('admin.lokets.store'), {
            onSuccess: () => { setShowLoketModal(false); loketForm.reset(); }
        });
    };

    const editLoketForm = useForm({ nomor_loket: '', layanan_id: '' });
    const openEditLoket = (l) => {
        setEditLoketData(l);
        editLoketForm.setData({
            nomor_loket: l.nomor_loket,
            layanan_id: l.layanan_id || layanans[0]?.id || '',
        });
    };
    const submitEditLoket = (e) => {
        e.preventDefault();
        editLoketForm.put(route('admin.lokets.update', editLoketData.id), {
            onSuccess: () => { setEditLoketData(null); editLoketForm.reset(); }
        });
    };

    const staffForm = useForm({ name: '', email: '', password: '' });
    const submitStaff = (e) => {
        e.preventDefault();
        staffForm.post(route('admin.staff.store'), {
            onSuccess: () => { setShowStaffModal(false); staffForm.reset(); }
        });
    };

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

    const youtubeForm = useForm({ youtube_url: tenant?.youtube_url || '' });
    const submitYoutube = (e) => {
        e.preventDefault();
        youtubeForm.post(route('admin.youtube.update'));
    };

    const deleteLayanan = (id) => {
        if (!confirm('Yakin hapus layanan ini? Semua antrian terkait juga akan terhapus.')) return;
        router.delete(route('admin.layanans.destroy', id), { preserveScroll: true });
    };
    const deleteLoket = (id) => {
        if (!confirm('Yakin hapus loket ini?')) return;
        router.delete(route('admin.lokets.destroy', id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">{t('overview')}</h1>
                    <p className="text-sm text-slate-500">Real-time status of your active services and counters.</p>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    {flash.success}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard label={t('today_queues')} value={metrics.total_hari_ini} iconColorClass="bg-slate-100 text-slate-600" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>} />
                <StatCard label={t('completed')} value={metrics.total_selesai} iconColorClass="bg-teal-50 text-primary" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>} />
                <StatCard label={t('waiting')} value={metrics.sisa_menunggu} iconColorClass="bg-orange-50 text-accent" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard label={t('avg_wait_time')} value={metrics.avg_wait_time} subtext="m" iconColorClass="bg-slate-100 text-slate-600" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Manajemen Layanan */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">{t('manajemen_layanan')}</h3>
                        <button onClick={() => setShowLayananModal(true)} className="bg-primary hover:bg-teal-700 text-white font-bold py-1.5 px-4 rounded-md text-xs flex items-center gap-2 transition-colors">
                            + {t('new_service')}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-xs font-bold text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">{t('service_name')}</th>
                                    <th className="px-6 py-4">{t('counters')}</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {layanans?.map(l => (
                                    <tr key={l.id}>
                                        <td className="px-6 py-4 font-bold text-slate-800">{l.nama_layanan}</td>
                                        <td className="px-6 py-4">{lokets?.filter(lok => lok.nama_layanan === l.nama_layanan).length || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-teal-50 text-primary border border-teal-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{t('active')}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openEditLayanan(l)} className="text-slate-400 hover:text-primary mx-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                            </button>
                                            <button onClick={() => deleteLayanan(l.id)} className="text-slate-400 hover:text-red-500 mx-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Manajemen Loket */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">{t('manajemen_loket')}</h3>
                        <button onClick={() => {
                            if (!layanans?.length) return alert('Tambahkan Layanan dulu.');
                            setShowLoketModal(true);
                        }} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-1.5 px-4 rounded-md text-xs flex items-center gap-2 transition-colors">
                            + {t('new_counter')}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="text-xs font-bold text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">{t('counter_id')}</th>
                                    <th className="px-6 py-4">{t('assigned_service')}</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {lokets?.map(l => (
                                    <tr key={l.id}>
                                        <td className="px-6 py-4 font-bold text-slate-800 text-primary">L-{(l.nomor_loket).toString().padStart(2, '0')}</td>
                                        <td className="px-6 py-4 text-slate-700">{l.nama_layanan}</td>
                                        <td className="px-6 py-4">
                                            {l.status ? (
                                                <span className="bg-teal-50 text-primary border border-teal-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{t('serving')}</span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{t('idle')}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => openEditLoket(l)} className="text-slate-400 hover:text-primary mx-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                            </button>
                                            <button onClick={() => deleteLoket(l.id)} className="text-slate-400 hover:text-red-500 mx-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Profile & Branding Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-0">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Profil &amp; Branding Instansi</h3>
                    <p className="text-sm text-slate-500">Logo dan video promosi yang tampil di Kios dan layar TV.</p>
                </div>

                {/* Logo Upload */}
                <div className="p-6 flex flex-col md:flex-row items-center gap-8 border-b border-slate-100">
                    <div className="flex-shrink-0">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain"/>
                        ) : (
                            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-300">No Logo</div>
                        )}
                    </div>
                    <form onSubmit={submitLogo} className="flex-1 flex items-center gap-4 flex-wrap">
                        <input type="file" accept=".png,.jpg,.svg" onChange={handleLogoChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-primary hover:file:bg-teal-100"/>
                        <button type="submit" disabled={logoForm.processing || !logoForm.data.logo} className="bg-primary text-white font-bold py-2 px-4 rounded-xl text-sm disabled:opacity-50">Upload Logo</button>
                    </form>
                </div>

                {/* YouTube URL Section */}
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 mb-1">Video Promosi TV Display</h4>
                            <p className="text-sm text-slate-500 mb-4">
                                Masukkan URL video YouTube Anda. Video akan tampil secara otomatis (tanpa suara) di sisi kiri layar TV Display saat menunggu antrian dipanggil.
                            </p>
                            <form onSubmit={submitYoutube} className="flex gap-3 flex-wrap items-center">
                                <input
                                    type="url"
                                    placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    value={youtubeForm.data.youtube_url}
                                    onChange={e => youtubeForm.setData('youtube_url', e.target.value)}
                                    className="flex-1 min-w-0 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-0 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={youtubeForm.processing}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2 transition-colors"
                                >
                                    {youtubeForm.processing ? 'Menyimpan...' : 'Simpan Video'}
                                </button>
                            </form>
                            {youtubeForm.errors.youtube_url && (
                                <p className="text-red-500 text-xs mt-2">{youtubeForm.errors.youtube_url}</p>
                            )}
                            {tenant?.youtube_url && (
                                <p className="text-xs text-primary mt-2 font-semibold">✓ Video tersimpan: {tenant.youtube_url}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals... */}
            <Modal show={showLayananModal} title={t('new_service')} onClose={() => setShowLayananModal(false)}>
                <form onSubmit={submitLayanan} className="space-y-4">
                    <InputField label={t('service_name')} id="nama_layanan" type="text" value={layananForm.data.nama_layanan} onChange={e => layananForm.setData('nama_layanan', e.target.value)} error={layananForm.errors.nama_layanan} required/>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Kode Awalan" id="kode_huruf" type="text" maxLength="5" value={layananForm.data.kode_huruf} onChange={e => layananForm.setData('kode_huruf', e.target.value.toUpperCase())} error={layananForm.errors.kode_huruf} required/>
                        <InputField label="Estimasi (menit)" id="estimasi_menit" type="number" min="1" value={layananForm.data.estimasi_menit} onChange={e => layananForm.setData('estimasi_menit', e.target.value)} error={layananForm.errors.estimasi_menit} required/>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl">Simpan</button>
                </form>
            </Modal>

            <Modal show={!!editLayananData} title="Edit Layanan" onClose={() => setEditLayananData(null)}>
                <form onSubmit={submitEditLayanan} className="space-y-4">
                    <InputField label={t('service_name')} id="edit_nama_layanan" type="text" value={editLayananForm.data.nama_layanan} onChange={e => editLayananForm.setData('nama_layanan', e.target.value)} error={editLayananForm.errors.nama_layanan} required/>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Kode Awalan" id="edit_kode_huruf" type="text" maxLength="5" value={editLayananForm.data.kode_huruf} onChange={e => editLayananForm.setData('kode_huruf', e.target.value.toUpperCase())} error={editLayananForm.errors.kode_huruf} required/>
                        <InputField label="Estimasi (menit)" id="edit_estimasi_menit" type="number" min="1" value={editLayananForm.data.estimasi_menit} onChange={e => editLayananForm.setData('estimasi_menit', e.target.value)} error={editLayananForm.errors.estimasi_menit} required/>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl">Simpan</button>
                </form>
            </Modal>

            <Modal show={showLoketModal} title={t('new_counter')} onClose={() => setShowLoketModal(false)}>
                <form onSubmit={submitLoket} className="space-y-4">
                    <InputField label="Nomor Loket" id="nomor_loket" type="text" value={loketForm.data.nomor_loket} onChange={e => loketForm.setData('nomor_loket', e.target.value)} error={loketForm.errors.nomor_loket} required/>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t('assigned_service')}</label>
                        <select className="w-full border-slate-200 rounded-xl px-4 py-3" value={loketForm.data.layanan_id} onChange={e => loketForm.setData('layanan_id', e.target.value)} required>
                            <option value="">Pilih</option>
                            {layanans?.map(l => <option key={l.id} value={l.id}>{l.nama_layanan}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl">Simpan</button>
                </form>
            </Modal>

            <Modal show={!!editLoketData} title="Edit Loket" onClose={() => setEditLoketData(null)}>
                <form onSubmit={submitEditLoket} className="space-y-4">
                    <InputField label="Nomor Loket" id="edit_nomor_loket" type="text" value={editLoketForm.data.nomor_loket} onChange={e => editLoketForm.setData('nomor_loket', e.target.value)} error={editLoketForm.errors.nomor_loket} required/>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{t('assigned_service')}</label>
                        <select className="w-full border-slate-200 rounded-xl px-4 py-3" value={editLoketForm.data.layanan_id} onChange={e => editLoketForm.setData('layanan_id', e.target.value)} required>
                            <option value="">Pilih</option>
                            {layanans?.map(l => <option key={l.id} value={l.id}>{l.nama_layanan}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl">Simpan</button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
