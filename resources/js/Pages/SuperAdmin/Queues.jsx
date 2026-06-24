import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

const STATUS_MAP = {
    waiting: { label: 'Menunggu',  bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    calling: { label: 'Dipanggil', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    serving: { label: 'Dilayani',  bg: 'bg-teal-50 text-primary border-teal-200' },
    done:    { label: 'Selesai',   bg: 'bg-slate-100 text-slate-500 border-slate-200' },
    skipped: { label: 'Dilewati',  bg: 'bg-red-50 text-red-600 border-red-200' },
};

export default function SuperAdminQueues({ antrians, stats }) {
    const { t } = useLang();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filtered = antrians.filter(a => {
        const matchSearch = a.nomor_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
                            a.tenant?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Semua Antrian - Super Admin" />
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">{t('queues')}</h1>
                <p className="text-sm text-slate-500">Semua antrian aktif hari ini di seluruh platform.</p>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[{label:'Total',val:stats.total,c:'text-slate-800'},{label:'Menunggu',val:stats.waiting,c:'text-accent'},{label:'Aktif',val:stats.calling,c:'text-blue-600'},{label:'Selesai',val:stats.done,c:'text-primary'}].map(s=>(
                    <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                        <p className={`text-3xl font-black ${s.c}`}>{s.val}</p>
                        <p className="text-xs font-bold text-slate-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                    <input type="text" placeholder="Cari nomor atau instansi..." value={search} onChange={e=>setSearch(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:border-primary outline-none"/>
                    <div className="flex gap-2">
                        {['all','waiting','calling','done','skipped'].map(s=>(
                            <button key={s} onClick={()=>setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${filterStatus===s?'bg-primary text-white border-primary':'bg-white text-slate-500 border-slate-200'}`}>
                                {s==='all'?'Semua':STATUS_MAP[s]?.label??s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                            <tr><th className="px-6 py-4">Nomor</th><th className="px-6 py-4">Instansi</th><th className="px-6 py-4">Layanan</th><th className="px-6 py-4">Loket</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Waktu</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(a=>{
                                const s=STATUS_MAP[a.status]??{label:a.status,bg:'bg-slate-100 text-slate-500 border-slate-200'};
                                return(
                                    <tr key={a.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-black text-slate-800 text-lg">{a.nomor_lengkap}</td>
                                        <td className="px-6 py-4 font-bold text-primary">{a.tenant}</td>
                                        <td className="px-6 py-4 font-medium">{a.layanan}</td>
                                        <td className="px-6 py-4 text-slate-500">{a.loket}</td>
                                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${s.bg}`}>{s.label}</span></td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{a.waktu}</td>
                                    </tr>
                                );
                            })}
                            {filtered.length===0&&<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Tidak ada data antrian.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
