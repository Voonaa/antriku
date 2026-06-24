import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { useLang } from '@/Contexts/LangContext';

export default function PetugasIndex({ auth, layanans, lokets, waitingQueues, activeQueues }) {
    const { flash } = usePage().props;
    const { t } = useLang();
    const [selectedLayanan, setSelectedLayanan] = useState(layanans[0]?.id || '');
    const [selectedLoket, setSelectedLoket] = useState(lokets[0]?.id || '');

    const { data, setData, post, processing } = useForm({
        layanan_id: layanans[0]?.id || '',
        loket_id: lokets[0]?.id || '',
    });

    const handleLayananChange = (e) => {
        setSelectedLayanan(e.target.value);
        setData('layanan_id', e.target.value);
    };

    const handleLoketChange = (e) => {
        setSelectedLoket(e.target.value);
        setData('loket_id', e.target.value);
    };

    const callNext = (e) => {
        e.preventDefault();
        post(route('petugas.call'), { preserveScroll: true });
    };

    const markDone  = (id) => router.put(route('petugas.done', id), {}, { preserveScroll: true });
    const skipQueue = (id) => router.put(route('petugas.skip', id), {}, { preserveScroll: true });
    const recall    = (id) => router.put(route('petugas.recall', id), {}, { preserveScroll: true });

    const currentActive = activeQueues.find(q => q.loket_id == selectedLoket);
    const filteredWaiting = waitingQueues.filter(q => q.layanan_id == selectedLayanan);

    if (lokets.length === 0 || layanans.length === 0) {
        return (
            <AuthenticatedLayout>
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <p className="text-red-500 font-bold">Belum ada loket atau layanan yang terdaftar.</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Petugas Loket" />

            {/* Top Bar for Selection */}
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        className="border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 w-full md:w-48 outline-none focus:border-primary focus:ring-0"
                        value={selectedLayanan}
                        onChange={handleLayananChange}
                    >
                        {layanans.map(l => <option key={l.id} value={l.id}>{l.nama_layanan}</option>)}
                    </select>
                    <select
                        className="border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 w-full md:w-32 outline-none focus:border-primary focus:ring-0"
                        value={selectedLoket}
                        onChange={handleLoketChange}
                    >
                        {lokets.map(l => <option key={l.id} value={l.id}>{t('counter')} {l.nomor_loket}</option>)}
                    </select>
                </div>
                {flash?.success && <div className="text-sm font-bold text-primary">{flash.success}</div>}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Action Area */}
                <div className="flex-1 w-full flex flex-col gap-6">
                    
                    {/* Current Number Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
                        <p className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-6">{t('current_serving_number')}</p>
                        
                        {currentActive ? (
                            <>
                                <h1 className="text-8xl md:text-[8rem] font-black text-primary leading-none tracking-tighter mb-6">
                                    {currentActive.nomor_lengkap}
                                </h1>
                                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-600">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {t('wait_time')}: {Math.round((new Date(currentActive.waktu_panggil) - new Date(currentActive.created_at)) / 60000)}m
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-6xl md:text-8xl font-black text-slate-200 leading-none tracking-tighter mb-6">
                                    ---
                                </h1>
                                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-bold text-slate-400">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {t('idle')}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4">
                        {currentActive ? (
                            <>
                                <button 
                                    onClick={() => recall(currentActive.id)}
                                    className="w-full bg-accent hover:opacity-90 text-white font-black py-5 rounded-2xl shadow-lg transition-transform transform active:scale-95 text-lg tracking-wide flex items-center justify-center gap-3"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
                                    Panggil Lagi
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => skipQueue(currentActive.id)}
                                        className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                                        {t('skip')}
                                    </button>
                                    <button 
                                        onClick={() => markDone(currentActive.id)}
                                        className="bg-white border border-slate-200 hover:border-primary text-primary font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        {t('done')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button 
                                onClick={callNext}
                                disabled={processing || filteredWaiting.length === 0}
                                className="w-full bg-accent hover:opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-lg transition-transform transform active:scale-95 text-lg tracking-wide flex items-center justify-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" /></svg>
                                {t('call_next')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Waiting List */}
                <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl flex flex-col flex-shrink-0" style={{ height: 'calc(100vh - 12rem)' }}>
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">{t('waiting_list')}</h3>
                        <span className="text-xs font-bold text-primary bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                            {filteredWaiting.length} {t('in_queue')}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredWaiting.length > 0 ? (
                            filteredWaiting.map((queue, idx) => (
                                <div key={queue.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-accent' : 'bg-slate-300'}`}></div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg leading-tight">{queue.nomor_lengkap}</p>
                                            <p className="text-xs text-slate-500 font-medium">{queue.layanan?.nama_layanan || 'Queue'}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-slate-500">
                                        {Math.round((new Date() - new Date(queue.created_at)) / 60000)}m
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">Kosong</p>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
