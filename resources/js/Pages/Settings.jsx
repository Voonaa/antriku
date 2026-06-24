import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

export default function Settings({ auth }) {
    const { t, lang, setLang } = useLang();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    return (
        <AuthenticatedLayout>
            <Head title={t('settings') || "Settings"} />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800">{t('settings') || "Settings"}</h1>
                <p className="text-sm text-slate-500">Manage your personal preferences and account settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Profile</h3>
                    <p className="text-sm text-slate-500">Update your account's profile information and email address.</p>
                </div>
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">{auth.user.name}</h4>
                            <p className="text-slate-500 text-sm">{auth.user.email}</p>
                            <span className="inline-block mt-1 bg-teal-50 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase">{auth.user.role}</span>
                        </div>
                    </div>
                    <Link href={route('profile.edit')} className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-xl text-sm transition-colors">
                        Edit Profile
                    </Link>
                </div>

                {/* Preferences Section */}
                <div className="md:col-span-1 mt-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Preferences</h3>
                    <p className="text-sm text-slate-500">Customize your dashboard experience.</p>
                </div>
                <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
                    
                    <div className="mb-6">
                        <h4 className="font-bold text-slate-800 mb-3">Language / Bahasa</h4>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setLang('id')}
                                className={`px-4 py-3 rounded-xl border-2 font-bold flex-1 transition-all ${lang === 'id' ? 'border-primary bg-teal-50 text-primary' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                Bahasa Indonesia
                            </button>
                            <button 
                                onClick={() => setLang('en')}
                                className={`px-4 py-3 rounded-xl border-2 font-bold flex-1 transition-all ${lang === 'en' ? 'border-primary bg-teal-50 text-primary' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-3">Notifications</h4>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-700">Push Notifications</p>
                                <p className="text-xs text-slate-500">Receive alerts when queues are empty or when wait times are high.</p>
                            </div>
                            <button 
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
