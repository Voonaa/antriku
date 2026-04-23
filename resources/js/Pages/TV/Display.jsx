import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function TvDisplay({ tenant }) {
    const [currentQueue, setCurrentQueue] = useState({
        nomor_lengkap: '---',
        layanan: { nama_layanan: 'Menunggu Panggilan' },
        loket: { nomor_loket: '-' }
    });
    
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        // Inisialisasi Audio
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        
        // Dengarkan channel Private tenant
        const channel = window.Echo.private(`tenant.${tenant.id}`);
        
        channel.listen('QueueCalled', (e) => {
            console.log('Antrian Dipanggil:', e.antrian);
            
            // Set Antrian Saat Ini
            setCurrentQueue(e.antrian);
            
            // Mainkan Suara Beep
            audio.play().catch(err => console.error("Audio play failed:", err));
            
            // Logika Text-to-Speech (TTS)
            if ('speechSynthesis' in window) {
                // Beri jeda sedikit agar suara beep selesai dulu
                setTimeout(() => {
                    const parts = e.antrian.nomor_lengkap.split('-');
                    const huruf = parts[0];
                    const angka = parts[1].split('').map(char => char === '0' ? 'kosong' : char).join('... ');
                    
                    const textToSpeak = `Nomor antrian... ${huruf}... ${angka}... silakan menuju... loket... ${e.antrian.loket?.nomor_loket}`;
                    
                    const utterance = new SpeechSynthesisUtterance(textToSpeak);
                    utterance.lang = 'id-ID';
                    utterance.rate = 0.85; // Sedikit diperlambat agar jelas
                    utterance.pitch = 1;
                    
                    window.speechSynthesis.speak(utterance);
                }, 1500); // Jeda 1.5 detik
            }
            
            // Animasi berkedip
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 5000); // Kedip selama 5 detik
        });

        return () => {
            channel.stopListening('QueueCalled');
            window.Echo.leave(`tenant.${tenant.id}`);
        };
    }, [tenant.id]);

    return (
        <>
            <Head title={`TV Display - ${tenant.nama_instansi}`} />
            
            <div className="min-h-screen bg-black flex overflow-hidden font-sans">
                {/* Kolom Kiri - Video Promosi / Informasi */}
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
