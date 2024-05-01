<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UnitTerdaftar;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class CustomFunctionController extends Controller
{
    public function satuan(){
        return response()->json([
            'data' => DB::table('tbl_satuan')->get()
        ]);
    }

    public function unitTerdaftar(Request $request, $id){

        $perPage = $request->input('limit', 10);
        $search = $request->input('search', '');
        $id_member = $request->input('id_member', '');

        $query = UnitTerdaftar::query();

        if ($id_member != '') {
            $query->where('id_member', $id_member);
        }

        // Apply search query
        $query->where(function ($q) use ($search) {
            $q->where('nama_unit', 'like', "%$search%")
                ->orWhere('unique_seri', 'like', "%$search%");
        });

        $query->orderBy('updated_at', 'desc');

        // Paginate the results
        $unit_terdaftar = $query->leftjoin('tbl_member', 'tbl_unit_terdaftar.id_member', '=', 'tbl_member.id_member')
            ->leftjoin('tbl_garansi', 'tbl_unit_terdaftar.id_garansi', '=', 'tbl_garansi.id_garansi')
            ->where('tbl_unit_terdaftar.id_member', $id)
            ->select('tbl_unit_terdaftar.*', 'tbl_member.nama_member', 'tbl_garansi.jenis_garansi')
            ->paginate($perPage);

        return response()->json([
            'data' => $unit_terdaftar,
        ]);

    }

    // public function readyProduct(){
    //     return response()->json([
    //         'data' => DB::table('tbl_product')
    //         ->where('kategori', 'like', '%Barang%')
    //             ->where('stok', '>', 0)
    //             ->get(),
    //     ]);
    // }

    public function unitMember($id){
        return response()->json([
            'data' => DB::table('tbl_unit_terdaftar')
                ->where('id_member', $id)
                ->get(),
        ]);
    }

    public function readyBarang(){
        return response()->json([
            'data' => DB::table('tbl_product')
            ->where('stok', '>', 0)
                ->get(),
                // 'jasa' => DB::table('tbl_product')
                // ->where('kategori', 'like', '%Jasa%')
                // ->orWhere('kategori', 'like', '%Sparepart%')
                    // ->get(),
        ]);
    }

    public function listPendaftarServisGratis(Request $request){

        $perPage = $request->input('limit', 10);
        $search = $request->input('search', '');

        $query = DB::table('tbl_servis_gratis');

        // Apply search query
        $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%$search%")
                ->orWhere('alamat', 'like', "%$search%")
                ->orWhere('jenis', 'like', "%$search%")
                ->orWhere('nomor_telepon', 'like', "%$search%")
                ->orWhere('seri', 'like', "%$search%")
                ->orWhere('merk', 'like', "%$search%");
        });

        // Paginate the results
        $pendaftar_servis_gratis = $query->paginate($perPage);

        return response()->json([
            'data' => $pendaftar_servis_gratis,
        ]);
    }

    public function storePendaftarServisGratis(Request $request)
    {
        $rules = [
            'nama' => 'required',
            'alamat' => 'required',
            'nomor_telepon' => 'required',
            'jenis' => 'required',
            'seri' => 'required',
            'merk' => 'required',
            'keluhan' => 'required',
        ];

        $this->validate($request, $rules, [
            'required' => ':attribute tidak boleh kosong.',
        ]);

        $pendaftar_servis_gratis = DB::table('tbl_servis_gratis')->insert([
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
            'jenis' => $request->jenis,
            'seri' => $request->seri,
            'merk' => $request->merk,
            'keluhan' => $request->keluhan,
            'status' => 'Memohon',
        ]);

        return response()->json([
            'message' => 'Data berhasil disimpan'
        ]);
    }

    public function updatePendaftarServisGratis(Request $request, $id)
    {

        $pendaftar_servis_gratis = DB::table('tbl_servis_gratis')->where('id', $id)->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Data berhasil diupdate',
            'data' => $pendaftar_servis_gratis
        ]);
    }

    public function servisHistory(Request $request)
    {
        $tanggal_1 = $request->tanggal_1;
        $tanggal_2 = $request->tanggal_2;
        $search = $request->search;

        $query = DB::table('tbl_detail_servis')
            ->leftjoin('tbl_servis', 'tbl_detail_servis.id_servis', '=', 'tbl_servis.id_servis')
            ->leftjoin('tbl_transaksi', 'tbl_servis.id_transaksi', '=', 'tbl_transaksi.id_transaksi')
            ->leftjoin('tbl_unit_terdaftar', 'tbl_detail_servis.id_unit_terdaftar', '=', 'tbl_unit_terdaftar.id_unit_terdaftar');

        if (!empty($tanggal_1) && !empty($tanggal_2)) {
            $query->whereBetween('tbl_transaksi.tanggal_transaksi', [$tanggal_1, $tanggal_2]);
        }

        if ($search != '') {
            $query->where(function ($q) use ($search) {
                $q->where('tbl_detail_servis.nama_unit', 'like', "%$search%")
                    ->orWhere('tbl_transaksi.nama_pelanggan', 'like', "%$search%")
                    ->orWhere('tbl_transaksi.id_transaksi', 'like', "%$search%");
            });
        }

        $query->orderBy('tbl_transaksi.tanggal_transaksi', 'desc')
            ->select('tbl_detail_servis.*', 'tbl_servis.id_transaksi', 'tbl_servis.nama_member as nama_pelanggan', 'tbl_servis.id_servis', 'tbl_transaksi.tanggal_transaksi', 'tbl_unit_terdaftar.unique_seri');

        $results = $query->get();

        return response()->json($results);
    }


    public function laporanHarian(Request $request)
    {
        $hari = $request->hari;
        $bulan = $request->bulan;
        $tahun = $request->tahun;

        $dataPembayaran = DB::table('tbl_pembayaran')->whereDate('tanggal_bayar', $tahun . '-' . $bulan . '-' . $hari)->get();
        $dataPemasukan = DB::table('tbl_pengeluaran')->whereDate('tanggal', $tahun . '-' . $bulan . '-' . $hari)->where('jenis_pengeluaran', 'Pemasukan')->get();
        $dataPengeluaran = DB::table('tbl_pengeluaran')->whereDate('tanggal', $tahun . '-' . $bulan . '-' . $hari)->get();

        $pembayaran = DB::table('tbl_pembayaran')->whereDate('tanggal_bayar', $tahun . '-' . $bulan . '-' . $hari)->sum('nominal');
        $saldo_pemasukan = DB::table('tbl_pengeluaran')->whereDate('tanggal', $tahun . '-' . $bulan . '-' . $hari)->where('jenis_pengeluaran', 'Pemasukan')->sum('nominal');
        $saldo_pengeluaran = DB::table('tbl_pengeluaran')->whereDate('tanggal', $tahun . '-' . $bulan . '-' . $hari)->where('jenis_pengeluaran', 'Pengeluaran')->sum('nominal');

        $pemasukan = $saldo_pemasukan + $pembayaran;

        return response()->json([
            'dataPembayaran' => $dataPembayaran,
            'dataPemasukan' => $dataPemasukan,
            'dataPengeluaran' => $dataPengeluaran,
            'pemasukan' => $pemasukan,
            'pengeluaran' => $saldo_pengeluaran,
            'total' => $pemasukan - $saldo_pengeluaran,
        ]);

    }

    public function laporanBulanan(Request $request)
    {
        $bulan = $request->bulan;
        $tahun = $request->tahun;

        $dataPembayaran = DB::table('tbl_pembayaran')->whereMonth('tanggal_bayar', $bulan)->whereYear('tanggal_bayar', $tahun)->get();
        $dataPemasukan = DB::table('tbl_pengeluaran')->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pemasukan')->get();
        $dataPengeluaran = DB::table('tbl_pengeluaran')->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pengeluaran')->get();

        $pembayaran = DB::table('tbl_pembayaran')->whereMonth('tanggal_bayar', $bulan)->whereYear('tanggal_bayar', $tahun)->sum('nominal');
        $saldo_pemasukan = DB::table('tbl_pengeluaran')->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pemasukan')->sum('nominal');
        $saldo_pengeluaran = DB::table('tbl_pengeluaran')->whereMonth('tanggal', $bulan)->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pengeluaran')->sum('nominal');

        $pemasukan = $saldo_pemasukan + $pembayaran;

        return response()->json([
            'dataPembayaran' => $dataPembayaran,
            'dataPemasukan' => $dataPemasukan,
            'dataPengeluaran' => $dataPengeluaran,
            'pemasukan' => $pemasukan,
            'pengeluaran' => $saldo_pengeluaran,
            'total' => $pemasukan - $saldo_pengeluaran,
        ]);
    }

    public function laporanTahunan(Request $request)
    {
        $tahun = $request->tahun;

        $dataPembayaran = DB::table('tbl_pembayaran')->whereYear('tanggal_bayar', $tahun)->get();
        $dataPemasukan = DB::table('tbl_pengeluaran')->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pemasukan')->get();
        $dataPengeluaran = DB::table('tbl_pengeluaran')->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pengeluaran')->get();

        $pembayaran = DB::table('tbl_pembayaran')->whereYear('tanggal_bayar', $tahun)->sum('nominal');
        $saldo_pemasukan = DB::table('tbl_pengeluaran')->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pemasukan')->sum('nominal');
        $saldo_pengeluaran = DB::table('tbl_pengeluaran')->whereYear('tanggal', $tahun)->where('jenis_pengeluaran', 'Pengeluaran')->sum('nominal');

        $pemasukan = $saldo_pemasukan + $pembayaran;

        return response()->json([
            'dataPembayaran' => $dataPembayaran,
            'dataPemasukan' => $dataPemasukan,
            'dataPengeluaran' => $dataPengeluaran,
            'pemasukan' => $pemasukan,
            'pengeluaran' => $saldo_pengeluaran,
            'total' => $pemasukan - $saldo_pengeluaran,
        ]);
    }

    public function dashboard()
    {
        $today = Carbon::today()->toDateString();
        $yesterday = Carbon::   yesterday()->toDateString();

        $transaksi = DB::table('tbl_transaksi')->count();
        $transaksi_hari_ini = DB::table('tbl_transaksi')->whereDate('tanggal_transaksi', $today)->count();
        $transaksi_kemarin = DB::table('tbl_transaksi')->whereDate('tanggal_transaksi', $yesterday)->count();

        if ($transaksi_kemarin > 0) {
            $percentIncrease = (($transaksi_hari_ini - $transaksi_kemarin) / $transaksi_kemarin) * 100;
        } else {
            $percentIncrease = 100;
        }

        $pricelist = DB::table('tbl_product')->count();
        $pemasukan_hari_ini = DB::table('tbl_pembayaran')->whereDate('tanggal_bayar', $today)->sum('nominal');
        $pengeluaran_hari_ini = DB::table('tbl_pengeluaran')->whereDate('tanggal', $today)->where('jenis_pengeluaran', 'Pengeluaran')->sum('nominal');

        $total_omset = DB::table('tbl_transaksi')->sum('total_pembelian');
        $aset = DB::table('tbl_aset')->get();
        $nominal_aset = 0;
        foreach ($aset as $key => $value) {
            $as[$key] = $value->nilai_aset * $value->jumlah;
            $nominal_aset += $as[$key];
        }

        $transaksi_selesai = DB::table('tbl_transaksi')->where('status_transaksi', 'Selesai')->count();
        $transaksi_dibayar = DB::table('tbl_transaksi')->where('total_pembayaran', '!=' ,'0')->count();
        $transaksi_belum_dibayar = DB::table('tbl_transaksi')->where('total_pembayaran', '0')->count();

        $piutang = DB::table('tbl_transaksi')->where('status_transaksi', 'Diinput')->sum('total_pembelian');

        $total_pricelist = DB::table('tbl_product')->sum('harga');
        $total_hpp = DB::table('tbl_product')->sum('hpp');
        $trx = DB::table('tbl_transaksi')->get();

        $hpp_price = 0;
        $total_beli = 0;
        $margin = 0;

        foreach($trx as $key => $value){
            $total_beli += $value->total_pembelian;
            $tbl_detail_transaksi = DB::table('tbl_detail_transaksi')->where('id_transaksi', $value->id_transaksi)->get();
            foreach($tbl_detail_transaksi as $key => $value){
                $hpp_price += $value->hpp * $value->qty;
            }
        }

        $margin = (($total_omset - $hpp_price) / $total_omset ) * 100;
        $laba = $total_omset - $hpp_price;

        return response()->json([
            'transaksi' => $transaksi,
            'transaksi_hari_ini' => $transaksi_hari_ini,
            'transaksi_kemarin' => $transaksi_kemarin,
            'percentIncrease' => $percentIncrease,
            'pricelist' => $pricelist,
            'pemasukan_hari_ini' => $pemasukan_hari_ini,
            'pengeluaran_hari_ini' => $pengeluaran_hari_ini,
            'total_omset' => $total_omset,
            'nominal_aset' => $nominal_aset,
            'transaksi_selesai' => $transaksi_selesai,
            'transaksi_dibayar' => $transaksi_dibayar,
            'transaksi_belum_dibayar' => $transaksi_belum_dibayar,
            'total_pricelist' => $total_pricelist,
            'total_hpp_pricelist' => $total_hpp,
            'margin' => round($margin, 2),
            'laba' => $laba,
            'hpp_transaksi' => $hpp_price,
            'piutang' => $piutang
        ]);


    }

    public function getTransaksiById($id){
        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $id)->first();

        return response()->json(
            $transaksi,
        );
    }

}
