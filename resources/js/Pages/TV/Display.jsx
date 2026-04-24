import { Head } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

// ══════════════════════════════════════════════════════════════
// Helper: Konversi angka ke kata Bahasa Indonesia
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

        const now = ctx.currentTime;
        playTone(880, now,        0.6); 
        playTone(660, now + 0.35, 0.7); 

        return new Promise(resolve => setTimeout(resolve, 900));
    } catch (e) {
        return Promise.resolve();
    }
}

function waitForVoices() {
    return new Promise(resolve => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) { resolve(v); return; }
        window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
    });
}

function speakBankStyle(nomorLengkap, nomor_loket, nama_layanan) {
    return new Promise(async (resolve) => {
        window.speechSynthesis.cancel();

        const voices = await waitForVoices();

        const voice =
            voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('id')) ||
            voices.find(v => v.lang === 'id-ID') ||
            voices.find(v => v.lang.startsWith('id')) ||
            voices[0];

        const parts     = nomorLengkap.split('-');
        const huruf     = parts[0].toUpperCase();
        const angka     = parseInt(parts[1] || '0', 10);
        const loket     = parseInt(nomor_loket || '0', 10);
        const angkaKata = numberToId(angka);
        const loketKata = numberToId(loket);

        const kalimat =
            `Nomor antrian, ${huruf}, ${angkaKata}. ` +
            `Silakan menuju, loket, ${loketKata}. ` +
            `Layanan, ${nama_layanan}.`;

        const utter  = new SpeechSynthesisUtterance(kalimat);
        utter.lang   = 'id-ID';
        utter.rate   = 0.88;
        utter.pitch  = 1.05;
        utter.volume = 1;
        if (voice) utter.voice = voice;

        utter.onend   = resolve;
        utter.onerror = resolve;

        window.speechSynthesis.speak(utter);
    });
}

export default function TvDisplay({ tenant }) {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [currentQueue, setCurrentQueue]     = useState({
        id: null,
        nomor_lengkap: '---',
        layanan: { nama_layanan: 'Menunggu Panggilan' },
        loket:   { nomor_loket: '-' }
    });
    const [history, setHistory]               = useState([]);
    const [isBlinking, setIsBlinking]         = useState(false);
    const keepAliveRef                         = useRef(null);

    const enableAudio = async () => {
        setIsAudioEnabled(true);
        const voices = await waitForVoices();
        const unlock = new SpeechSynthesisUtterance('Sistem antrian siap');
        unlock.lang   = 'id-ID';
        unlock.volume = 0.01;
        const idVoice = voices.find(v => v.lang.startsWith('id')) || voices[0];
        if (idVoice) unlock.voice = idVoice;
        window.speechSynthesis.speak(unlock);

        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        keepAliveRef.current = setInterval(() => {
            if (!window.speechSynthesis.speaking) return;
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }, 10000);
    };

    useEffect(() => {
        if (!isAudioEnabled) return;

        const channel = window.Echo.private(`tenant.${tenant.id}`);

        channel.listen('QueueCalled', async (e) => {
            const antrian = e.antrian;
            
            setCurrentQueue(prev => {
                if (prev.nomor_lengkap !== '---' && prev.id !== antrian.id) {
                    setHistory(h => [prev, ...h].slice(0, 3));
                }
                return antrian;
            });

            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 18000);

            await playBankDing();
            await speakBankStyle(
                antrian.nomor_lengkap,
                antrian.loket?.nomor_loket,
                antrian.layanan?.nama_layanan || ''
            );

            await new Promise(r => setTimeout(r, 2000));

            await playBankDing();
            await speakBankStyle(
                antrian.nomor_lengkap,
                antrian.loket?.nomor_loket,
                antrian.layanan?.nama_layanan || ''
            );
        });

        return () => {
            channel.stopListening('QueueCalled');
            window.Echo.leave(`tenant.${tenant.id}`);
            if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        };
    }, [tenant.id, isAudioEnabled]);

    if (!isAudioEnabled) {
        return (
            <>
                <Head title={`TV Display - ${tenant.nama_instansi}`} />
                <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-sans selection:bg-accent selection:text-white">
                    <div className="text-center px-8 max-w-xl">
                        <img 
                            src="/storage/logo.png" 
                            alt="Logo" 
                            className="h-28 mx-auto mb-8 drop-shadow-2xl object-contain" 
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <div className="hidden mb-8">
                            <span className="text-5xl font-black text-white">Antriku</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{tenant.nama_instansi}</h1>
                        <p className="text-primary font-bold text-xl mb-12">Sistem Antrian Digital</p>

                        <button
                            onClick={enableAudio}
                            className="bg-accent hover:bg-orange-600 text-white font-black text-2xl md:text-3xl py-8 px-12 rounded-[2rem] shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-5 mx-auto"
                        >
                            <svg className="w-10 h-10 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                            </svg>
                            Mulai TV & Aktifkan Suara
                        </button>
                        <p className="text-slate-400 font-semibold text-sm mt-8">
                            * Diperlukan interaksi pertama untuk membuka akses suara pada browser
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`TV Display - ${tenant.nama_instansi}`} />

            <div className="h-screen bg-black flex overflow-hidden font-sans">

                {/* Kolom Kiri: Video Promosi (60%) */}
                <div className="w-[60%] bg-slate-950 flex flex-col p-6">
                    <div className="w-full flex-grow rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative flex flex-col items-center justify-center">
                        <svg className="w-24 h-24 text-slate-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <p className="text-slate-500 text-3xl font-black uppercase tracking-widest">Video Promosi / Edukasi</p>
                        <p className="text-slate-600 mt-2 font-medium">Bisa diisi iframe YouTube Instansi</p>
                        
                        {/* Overlay Gradient bawah untuk estetika */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    </div>
                </div>

                {/* Kolom Kanan: Nomor Antrian (40%) */}
                <div className="w-[40%] bg-primary flex flex-col p-10 border-l-[12px] border-accent shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-10 relative">
                    
                    {/* Background Pattern Lembut */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] pointer-events-none"></div>

                    {/* Header Kanan: Logo & Jam */}
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <img 
                            src="/storage/logo.png" 
                            alt="Logo" 
                            className="h-14 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                        <div className="hidden">
                            <span className="text-2xl font-black text-white">Antriku</span>
                        </div>
                        <LiveClock />
                    </div>

                    {/* Main Focus: Angka Antrian */}
                    <div className="flex-grow flex flex-col justify-center items-center text-center relative z-10 -mt-10">
                        <p className="text-white/80 text-2xl uppercase tracking-widest font-bold mb-4 bg-white/10 px-8 py-2 rounded-full border border-white/20">
                            Nomor Antrian Saat Ini
                        </p>
                        
                        <div className={`transition-all duration-300 transform ${isBlinking ? 'scale-110' : 'scale-100'}`}>
                            <span className="text-[12rem] font-black text-accent drop-shadow-[0_0_40px_rgba(249,115,22,0.8)] leading-none block my-6" style={{ textShadow: '4px 4px 0 #fff' }}>
                                {currentQueue.nomor_lengkap}
                            </span>
                        </div>

                        <p className="text-5xl text-white font-black mb-6 drop-shadow-md">
                            Silakan menuju Loket {currentQueue.loket?.nomor_loket || '-'}
                        </p>
                        <p className="text-2xl text-white font-bold bg-black/20 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                            {currentQueue.layanan?.nama_layanan || '-'}
                        </p>
                    </div>

                    {/* Ticker / Riwayat Bawah */}
                    <div className="mt-auto pt-6 relative z-10">
                        <p className="text-white/60 text-sm uppercase tracking-widest mb-4 font-black flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Antrian Sebelumnya
                        </p>
                        <div className="flex flex-col gap-3">
                            {history.length > 0 ? history.map((q, i) => (
                                <div key={i} className="flex justify-between items-center bg-black/20 rounded-2xl px-6 py-4 border border-white/5 backdrop-blur-sm">
                                    <span className="text-3xl font-black text-white/70 tracking-tighter">{q.nomor_lengkap}</span>
                                    <span className="text-xl font-bold text-white/50 bg-white/5 px-4 py-1 rounded-lg">Loket {q.loket?.nomor_loket}</span>
                                </div>
                            )) : (
                                <p className="text-white/30 italic text-base">Belum ada riwayat antrian</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="text-white text-3xl font-black tracking-widest font-mono bg-black/20 px-5 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-inner">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
    );
}
