import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import { useLang } from '@/Contexts/LangContext';
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function StatCard({ label, value, subtext, icon, colorClass = 'bg-teal-50 text-primary' }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>{icon}</div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{value}</span>
                {subtext && <span className="text-xs font-bold text-slate-400">{subtext}</span>}
            </div>
        </div>
    );
}

export default function SuperAdminAnalytics({ stats, weeklyData, byTenant }) {
    const { t } = useLang();

    return (
        <AuthenticatedLayout>
            <Head title="Super Admin Analytics" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">{t('analytics')}</h1>
                <p className="text-sm text-slate-500">Statistik platform Antriku secara keseluruhan.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <StatCard label="Antrian Hari Ini" value={stats.total_antrian_hari_ini}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}/>
                <StatCard label="Selesai" value={stats.total_selesai} colorClass="bg-teal-50 text-primary"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}/>
                <StatCard label="Menunggu" value={stats.total_menunggu} colorClass="bg-orange-50 text-accent"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}/>
                <StatCard label="Total Instansi" value={stats.total_tenants} colorClass="bg-slate-100 text-slate-600"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Tren Antrian 7 Hari Terakhir</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}/>
                            <Legend />
                            <Area type="monotone" dataKey="total" name="Total" stroke="#0D9488" strokeWidth={2.5} fill="url(#colorTotal)"/>
                            <Area type="monotone" dataKey="selesai" name="Selesai" stroke="#F97316" strokeWidth={2} fill="url(#colorSelesai)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* By Tenant */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Antrian per Instansi (Hari Ini)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={byTenant} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                            <YAxis dataKey="nama" type="category" width={90} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}/>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}/>
                            <Bar dataKey="total" name="Total" fill="#0D9488" radius={[0, 6, 6, 0]}/>
                            <Bar dataKey="selesai" name="Selesai" fill="#F97316" radius={[0, 6, 6, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
