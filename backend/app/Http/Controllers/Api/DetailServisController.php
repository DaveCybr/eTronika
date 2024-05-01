<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DetailServisController extends Controller
{
    public function getDetailServis(Request $request, $id, $id_member)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');

        $query = DB::table('tbl_unit_transaksi')
            ->leftjoin('tbl_detail_servis', 'tbl_unit_transaksi.id_detail_servis', '=', 'tbl_detail_servis.id_detail_servis')
            ->leftjoin('tbl_servis', 'tbl_detail_servis.id_servis', '=', 'tbl_servis.id_servis')
            ->where('tbl_servis.id_servis', $id)
            ->leftjoin('tbl_karyawan', 'tbl_detail_servis.id_karyawan', '=', 'tbl_karyawan.id_karyawan');

        $query->where(function ($q) use ($search) {
            $q->where('deskripsi_servis', 'like', "%$search%");
        });

        $query->orderBy('id_detail_servis', 'desc');

        $detail_servis = $query->leftJoin('tbl_unit_terdaftar', 'tbl_detail_servis.id_unit_terdaftar', '=', 'tbl_unit_terdaftar.id_unit_terdaftar')
            ->select('tbl_detail_servis.*', 'tbl_unit_terdaftar.nama_unit','tbl_unit_terdaftar.unique_seri', 'tbl_karyawan.nama_karyawan')
            ->paginate($limit);

        $jumlahSparepart = [];
        $totalHarga = [];

        foreach ($detail_servis as $ds) {
            $count = DB::table('tbl_unit_transaksi')->where('id_detail_servis', $ds->id_detail_servis)->count();
            $jumlahSparepart[$ds->id_detail_servis] = $count;
        }

        foreach ($detail_servis as $ds) {
            $total = DB::table('tbl_unit_transaksi')->where('id_detail_servis', $ds->id_detail_servis)->sum('total');
            $totalHarga[$ds->id_detail_servis] = $total;
        }

        $unit = DB::table('tbl_unit_terdaftar')
            ->where('id_member', $id_member)
            ->get();

        return response()->json([
            'jumlah_sparepart' => $jumlahSparepart,
            'total_harga' => $totalHarga,
            'detail_servis' => $detail_servis,
            'unit' => $unit
        ]);
    }

    public function addDetailServis(Request $request, $id){

        // return response()->json(
        //     request()->all()
        // );

        $detail_servis = DB::table('tbl_detail_servis')->insert([
            'id_servis' => $id,
            'id_unit_terdaftar' => $request->id_unit_terdaftar,
            'deskripsi_servis' => $request->deskripsi_servis,
            'id_karyawan' => $request->id_karyawan,
        ]);

        $id_detail_servis = DB::table('tbl_detail_servis')
            ->where('id_servis', $id)
            ->orderBy('id_detail_servis', 'desc')
            ->first();

            foreach ($request->keranjang as $item) {
                $unit_transaksi = DB::table('tbl_unit_transaksi')->insert([
                    'id_product' => $item['id_product'],
                    'id_detail_servis' => $id_detail_servis->id_detail_servis,
                    'qty' => $item['qty'],
                    'total' => $item['total']
                ]);
                $product = DB::table('tbl_product')->where('id_product', $item['id_product'])->first();
                $productStok = DB::table('tbl_product')
                    ->where('id_product', $item['id_product'])->update([
                        'stok' => $product->stok - $item['qty']
                    ]);
            }


        return response()->json([
            'message' => 'Data detail servis berhasil ditambahkan',
            'detail_servis' => $detail_servis
        ]);
    }

    public function deleteDetailServis($id)
    {
        $detail_servis = DB::table('tbl_detail_servis')
            ->where('id_detail_servis', $id)
            ->delete();

        return response()->json([
            'message' => 'Data detail servis berhasil dihapus',
            'detail_servis' => $detail_servis
        ]);
    }

    public function updateDetailServis(Request $request, $id)
    {
        $detail_servis = DB::table('tbl_detail_servis')
            ->where('id_detail_servis', $id)
            ->update([
                // 'id_unit_terdaftar' => $request->id_unit_terdaftar,
                // 'deskripsi_servis' => $request->deskripsi_servis,
                'penanganan_servis' => $request->penanganan_servis,
                // 'id_karyawan' => $request->id_karyawan,
            ]);

        return response()->json([
            'message' => 'Data detail servis berhasil diubah',
            'detail_servis' => $detail_servis
        ]);
    }

    public function addDetailTransaksiServis(Request $request){

        $total_pembelian_sparepart = 0;
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

        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $request->id_transaksi)->first();

        $updateTransaksi = DB::table('tbl_transaksi')->where('id_transaksi', $request->id_transaksi)->update([
            'total_pembelian' => $transaksi->total_pembelian + $total_pembelian_sparepart,
        ]);

        return response()->json([
            'message' => 'Data detail transaksi berhasil ditambahkan',
        ]);

    }

    public function updateDetailTransaksiServis(Request $request, $id){
        $detail_transaksi = DB::table('tbl_unit_transaksi')
            ->where('id_unit_transaksi', $id)
            ->update([
                'nama_product' => $request->nama_product,
                'harga' => $request->harga,
                'qty' => $request->qty,
                'total' => $request->total,
            ]);

            $tbl_detail_servis = DB::table('tbl_detail_servis')
            ->leftJoin('tbl_servis', 'tbl_detail_servis.id_servis', '=', 'tbl_servis.id_servis')
            ->where('tbl_servis.id_transaksi', $request->id_transaksi)->get();

            $total_unit = 0;
            foreach ($tbl_detail_servis as $dts) {
                $tbl_unit_transaksi = DB::table('tbl_unit_transaksi')->where('id_detail_servis', $dts->id_detail_servis)->get();
                foreach ($tbl_unit_transaksi as $dts) {
                    $total_unit += $dts->total;
                }
            }

            $detail_transaksi = DB::table('tbl_detail_transaksi')->where('id_transaksi', $request->id_transaksi)->get();
            $total_pembelian = 0;

            if($detail_transaksi> 0){
                foreach ($detail_transaksi as $dt) {
                    $total_pembelian += $dt->total;
                }
            }

            $total = $total_pembelian + $total_unit;
            $updateTransaksi = DB::table('tbl_transaksi')->where('id_transaksi', $request->id_transaksi)->update([
                'total_pembelian' => $total,
            ]);

        return response()->json([
            'message' => 'Data berhasil diubah.',
            'detail_transaksi' => $detail_transaksi
        ]);
    }

    public function deleteDetailTransaksiServis($id, Request $request)
    {
        $product = DB::table('tbl_product')->where('id_product', $request->detail['id_product'])->first();
        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $request->id_transaksi)->first();
        $total =  $product->stok + $request->detail['qty'];
        $total_pembelian = $transaksi->total_pembelian - $request->detail['total'];
        DB::table('tbl_product')
        ->where('id_product', $request->detail['id_product'])->update([
            'stok' => $product->stok + $request->detail['qty']
        ]);
        $trxUpdate = DB::table('tbl_transaksi')->where('id_transaksi', $request->id_transaksi)->update([
            'total_pembelian' => $total_pembelian
        ]);
        DB::table('tbl_unit_transaksi')->where('id_unit_transaksi', $request->detail['id_unit_transaksi'])->delete();

        return response()->json([
            'message' => 'Data berhasil dihapus.',
            'total' => $total,
            'total_pembelian' => $total_pembelian,
            'trxUpdate' => $trxUpdate
        ]);
    }
}
