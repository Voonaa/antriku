import { Head } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

// ══════════════════════════════════════════════════════════════
// Helper: Konversi angka ke kata Bahasa Indonesia
// Contoh: 25 → "dua puluh lima", 101 → "seratus satu"
// ══════════════════════════════════════════════════════════════
function numberToId(n) {
    const ones = [
        '', 'satu', 'dua', 'tiga', 'empat', 'lima',
        'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh',
        'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas',
        'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'
    ];
    const tens = [
        '', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh',
        'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'
    ];
    if (n === 0)   return 'nol';
    if (n < 20)    return ones[n];
    if (n < 100)   return tens[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + ones[n % 10] : '');
    if (n < 200)   return 'seratus' + (n - 100 > 0 ? ' ' + numberToId(n - 100) : '');
    if (n < 1000)  return ones[Math.floor(n / 100)] + ' ratus' + (n % 100 > 0 ? ' ' + numberToId(n % 100) : '');
    return String(n);
}

// ══════════════════════════════════════════════════════════════
// Helper: Buat bunyi "ding" bank menggunakan Web Audio API
// Tidak memerlukan file eksternal
// ══════════════════════════════════════════════════════════════
function playBankDing() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();

        const playTone = (freq, startTime, duration, vol = 0.4) => {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(vol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        // Dua nada "ding dong" khas bank
        const now = ctx.currentTime;
        playTone(880, now,        0.6); // ding
        playTone(660, now + 0.35, 0.7); // dong

        return new Promise(resolve => setTimeout(resolve, 900));
    } catch (e) {
        return Promise.resolve();
    }
}

// ══════════════════════════════════════════════════════════════
// Helper: Tunggu voices tersedia (Chrome loads async)
// ══════════════════════════════════════════════════════════════
function waitForVoices() {
    return new Promise(resolve => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) { resolve(v); return; }
        window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
    });
}

// ══════════════════════════════════════════════════════════════
// Helper: Bicara seperti petugas bank
// Format: "Nomor antrian, A, dua puluh lima.
//          Silakan menuju, loket, tiga."
// ══════════════════════════════════════════════════════════════
async function speakBankStyle(nomorLengkap, nomor_loket, nama_layanan) {
    window.speechSynthesis.cancel();

    const voices = await waitForVoices();

    // Prioritas: Google Bahasa Indonesia → id-ID apa saja → fallback
    const voice =
        voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('id')) ||
        voices.find(v => v.lang === 'id-ID') ||
        voices.find(v => v.lang.startsWith('id')) ||
        voices[0];

    // Parse nomor: "A-025" → huruf="A", angka=25 → "dua puluh lima"
    const parts   = nomorLengkap.split('-');
    const huruf   = parts[0].toUpperCase();
    const angka   = parseInt(parts[1] || '0', 10);
    const loket   = parseInt(nomor_loket || '0', 10);

    const angkaKata = numberToId(angka);
    const loketKata = numberToId(loket);

    // Format kalimat bank: jelas, formal, ada jeda dengan koma
    const kalimat =
        `Nomor antrian, ${huruf}, ${angkaKata}. ` +
        `Silakan menuju, loket, ${loketKata}. ` +
        `Layanan, ${nama_layanan}.`;

    const utter   = new SpeechSynthesisUtterance(kalimat);
    utter.lang    = 'id-ID';
    utter.rate    = 0.88;   // sedikit lambat agar jelas
    utter.pitch   = 1.05;   // sedikit lebih tinggi agar terdengar cerah
    utter.volume  = 1;
    if (voice) utter.voice = voice;

    window.speechSynthesis.speak(utter);
}

// ══════════════════════════════════════════════════════════════
// Komponen Utama
// ══════════════════════════════════════════════════════════════
export default function TvDisplay({ tenant }) {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [currentQueue, setCurrentQueue]     = useState({
        nomor_lengkap: '---',
        layanan: { nama_layanan: 'Menunggu Panggilan' },
        loket:   { nomor_loket: '-' }
    });
    const [isBlinking, setIsBlinking]         = useState(false);
    const keepAliveRef                         = useRef(null);

    // ── Aktifkan audio (harus dipicu klik pengguna) ───────────
    const enableAudio = async () => {
        setIsAudioEnabled(true);
        const voices = await waitForVoices();
        const unlock = new SpeechSynthesisUtterance('Sistem antrian siap');
        unlock.lang   = 'id-ID';
        unlock.volume = 0.01;
        const idVoice = voices.find(v => v.lang.startsWith('id')) || voices[0];
        if (idVoice) unlock.voice = idVoice;
        window.speechSynthesis.speak(unlock);

        // Workaround bug Chrome: synthesis freeze setelah ~15 detik idle
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        keepAliveRef.current = setInterval(() => {
            if (!window.speechSynthesis.speaking) return;
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }, 10000);
    };

    // ── Dengarkan event dari Reverb ───────────────────────────
    useEffect(() => {
        if (!isAudioEnabled) return;

        const channel = window.Echo.private(`tenant.${tenant.id}`);

        channel.listen('QueueCalled', async (e) => {
            const antrian = e.antrian;
            setCurrentQueue(antrian);

            // Animasi berkedip 6 detik
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 6000);

            // 1) Mainkan bunyi "ding dong" bank
            await playBankDing();

            // 2) Ucapkan pengumuman gaya bank
            await speakBankStyle(
                antrian.nomor_lengkap,
                antrian.loket?.nomor_loket,
                antrian.layanan?.nama_layanan || ''
            );

            // 3) Ulangi sekali setelah 2 detik (seperti di bank)
            setTimeout(async () => {
                await playBankDing();
                await speakBankStyle(
                    antrian.nomor_lengkap,
                    antrian.loket?.nomor_loket,
                    antrian.layanan?.nama_layanan || ''
                );
            }, 4000);
        });

        return () => {
            channel.stopListening('QueueCalled');
            window.Echo.leave(`tenant.${tenant.id}`);
            if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        };
    }, [tenant.id, isAudioEnabled]);

    // ── GATE: Layar sebelum aktifkan suara ───────────────────
    if (!isAudioEnabled) {
        return (
            <>
                <Head title={`TV Display - ${tenant.nama_instansi}`} />
                <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-sans">
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
                        <p className="text-gray-600 text-sm mt-6">
                            Klik sekali untuk mengaktifkan pengumuman suara antrian.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // ── LAYAR TV UTAMA ────────────────────────────────────────
    return (
        <>
            <Head title={`TV Display - ${tenant.nama_instansi}`} />

            <div className="min-h-screen bg-black flex overflow-hidden font-sans">

                {/* Kolom Kiri: Identitas Instansi */}
                <div className="w-2/5 bg-gradient-to-b from-blue-950 to-blue-900 flex flex-col justify-between items-center relative p-10">
                    {/* Background subtle */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')] bg-cover bg-center"/>

                    <div className="z-10 w-full text-center mt-8">
                        {tenant.logo ? (
                            <img src={tenant.logo} alt="Logo" className="h-28 mx-auto mb-6 drop-shadow-2xl object-contain"/>
                        ) : (
                            <div className="w-24 h-24 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                <span className="text-4xl font-black text-white">{tenant.nama_instansi?.charAt(0)}</span>
                            </div>
                        )}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                            {tenant.nama_instansi}
                        </h1>
                        <p className="text-blue-300 text-base max-w-xs mx-auto leading-relaxed">
                            Melayani dengan sepenuh hati
                        </p>
                    </div>

                    {/* Info Layanan */}
                    <div className="z-10 w-full">
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/10 mb-4">
                            <p className="text-blue-300 text-sm uppercase tracking-widest mb-1">Layanan Saat Ini</p>
                            <p className="text-white font-bold text-xl leading-tight">
                                {currentQueue.layanan?.nama_layanan || '-'}
                            </p>
                        </div>
                        {/* Badge suara aktif */}
                        <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-bold">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                            Suara Aktif — Gaya Bank
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Nomor Antrian */}
                <div className="w-3/5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col items-center justify-center p-10 border-l-4 border-blue-600">

                    <p className="text-blue-300 text-xl font-semibold tracking-[0.3em] uppercase mb-10">
                        Nomor Antrian Dipanggil
                    </p>

                    {/* Kotak nomor besar */}
                    <div className={`w-full max-w-2xl transition-all duration-500 transform ${isBlinking ? 'scale-105' : 'scale-100'}`}>
                        <div className={`rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center py-14 px-8 border-b-[12px] transition-colors duration-300 ${
                            isBlinking
                                ? 'bg-yellow-50 border-yellow-400'
                                : 'bg-white border-blue-600'
                        }`}>
                            <span className={`font-black leading-none tracking-tighter transition-colors duration-300 ${
                                isBlinking ? 'text-yellow-600' : 'text-blue-700'
                            }`} style={{ fontSize: 'clamp(5rem, 18vw, 14rem)' }}>
                                {currentQueue.nomor_lengkap}
                            </span>

                            {isBlinking && (
                                <span className="mt-4 text-yellow-600 font-bold text-2xl animate-bounce">
                                    ▶ Silakan Menuju Loket
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info Loket */}
                    <div className="mt-10 flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-10 py-5 backdrop-blur">
                        <div className="text-center">
                            <p className="text-blue-300 text-sm uppercase tracking-widest mb-1">Ke Loket</p>
                            <p className="text-5xl font-black text-white">
                                {currentQueue.loket?.nomor_loket || '-'}
                            </p>
                        </div>
                    </div>

                    {/* Jam */}
                    <LiveClock />
                </div>
            </div>
        </>
    );
}

// ── Jam Real-time ─────────────────────────────────────────────
function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="mt-8 text-blue-400 text-2xl font-mono tracking-widest">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
    );
}
