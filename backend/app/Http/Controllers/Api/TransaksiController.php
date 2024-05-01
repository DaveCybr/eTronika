<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 10);
        $search = $request->input('search', '');
        $status = $request->input('status_transaksi', '');
        $bulan = $request->input('bulan', '');
        $tahun = $request->input('tahun', '');
        $tanggal_1 = $request->input('tanggal_1', '');
        $tanggal_2 = $request->input('tanggal_2', '');

        $query = Transaksi::query();

        if (!empty($status)) {
            $query->where('status_transaksi', $status);
        }

        if (!empty($bulan)) {
            $query->whereMonth('tanggal_transaksi', $bulan);
        }

        if (!empty($tahun)) {
            $query->whereYear('tanggal_transaksi', $tahun);
        }

        if (!empty($tanggal_1) && !empty($tanggal_2)) {
            $query->whereBetween('tanggal_transaksi', [$tanggal_1, $tanggal_2]);
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('id_transaksi', 'like', '%' . $search . '%')
                    ->orWhere('nama_pelanggan', 'like', '%' . $search . '%')
                    ->orWhere('nomor_telepon', 'like', '%' . $search . '%')
                    ->orWhere('alamat', 'like', '%' . $search . '%')
                    ->orWhere('total_pembelian', 'like', '%' . $search . '%')
                    ->orWhere('total_pembayaran', 'like', '%' . $search . '%')
                    ->orWhere('tanggal_transaksi', 'like', '%' . $search . '%')
                    ->orWhere('catatan', 'like', '%' . $search . '%')
                    ->orWhere('status_transaksi', 'like', '%' . $search . '%');
            });
        }

        $transaksi_selesai = clone $query;
        $transaksi_dibayar = clone $query;
        $transaksi_belum_dibayar = clone $query;
        $piutang_query = clone $query;

        $transaksi_selesai = $transaksi_selesai->where('status_transaksi', 'Selesai')->count();
        $transaksi_dibayar = $transaksi_dibayar->where('total_pembayaran', '!=' ,'0')->count();
        $transaksi_belum_dibayar = $transaksi_belum_dibayar->where('total_pembayaran', '0')->count();
        $piutang = $piutang_query->where('status_transaksi', 'Diinput')->sum('total_pembelian');
        $transaksi = $query->count();

        $data = $query->orderBy('tanggal_transaksi', 'desc')->paginate($perPage);

        return response()->json([
            'transaksi' => $transaksi,
            'transaksi_selesai' => $transaksi_selesai,
            'transaksi_dibayar' => $transaksi_dibayar,
            'transaksi_belum_dibayar' => $transaksi_belum_dibayar,
            'piutang' => $piutang,
            'omset' => $query->sum('total_pembelian'),
            'data' => $data,
        ]);
    }


    public function store(Request $request)
    {
        $rules = [
             'id_transaksi' => 'required',
             'nama_pelanggan' => 'required',
             'nomor_telepon' => 'required',
             'alamat' => 'required',
         ];

         $this->validate($request, $rules, [
             'required' => ':attribute tidak boleh kosong.',
         ]);

        $detail_transaksi = $request->keranjang;
        $total_pembelian_barang = 0;
        $total_pembelian_sparepart = 0;

        if($request->keranjang != null || $request->keranjang != '' || $request->keranjang != []){
            foreach ($detail_transaksi as $dt) {
                DB::table('tbl_detail_transaksi')->insert([
                    'id_transaksi' => $request->id_transaksi,
                    'id_product' => $dt['id_product'],
                    'nama_product' => $dt['nama_product'],
                    'hpp' => $dt['hpp'],
                    'harga' => $dt['harga'],
                    'qty' => $dt['qty'],
                    'subtotal' => $dt['total'],
                ]);
                $total_pembelian_barang += $dt['total'];
                $product = DB::table('tbl_product')->where('id_product', $dt['id_product'])->first();
                if($product->stok < $dt['qty']){
                    return response()->json([
                        'message' => 'Stok barang tidak mencukupi',
                    ], 400);
                }
                DB::table('tbl_product')
                ->where('id_product', $dt['id_product'])->update([
                    'stok' => $product->stok - $dt['qty']
                ]);
            }
        }


        if($request->keranjang_unit != null || $request->keranjang_unit != []){
            foreach($request->keranjang_js as $jasa){
                if($jasa['kategori'] == 'Sparepart'){
                    $product = DB::table('tbl_product')->where('id_product', $jasa['id_product'])->first();
                    if($product->stok < $jasa['qty']){
                        return response()->json([
                            'message' => 'Stok  sparepart tidak  mencukupi',
                        ], 400);
                    }
                    DB::table('tbl_product')
                        ->where('id_product', $jasa['id_product'])->update([
                            'stok' => $product->stok - $jasa['qty']
                        ]);
                    DB::table('tbl_unit_transaksi')->insert([
                        'id_servis' => $request->id_servis,
                        'id_transaksi' => $request->id_transaksi,
                        'id_detail_servis' => $jasa['id_detail_servis'],
                        'id_product' => $jasa['id_product'],
                        'nama_product' => $jasa['nama_product'],
                        'nama_kategori' => $jasa['kategori'],
                        'harga' => $jasa['harga'],
                        'qty' => $jasa['qty'],
                        'total' => $jasa['total'],
                    ]);
                    $total_pembelian_sparepart += $jasa['total'];
                } else {
                    DB::table('tbl_unit_transaksi')->insert([
                        'id_detail_servis' => $jasa['id_detail_servis'],
                        'id_product' => $jasa['id_product'],
                        'nama_product' => $jasa['nama_product'],
                        'nama_kategori' => $jasa['kategori'],
                        'harga' => $jasa['harga'],
                        'qty' => $jasa['qty'],
                        'total' => $jasa['total'],
                    ]);
                    $total_pembelian_sparepart += $jasa['total'];
                }
            }
            foreach($request->keranjang_unit as $jasa){
                DB::table('tbl_detail_servis')->insert([
                    'id_servis' =>  $request->id_servis,
                    'id_detail_servis' => $jasa['id_detail_servis'],
                    'id_karyawan' => $jasa['id_karyawan'],
                    'nama_karyawan' => $jasa['nama_karyawan'],
                    'nama_unit' => $jasa['nama_unit'],
                    'deskripsi_servis' => $jasa['deskripsi_servis'],
                ]);
            }
            DB::table('tbl_servis')->insert([
               'id_transaksi' => $request->id_transaksi,
               'id_servis' => $request->id_servis,
               'nama_member' => $request->nama_pelanggan,
               'alamat' => $request->alamat,
               'nomor_telepon' => $request->nomor_telepon,
            ]);
        }


        $total = $total_pembelian_barang + $total_pembelian_sparepart;

        $transaksi = Transaksi::create([
            'id_transaksi' => $request->id_transaksi,
            'id_member' => $request->id_member,
            'nama_pelanggan' => $request->nama_pelanggan,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
            'total_pembelian' => $total,
            'total_pembayaran' => $request->total_pembayaran,
            'tanggal_transaksi' => $request->tanggal_transaksi,
            'catatan' => $request->catatan,
            'lokasi' => $request->lokasi,
            'ref' => $request->ref,
            'status_transaksi' => 'Diinput',
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        return response()->json([
            'message' => 'Success',
            'data' => $total
        ]);
    }

    public function update(Request $request, $id)
    {
        $rules = [
            'nama_pelanggan' => 'required',
            'alamat' => 'required',
            'nomor_telepon' => 'required',
        ];

        $this->validate($request, $rules, [
            'required' => 'Input tidak boleh kosong.',
        ]);

        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $id)->update([
            'nama_pelanggan' => $request->nama_pelanggan,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
            'ref' => $request->ref,
            'catatan' => $request->catatan,
            'lokasi' => $request->lokasi,
        ]);

        return response()->json([
            'message' => 'Success',
            'data' => $transaksi
        ]);

    }

    public function destroy($id)
    {
        $pembayran = DB::table('tbl_pembayaran')->where('id_transaksi', $id)->first();

        if($pembayran == true){
            $deleteDetailTrx = DB::table('tbl_pembayaran')->where('id_transaksi', $id)->delete();
            $deleteTrx = Transaksi::where('id_transaksi', $id)->delete();
            return response()->json([
                'message' => 'Success',
            ]);
        }

        $deleteTrx = Transaksi::where('id_transaksi', $id)->delete();
        return response()->json([
            'message' => 'Success',
        ]);
    }

    public function bayar(Request $request,$id)
    {
        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $id)->first();
        if ($transaksi) {
            $pembayaran = $transaksi->total_pembayaran + $request->nominal;
            DB::table('tbl_transaksi')->where('id_transaksi', $id)->update([
                'status_transaksi' => ($request->nominal >= $transaksi->total_pembelian) ? 'Selesai' : 'Diinput',
                'total_pembayaran' => $pembayaran,
            ]);
            DB::table('tbl_pembayaran')->insert([
                'id_transaksi' => $id,
                'nama'=> $transaksi->nama_pelanggan,
                'nominal' => $request->nominal,
                'tanggal_bayar' => $request->tanggal_bayar,
                'keterangan' => $request->keterangan,
                'catatan' => $request->catatan,
            ]);
            return response()->json([
                'message' => 'Success',
                'data' => $transaksi
            ]);
        } else {
            return response()->json([
                'message' => 'Data tidak ditemukan',
            ], 404);
        }
    }

    public function memberCreate(Request $request, $id)
    {
        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $id)->first();
        if ($transaksi->id_member == null) {
            $servis = DB::table('tbl_servis')->where('id_transaksi', $request->id_transaksi)->first();
            if($servis != null){
                DB::table('tbl_servis')->where('id_transaksi', $id)->update([
                    'id_member' => $request->id_member,
                ]);
                $unit = DB::table('tbl_detail_servis')->where('id_servis', $servis->id_servis)->get();
                foreach($unit as $u){
                    $id_unit_terdaftar = $u->id_detail_servis . 'UD' . Str::random(3);
                    DB::table('tbl_unit_terdaftar')->insert([
                        'unique_seri' => Str::random(9),
                        'id_member' => $request->id_member,
                        'id_unit_terdaftar' => $id_unit_terdaftar,
                        'nama_unit' => $u->nama_unit,
                    ]);
                    DB::table('tbl_detail_servis')->where('id_detail_servis', $u->id_detail_servis)->update([
                        'id_unit_terdaftar' => $id_unit_terdaftar,
                    ]);
                }
            }
            DB::table('tbl_member')->insert([
                'id_member' => $request->id_member,
                'nama_member' => $request->nama_member,
                'alamat' => $request->alamat,
                'nomor_telepon' => $request->nomor_telepon,
            ]);
            DB::table('tbl_transaksi')->where('id_transaksi', $id)->update([
                'id_member' => $request->id_member,
            ]);
            return response()->json([
                'message' => 'Success',
                'data' => $transaksi
            ]);
        } else {
            return response()->json([
                'message' => 'Member sudah terdaftar',
            ], 404);
        }
    }

    public function transaksiPrint($id)
    {
        $detail_transaksi = DB::table('tbl_detail_transaksi')->where('id_transaksi', $id)
        ->select('id_detail_transaksi', 'id_product', 'nama_product', 'hpp', 'harga', 'qty', 'subtotal as total')
        ->get();
        $unit_transaksi = DB::table('tbl_unit_transaksi')->where('id_transaksi', $id)->get();

        return response()->json([
            'detail_transaksi' => $detail_transaksi,
            'unit_transaksi' => $unit_transaksi,
        ]);
    }
}
