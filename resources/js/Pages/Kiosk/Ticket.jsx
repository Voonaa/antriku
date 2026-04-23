import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect } from 'react';

export default function Ticket({ ticket, tenant, onClose }) {
    // Auto close ticket after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-10 max-w-sm w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="text-center mb-8 mt-4">
                <h2 className="text-xl font-bold text-gray-600 uppercase tracking-wider">{tenant.nama_instansi}</h2>
                <p className="text-sm text-gray-500 mt-1">Nomor Antrian Anda</p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-blue-50 border-4 border-blue-100 rounded-2xl w-48 h-48 flex items-center justify-center shadow-inner">
                    <span className="text-6xl font-black text-blue-700 tracking-tighter">
                        {ticket.nomor_lengkap}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center mb-8">
                <p className="text-xs text-gray-400 mb-3 uppercase font-semibold">Scan untuk pantau antrian</p>
                <div className="p-3 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                    <QRCodeCanvas 
                        value={window.location.origin + `/status/${ticket.id}`} 
                        size={120} 
                        level={"H"} 
                    />
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-xl p-4 mb-6">
                Silakan duduk dan tunggu panggilan Anda. Layar ini akan tertutup secara otomatis.
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200"
            >
                Tutup & Kembali
            </button>
        </div>
    );
}
