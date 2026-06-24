import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#0D9488', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

function StatCard({ label, value, subtext, colorClass = 'bg-teal-50 text-primary', icon }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
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

export default function AdminAnalytics({ stats, weeklyData, byLayanan }) {
    const { t } = useLang();
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);

    return (
        <AuthenticatedLayout>
            <Head title="Analytics - Admin" />

            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">{t('analytics')}</h1>
                    <p className="text-sm text-slate-500">Ringkasan performa antrian instansi Anda.</p>
                </div>
                {/* Download Excel Button */}
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={tanggal}
                        onChange={e => setTanggal(e.target.value)}
                        className="border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:border-primary outline-none"
                    />
                    <a
                        href={`/admin/laporan?tanggal=${tanggal}`}
                        className="bg-primary hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-xl text-sm flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download Excel
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Antrian" value={stats.total_hari_ini}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}/>
                <StatCard label="Selesai" value={stats.total_selesai} colorClass="bg-teal-50 text-primary"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}/>
                <StatCard label="Menunggu" value={stats.total_menunggu} colorClass="bg-orange-50 text-accent"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}/>
                <StatCard label="Total Layanan" value={stats.total_layanan} colorClass="bg-slate-100 text-slate-600"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Tren Antrian 7 Hari Terakhir</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorTotalA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}/>
                            <Legend />
                            <Area type="monotone" dataKey="total" name="Total" stroke="#0D9488" strokeWidth={2.5} fill="url(#colorTotalA)"/>
                            <Area type="monotone" dataKey="selesai" name="Selesai" stroke="#F97316" strokeWidth={2} fill="none" strokeDasharray="4 2"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Antrian per Layanan (Hari Ini)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={byLayanan}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                            <XAxis dataKey="nama" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}/>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}/>
                            <Bar dataKey="total" name="Antrian" radius={[6, 6, 0, 0]}>
                                {byLayanan.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
