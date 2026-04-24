import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect } from 'react';

export default function Ticket({ ticket, tenant, onClose }) {
    // Auto close ticket after 5 seconds (not in print mode though, but window.print blocks it usually, so it's fine)
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    // Auto print on load
    useEffect(() => {
        const printTimer = setTimeout(() => {
            window.print();
        }, 500); 
        return () => clearTimeout(printTimer);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white text-dark rounded-3xl shadow-2xl p-10 max-w-sm w-full relative overflow-hidden font-sans
                        print:shadow-none print:p-0 print:rounded-none print:w-[78mm] print:mx-auto print:bg-white print:text-black print:overflow-visible">
            
            {/* Screen only decor */}
            <div className="absolute top-0 left-0 w-full h-4 bg-primary print:hidden"></div>
            
            {/* Header */}
            <div className="text-center mb-6 mt-4 print:mt-0 print:mb-6">
                <img 
                    src="/storage/logo.png" 
                    alt="Logo" 
                    className="h-16 mx-auto mb-3 print:grayscale print:h-12 object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <div className="hidden mb-3">
                    <span className="text-2xl font-black text-black">Antriku</span>
                </div>
                
                <h2 className="text-xl font-black text-dark tracking-wide print:text-black print:text-lg leading-snug uppercase">
                    {tenant.nama_instansi}
                </h2>
            </div>

            {/* Main Number Area */}
            <div className="text-center mb-6 print:mb-8 border-y-2 border-dashed border-gray-200 print:border-black py-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 print:text-black print:text-sm">Nomor Antrian Anda</p>
                <div className="flex justify-center">
                    <span className="text-[6rem] leading-none font-black text-primary tracking-tighter print:text-black print:text-[5rem]">
                        {ticket.nomor_lengkap}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="text-center mb-8 print:mb-8">
                <p className="text-xl font-bold text-dark print:text-black mb-1">{ticket.layanan?.nama_layanan || 'Layanan'}</p>
                <p className="text-sm text-gray-500 font-medium print:text-black">{new Date(ticket.created_at).toLocaleString('id-ID')}</p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center mb-8 print:mb-8">
                <p className="text-sm text-gray-500 mb-3 font-bold print:text-black print:mb-2">Scan QR untuk Live Tracking</p>
                <div className="p-3 bg-white border-2 border-gray-100 rounded-2xl shadow-sm print:p-0 print:border-0 print:shadow-none">
                    <QRCodeCanvas 
                        value={window.location.origin + `/track/${ticket.token_qr}`} 
                        size={140} 
                        level={"H"} 
                        className="print:w-28 print:h-28"
                    />
                </div>
            </div>

            {/* Screen Only Footer */}
            <div className="text-center text-sm font-semibold text-accent bg-accent/10 rounded-xl p-4 mb-6 print:hidden">
                Silakan ambil struk Anda. Layar ini akan kembali dalam 5 detik.
            </div>

            <div className="space-y-3 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="w-full bg-primary hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    <span>Cetak Tiket Lagi</span>
                </button>

                <button 
                    onClick={onClose}
                    className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-dark font-bold py-4 px-6 rounded-2xl transition-all duration-200 active:scale-95"
                >
                    Tutup Layar Ini
                </button>
            </div>
        </div>
    );
}
