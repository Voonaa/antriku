import { Head } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

// ──────────────────────────────────────────────────────────────
// Helper: Tunggu voices tersedia, lalu panggil callback
// Chrome loads voices async — kita harus menunggu event ini
// ──────────────────────────────────────────────────────────────
function waitForVoices() {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
            return;
        }
        window.speechSynthesis.onvoiceschanged = () => {
            resolve(window.speechSynthesis.getVoices());
        };
    });
}

// ──────────────────────────────────────────────────────────────
// Helper: Ucapkan teks dengan suara Indonesia
// ──────────────────────────────────────────────────────────────
async function speakText(text) {
    window.speechSynthesis.cancel(); // hentikan sebelumnya

    const voices = await waitForVoices();

    // Cari suara Indonesia, fallback ke suara apa saja
    const idVoice =
        voices.find(v => v.lang === 'id-ID') ||
        voices.find(v => v.lang.startsWith('id')) ||
        voices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang   = 'id-ID';
    utterance.rate   = 0.82;
    utterance.pitch  = 1;
    utterance.volume = 1;
    if (idVoice) utterance.voice = idVoice;

    window.speechSynthesis.speak(utterance);
}

export default function TvDisplay({ tenant }) {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [currentQueue, setCurrentQueue] = useState({
        nomor_lengkap: '---',
        layanan: { nama_layanan: 'Menunggu Panggilan' },
        loket: { nomor_loket: '-' }
    });
    const [isBlinking, setIsBlinking] = useState(false);
    // Ref untuk interval keep-alive (workaround bug Chrome)
    const keepAliveRef = useRef(null);

    // ── Aktifkan Audio ─────────────────────────────────────────
    const enableAudio = async () => {
        setIsAudioEnabled(true);

        // Unlock dengan kalimat nyata (bukan string kosong!)
        // volume rendah agar tidak mengganggu
        const voices = await waitForVoices();
        const unlock = new SpeechSynthesisUtterance('Sistem antrian siap');
        unlock.lang   = 'id-ID';
        unlock.volume = 0.01; // hampir tidak terdengar
        const idVoice = voices.find(v => v.lang.startsWith('id')) || voices[0];
        if (idVoice) unlock.voice = idVoice;
        window.speechSynthesis.speak(unlock);

        // ── Workaround Bug Chrome: synthesis mati setelah ~15 detik ──
        // Pause + Resume setiap 10 detik agar synthesis tetap "hidup"
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        keepAliveRef.current = setInterval(() => {
            if (!window.speechSynthesis.speaking) return;
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }, 10000);
    };

    // ── Dengarkan Event Antrian setelah Audio Aktif ────────────
    useEffect(() => {
        if (!isAudioEnabled) return;

        const channel = window.Echo.private(`tenant.${tenant.id}`);

        channel.listen('QueueCalled', (e) => {
            console.log('QueueCalled received:', e.antrian);

            const antrian = e.antrian;
            setCurrentQueue(antrian);

            // Animasi berkedip 5 detik
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 5000);

            // ── TTS: format nomor "A-001" → "A... kosong kosong satu" ──
            const parts = antrian.nomor_lengkap.split('-');
            const huruf = parts[0]
                .split('')
                .join('... ');
            const angka = (parts[1] || '')
                .split('')
                .map(c => (c === '0' ? 'kosong' : c))
                .join('... ');
            const loketNum = antrian.loket?.nomor_loket || '';
            const layananNama = antrian.layanan?.nama_layanan || '';

            const textToSpeak =
                `Nomor antrian... ${huruf}... ${angka}... ` +
                `layanan ${layananNama}... ` +
                `silakan menuju... loket... ${loketNum}`;

            // Jalankan TTS dengan sedikit jeda agar tidak berbarengan
            setTimeout(() => speakText(textToSpeak), 500);
        });

        return () => {
            channel.stopListening('QueueCalled');
            window.Echo.leave(`tenant.${tenant.id}`);
            if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        };
    }, [tenant.id, isAudioEnabled]);

    // ── LAYAR GATE ─────────────────────────────────────────────
    if (!isAudioEnabled) {
        return (
            <>
                <Head title={`TV Display - ${tenant.nama_instansi}`} />
                <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
                    <div className="text-center px-8 max-w-xl">
                        {tenant.logo && (
                            <img src={tenant.logo} alt="Logo" className="h-24 mx-auto mb-8 drop-shadow-2xl" />
                        )}
                        <h1 className="text-4xl font-bold text-white mb-2">{tenant.nama_instansi}</h1>
                        <p className="text-gray-400 text-lg mb-12">Sistem Antrian Digital</p>

                        <button
                            onClick={enableAudio}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl md:text-3xl py-8 px-12 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-5 mx-auto"
                        >
                            <svg className="w-10 h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Mulai TV &amp; Aktifkan Suara
                        </button>

                        <p className="text-gray-600 text-sm mt-6 leading-relaxed">
                            Browser memerlukan interaksi pengguna sebelum memulai suara.<br/>
                            Klik tombol di atas <strong className="text-gray-500">sekali saja</strong> untuk mengaktifkan pengumuman antrian.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // ── LAYAR TV UTAMA ─────────────────────────────────────────
    return (
        <>
            <Head title={`TV Display - ${tenant.nama_instansi}`} />

            <div className="min-h-screen bg-black flex overflow-hidden font-sans">
                {/* Kolom Kiri */}
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

                    {/* Badge suara aktif */}
                    <div className="z-10 absolute bottom-6 right-6 flex items-center gap-2 bg-green-900/60 text-green-400 border border-green-700 px-3 py-1.5 rounded-full text-sm font-bold">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Suara Aktif
                    </div>
                </div>

                {/* Kolom Kanan */}
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
