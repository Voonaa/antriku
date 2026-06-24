import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

function Modal({ show, title, subtitle, onClose, children }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
            <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative border border-slate-100">
                <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
                {subtitle && <p className="text-sm text-slate-500 mb-8">{subtitle}</p>}
                {!subtitle && <div className="mb-8"/>}
                {children}
            </div>
        </div>
    );
}

function InputField({ label, id, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
            <input id={id} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" {...props}/>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default function SuperAdminTenants({ tenants }) {
    const { t } = useLang();
    const [search, setSearch] = useState('');
    const autoSlug = (s) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const filtered = tenants.filter(t =>
        t.nama_instansi.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase())
    );

    const [modal, setModal] = useState(null);
    const [activeTenant, setActiveTenant] = useState(null);

    const openModal = (type, tenant = null) => {
        setActiveTenant(tenant);
        setModal(type);
        if (type === 'edit-tenant' && tenant) {
            editForm.setData({ nama_instansi: tenant.nama_instansi, slug: tenant.slug });
        }
    };
    const closeModal = () => { setModal(null); setActiveTenant(null); };

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

    const deleteTenant = (id, name) => {
        if (!confirm(`⚠️ Hapus instansi "${name}"?\nSEMUA data akan ikut terhapus permanen!`)) return;
        router.delete(route('super-admin.tenants.destroy', id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Instansi - Super Admin" />
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">{t('tenants')}</h1>
                    <p className="text-sm text-slate-500">Daftar lengkap semua instansi di platform.</p>
                </div>
                <div className="flex items-center gap-4">
                    <input type="text" placeholder="Cari instansi..." value={search} onChange={e=>setSearch(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:border-primary outline-none"/>
                    <button onClick={() => openModal('add-tenant')} className="bg-primary hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Tambah Instansi
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(tenant => (
                    <div key={tenant.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{tenant.nama_instansi}</h3>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">{tenant.slug}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => openModal('edit-tenant', tenant)} className="p-1.5 bg-slate-50 text-slate-400 hover:text-primary rounded-lg transition-colors" title="Edit">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                </button>
                                <button onClick={() => deleteTenant(tenant.id, tenant.nama_instansi)} className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors" title="Hapus">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-teal-50 text-primary border border-teal-100 text-xs font-bold px-2 py-1 rounded-md">{tenant.antrian_hari_ini} antrian hari ini</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <p className="text-xl font-black text-slate-800">{tenant.layanans_count}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Layanan</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <p className="text-xl font-black text-slate-800">{tenant.lokets_count}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Loket</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <p className="text-xl font-black text-slate-800">{tenant.antrians_count}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Total</p>
                            </div>
                        </div>
                        {tenant.admins.length > 0 && (
                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Admin</p>
                                {tenant.admins.map((admin, i) => (
                                    <div key={i} className="flex items-center gap-2 mb-1">
                                        <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                                            <span className="text-[9px] font-black text-primary">{admin.name.charAt(0)}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 font-medium">{admin.name} <span className="text-slate-400">({admin.email})</span></p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-4 flex gap-2">
                            <a href={`/kiosk/${tenant.slug}`} target="_blank" className="flex-1 text-center border border-slate-200 hover:border-primary text-slate-600 hover:text-primary font-bold py-2 rounded-xl text-xs transition-colors">Kiosk</a>
                            <a href={`/tv/${tenant.slug}`} target="_blank" className="flex-1 text-center border border-slate-200 hover:border-primary text-slate-600 hover:text-primary font-bold py-2 rounded-xl text-xs transition-colors">TV Display</a>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-slate-400 col-span-3 text-center py-12">Tidak ada instansi yang cocok.</p>
                )}
            </div>

            {/* Modals */}
            <Modal show={modal === 'add-tenant'} title="Tambah Instansi Baru" onClose={closeModal}>
                <form onSubmit={submitAdd} className="space-y-4">
                    <InputField label="Nama Instansi" id="nama_instansi" type="text" placeholder="Dinas Kependudukan"
                        value={addForm.data.nama_instansi} error={addForm.errors.nama_instansi} required
                        onChange={e => { addForm.setData('nama_instansi', e.target.value); addForm.setData('slug', autoSlug(e.target.value)); }}/>
                    <InputField label="Slug URL" id="add_slug" type="text" placeholder="dinas-kependudukan"
                        value={addForm.data.slug} error={addForm.errors.slug} required
                        onChange={e => addForm.setData('slug', autoSlug(e.target.value))}/>
                    <button type="submit" disabled={addForm.processing}
                        className="w-full bg-primary hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 mt-4">
                        {addForm.processing ? 'Menyimpan...' : 'Simpan Instansi'}
                    </button>
                </form>
            </Modal>

            <Modal show={modal === 'edit-tenant'} title="Edit Data Instansi" onClose={closeModal}>
                <form onSubmit={submitEdit} className="space-y-4">
                    <InputField label="Nama Instansi" id="edit_nama" type="text"
                        value={editForm.data.nama_instansi} error={editForm.errors.nama_instansi} required
                        onChange={e => editForm.setData('nama_instansi', e.target.value)}/>
                    <InputField label="Slug URL" id="edit_slug" type="text"
                        value={editForm.data.slug} error={editForm.errors.slug} required
                        onChange={e => editForm.setData('slug', autoSlug(e.target.value))}/>
                    <button type="submit" disabled={editForm.processing}
                        className="w-full bg-primary hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 mt-4">
                        {editForm.processing ? 'Menyimpan...' : 'Perbarui Data'}
                    </button>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
