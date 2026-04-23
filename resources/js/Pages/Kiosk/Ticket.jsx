import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect } from 'react';

export default function Ticket({ ticket, tenant, onClose }) {
    // Auto close ticket after 10 seconds (only if not printing)
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-10 max-w-sm w-full relative overflow-hidden print:shadow-none print:p-0 print:rounded-none print:w-[58mm] print:mx-auto print:bg-white print:text-black">
            {/* Header Border (Hidden on print) */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 to-indigo-600 print:hidden"></div>
            
            <div className="text-center mb-8 mt-4 print:mt-0 print:mb-4">
                {tenant.logo && <img src={tenant.logo} alt="Logo" className="h-12 mx-auto mb-2 hidden print:block grayscale" />}
                <h2 className="text-xl font-bold text-gray-600 uppercase tracking-wider print:text-black print:text-sm">{tenant.nama_instansi}</h2>
                <p className="text-sm text-gray-500 mt-1 print:text-xs print:text-black">Nomor Antrian Anda</p>
            </div>

            <div className="flex justify-center mb-8 print:mb-4">
                <div className="bg-blue-50 border-4 border-blue-100 rounded-2xl w-48 h-48 flex items-center justify-center shadow-inner print:bg-transparent print:border-0 print:shadow-none print:h-auto print:w-auto">
                    <span className="text-6xl font-black text-blue-700 tracking-tighter print:text-black print:text-4xl">
                        {ticket.nomor_lengkap}
                    </span>
                </div>
            </div>

            <div className="text-center mb-4 hidden print:block">
                <p className="text-xs font-bold">{ticket.layanan?.nama_layanan || 'Layanan'}</p>
                <p className="text-[10px] mt-1">{new Date(ticket.created_at).toLocaleString('id-ID')}</p>
            </div>

            <div className="flex flex-col items-center justify-center mb-8 print:mb-4">
                <p className="text-xs text-gray-400 mb-3 uppercase font-semibold print:text-[10px] print:text-black print:mb-1">Scan untuk pantau antrian</p>
                <div className="p-3 bg-white border-2 border-gray-100 rounded-xl shadow-sm print:p-0 print:border-0 print:shadow-none">
                    <QRCodeCanvas 
                        value={window.location.origin + `/status/${ticket.id}`} 
                        size={120} 
                        level={"H"} 
                        className="print:w-20 print:h-20"
                    />
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-xl p-4 mb-6 print:hidden">
                Silakan duduk dan tunggu panggilan Anda. Layar ini akan tertutup secara otomatis.
            </div>

            <div className="space-y-3 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    <span>Cetak Tiket</span>
                </button>

                <button 
                    onClick={onClose}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                    Tutup & Kembali
                </button>
            </div>
        </div>
    );
}
