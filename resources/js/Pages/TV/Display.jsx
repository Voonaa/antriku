import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function TvDisplay({ tenant }) {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [currentQueue, setCurrentQueue] = useState({
        nomor_lengkap: '---',
        layanan: { nama_layanan: 'Menunggu Panggilan' },
        loket: { nomor_loket: '-' }
    });
    const [isBlinking, setIsBlinking] = useState(false);

    // Aktifkan audio context browser (harus dipicu oleh interaksi user)
    const enableAudio = () => {
        // Unlock speech synthesis dengan utterance kosong
        if ('speechSynthesis' in window) {
            const unlock = new SpeechSynthesisUtterance('');
            window.speechSynthesis.speak(unlock);
        }
        setIsAudioEnabled(true);
    };

    useEffect(() => {
        if (!isAudioEnabled) return;

        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

        const channel = window.Echo.private(`tenant.${tenant.id}`);

        channel.listen('QueueCalled', (e) => {
            console.log('Antrian Dipanggil:', e.antrian);

            setCurrentQueue(e.antrian);

            // Mainkan suara beep
            audio.play().catch(err => console.error('Audio play failed:', err));

            // Logika TTS hanya berjalan jika audio sudah diaktifkan
            if ('speechSynthesis' in window) {
                setTimeout(() => {
                    const parts = e.antrian.nomor_lengkap.split('-');
                    const huruf = parts[0];
                    const angka = parts[1]
                        .split('')
                        .map(char => (char === '0' ? 'kosong' : char))
                        .join('... ');

                    const textToSpeak = `Nomor antrian... ${huruf}... ${angka}... silakan menuju... loket... ${e.antrian.loket?.nomor_loket}`;

                    const utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.lang = 'id-ID';
                    utterance.rate = 0.85;
                    utterance.pitch = 1;

                    window.speechSynthesis.speak(utterance);
                }, 1500);
            }

            // Animasi berkedip
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 5000);
        });

        return () => {
            channel.stopListening('QueueCalled');
            window.Echo.leave(`tenant.${tenant.id}`);
        };
    }, [tenant.id, isAudioEnabled]);

    // ─── LAYAR GATE: Tombol Aktifkan TV ─────────────────────────────────
    if (!isAudioEnabled) {
        return (
            <>
                <Head title={`TV Display - ${tenant.nama_instansi}`} />
                <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
                    <div className="text-center px-8">
                        {tenant.logo && (
                            <img src={tenant.logo} alt="Logo" className="h-24 mx-auto mb-8 drop-shadow-2xl" />
                        )}
                        <h1 className="text-4xl font-bold text-white mb-2">{tenant.nama_instansi}</h1>
                        <p className="text-gray-400 text-lg mb-12">Sistem Antrian Digital</p>

                        <button
                            onClick={enableAudio}
                            className="group bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl py-8 px-16 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-6 mx-auto"
                        >
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Mulai TV &amp; Aktifkan Suara
                        </button>

                        <p className="text-gray-600 text-sm mt-8">
                            Klik tombol di atas untuk mengaktifkan layar TV dan pengumuman suara antrian.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // ─── LAYAR TV UTAMA ─────────────────────────────────────────────────
    return (
        <>
            <Head title={`TV Display - ${tenant.nama_instansi}`} />

            <div className="min-h-screen bg-black flex overflow-hidden font-sans">
                {/* Kolom Kiri - Informasi Instansi */}
                <div className="w-1/2 bg-gray-900 flex flex-col justify-center items-center relative p-8">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>

                    <div className="z-10 text-center">
                        {tenant.logo && (
                            <img src={tenant.logo} alt="Logo" className="h-32 mx-auto mb-8 drop-shadow-2xl" />
                        )}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                            {tenant.nama_instansi}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md mx-auto">
                            Melayani dengan sepenuh hati. Silakan perhatikan layar panggilan antrian Anda.
                        </p>
                    </div>

                    {/* Indikator Status Suara */}
                    <div className="z-10 absolute bottom-6 right-6 flex items-center gap-2 bg-green-900/50 text-green-400 border border-green-800 px-3 py-1.5 rounded-full text-sm font-bold">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Suara Aktif
                    </div>
                </div>

                {/* Kolom Kanan - Display Antrian */}
                <div className="w-1/2 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 flex flex-col items-center justify-center p-12 border-l-8 border-blue-500">
                    <div className="w-full text-center mb-12">
                        <h2 className="text-3xl text-blue-200 font-semibold tracking-widest uppercase">
                            Nomor Antrian
                        </h2>
                    </div>

                    <div className={`transition-all duration-300 transform ${isBlinking ? 'scale-110' : 'scale-100'}`}>
                        <div className={`bg-white rounded-[3rem] shadow-2xl p-16 w-full max-w-xl mx-auto flex items-center justify-center border-b-[16px] ${isBlinking ? 'border-yellow-400 bg-yellow-50' : 'border-blue-600'}`}>
                            <span className={`text-[12rem] leading-none font-black tracking-tighter ${isBlinking ? 'text-yellow-600' : 'text-blue-700'}`}>
                                {currentQueue.nomor_lengkap}
                            </span>
                        </div>
                    </div>

                    <div className="mt-16 w-full max-w-xl grid grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                            <p className="text-blue-300 text-lg uppercase tracking-wider mb-2">Ke Loket</p>
                            <p className="text-4xl font-bold text-white">{currentQueue.loket?.nomor_loket || '-'}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                            <p className="text-blue-300 text-lg uppercase tracking-wider mb-2">Layanan</p>
                            <p className="text-3xl font-bold text-white leading-tight truncate">{currentQueue.layanan?.nama_layanan || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
