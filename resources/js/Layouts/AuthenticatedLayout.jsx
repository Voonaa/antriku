import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const { lang, setLang, t } = useLang();
    
    // Dynamic routing for Dashboard link based on role
    const getDashboardRoute = () => {
        if (user.role === 'super-admin') return route('super-admin.dashboard');
        if (user.role === 'admin-instansi') return route('admin.dashboard');
        return route('petugas.dashboard');
    };

    const isSuperAdmin = user.role === 'super-admin';
    const isAdmin = user.role === 'admin-instansi';

    return (
        <div className="min-h-screen bg-[#F4F8F7] font-sans flex text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
                <div>
                    <div className="h-20 flex flex-col justify-center px-6 border-b border-transparent">
                        <Link href={getDashboardRoute()} className="flex flex-col">
                            <span className="text-2xl font-black text-primary tracking-tight">Antriku</span>
                            <span className="text-xs text-slate-500 font-medium">{t('enterprise_queue')}</span>
                        </Link>
                    </div>

                    <nav className="mt-6 px-4 space-y-1">
                        <Link
                            href={getDashboardRoute()}
                            className="flex items-center gap-3 px-4 py-3 bg-teal-50 text-primary font-bold rounded-xl border-l-4 border-primary transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm-10 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            {t('overview')}
                        </Link>
                        
                        {(isSuperAdmin || isAdmin) && (
                            <Link
                                href={isSuperAdmin ? route('super-admin.queues') : route('admin.queues')}
                                className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {t('queues')}
                            </Link>
                        )}

                        {isSuperAdmin && (
                            <Link
                                href={route('super-admin.tenants')}
                                className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                {t('tenants')}
                            </Link>
                        )}

                        {isSuperAdmin && (
                            <Link
                                href={route('super-admin.users.index')}
                                className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Manajemen Akun
                            </Link>
                        )}
                        
                        {(isSuperAdmin || isAdmin) && (
                            <Link
                                href={isSuperAdmin ? route('super-admin.analytics') : route('admin.analytics')}
                                className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                {t('analytics')}
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="p-4 mb-4">
                    <Link href={route('settings')} className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:bg-slate-50 hover:text-primary rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {t('settings')}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 px-8 flex items-center justify-between">
                    <div>
                        {/* Empty left side on header, could be page title if needed but screenshots show title in body */}
                    </div>
                    <div className="flex items-center gap-6">
                        
                        {/* Language Toggle */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                            <button 
                                onClick={() => setLang('id')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'id' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                ID
                            </button>
                            <button 
                                onClick={() => setLang('en')}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Notifications */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none relative">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <div className="px-4 py-3 border-b border-gray-100 text-sm">
                                    <p className="font-bold text-slate-800">Notifications</p>
                                </div>
                                <div className="p-4 text-center text-sm text-slate-500 italic">
                                    No new notifications.
                                </div>
                            </Dropdown.Content>
                        </Dropdown>

                        <Link href={route('support')} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </Link>

                        {/* Profile Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                    </div>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <div className="px-4 py-2 border-b border-gray-100 text-sm">
                                    <p className="font-bold text-slate-800">{user.name}</p>
                                    <p className="text-slate-500 text-xs">{user.email}</p>
                                </div>
                                <Dropdown.Link href={route('settings')}>Profile & Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>

                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto px-8 pb-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
