<?php

namespace App\Exports;

use App\Models\Antrian;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AntrianExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles
{
    protected $tenantId;
    protected $tanggal;

    public function __construct($tenantId, $tanggal = null)
    {
        $this->tenantId = $tenantId;
        $this->tanggal  = $tanggal ?? Carbon::today()->toDateString();
    }

    public function collection()
    {
        return Antrian::with(['layanan', 'loket'])
            ->where('tenant_id', $this->tenantId)
            ->whereDate('created_at', $this->tanggal)
            ->orderBy('created_at')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No.',
            'Nomor Antrian',
            'Layanan',
            'Loket',
            'Status',
            'Waktu Ambil Tiket',
            'Waktu Dipanggil',
            'Waktu Tunggu (menit)',
        ];
    }

    public function map($row): array
    {
        static $i = 0;
        $i++;

        $waitTime = '-';
        if ($row->waktu_panggil) {
            $waitTime = Carbon::parse($row->created_at)->diffInMinutes(Carbon::parse($row->waktu_panggil));
        }

        $statusMap = [
            'waiting' => 'Menunggu',
            'calling' => 'Dipanggil',
            'serving' => 'Dilayani',
            'done'    => 'Selesai',
            'skipped' => 'Dilewati',
        ];

        return [
            $i,
            $row->nomor_lengkap ?? ($row->layanan->kode_huruf ?? '?') . '-' . str_pad($row->nomor_antrian ?? $row->id, 3, '0', STR_PAD_LEFT),
            $row->layanan->nama_layanan ?? '-',
            $row->loket ? 'Loket ' . $row->loket->nomor_loket : '-',
            $statusMap[$row->status] ?? $row->status,
            $row->created_at ? Carbon::parse($row->created_at)->format('H:i:s') : '-',
            $row->waktu_panggil ? Carbon::parse($row->waktu_panggil)->format('H:i:s') : '-',
            $waitTime,
        ];
    }

    public function title(): string
    {
        return 'Laporan Antrian ' . $this->tanggal;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '0D9488']],
            ],
        ];
    }
}
