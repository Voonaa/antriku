import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import React from 'react';
import { useLang } from '@/Contexts/LangContext';

function StatCard({ label, value, subtext, icon }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-slate-800">{label}</span>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{value}</span>
                {subtext && <span className="text-xs font-bold text-primary bg-teal-50 px-2 py-0.5 rounded-md">{subtext}</span>}
            </div>
        </div>
    );
}

export default function SuperAdminIndex({ stats, tenants }) {
    const { flash } = usePage().props;
    const { t } = useLang();

    // Tampilkan 5 instansi terbaru untuk ringkasan di dashboard
    const recentTenants = tenants.slice(0, 5);

    return (
        <AuthenticatedLayout>
            <Head title="Super Admin Panel" />

            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-800">{t('overview')}</h1>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    {flash.success}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    label={t('total_tenants')} 
                    value={stats.total_tenants} 
                    subtext="+12%" 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                />
                <StatCard 
                    label={t('total_users')} 
                    value={stats.total_users} 
                    subtext="+5%" 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                />
                <StatCard 
                    label={t('active_queues')} 
                    value={stats.antrian_hari_ini} 
                    subtext={t('right_now')} 
                    icon={<svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>}
                />
                <StatCard 
                    label={t('total_services')} 
                    value={stats.total_layanans} 
                    subtext={t('across_tenants')} 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                />
            </div>

            {/* Tenants Table Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">Ringkasan Instansi</h3>
                    <Link href={route('super-admin.tenants')} className="text-primary hover:text-teal-700 font-bold text-sm flex items-center gap-1">
                        Lihat Semua / Kelola <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Nama Instansi</th>
                                <th className="px-6 py-4">Domain</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentTenants.map(tenant => (
                                <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">#TN-{tenant.id.toString().padStart(3, '0')}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{tenant.nama_instansi}</td>
                                    <td className="px-6 py-4 text-slate-500">{tenant.slug}.antriku.id</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider border border-teal-200 bg-teal-50 text-primary uppercase">
                                            {t('active')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentTenants.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">Belum ada instansi.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
