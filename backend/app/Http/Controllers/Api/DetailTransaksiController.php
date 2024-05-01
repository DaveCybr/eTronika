<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class DetailTransaksiController extends Controller
{
    public function show(Request $request, $id_transaksi)
    {
        $perPage = $request->input('limit', 10);
        $search = $request->input('search', '');

        $query = DB::table('tbl_detail_transaksi');

        // Apply search query
        $query->where(function ($q) use ($search) {
            $q->where('id_detail_transaksi', 'like', "%$search%")
                ->orWhere('id_transaksi', 'like', "%$search%")
                ->orWhere('nama_product', 'like', "%$search%")
                ->orWhere('qty', 'like', "%$search%")
                ->orWhere('harga', 'like', "%$search%")
                ->orWhere('hpp', 'like', "%$search%");
        });

        $detail_transaksi = $query->where('id_transaksi', $id_transaksi)
        ->orderBy('id_detail_transaksi', 'desc')
        ->paginate($perPage);

        $unit_transaksi = DB::table('tbl_unit_transaksi')
            ->leftJoin('tbl_detail_servis', 'tbl_unit_transaksi.id_detail_servis', '=', 'tbl_detail_servis.id_detail_servis')
            ->leftJoin('tbl_servis', 'tbl_detail_servis.id_servis', '=', 'tbl_servis.id_servis')
            ->leftJoin('tbl_transaksi', 'tbl_servis.id_transaksi', '=', 'tbl_transaksi.id_transaksi')
            ->where('tbl_servis.id_transaksi', $id_transaksi)
            ->select('tbl_unit_transaksi.*', 'tbl_detail_servis.nama_unit', 'tbl_detail_servis.nama_karyawan', 'tbl_transaksi.nama_pelanggan')
            ->get();

        return response()->json([
            'detail_transaksi' => $detail_transaksi,
            'unit_transaksi' => $unit_transaksi,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'id_transaksi' => 'required',
        ];

        $this->validate($request, $rules, [
            'required' => ':attribute tidak boleh kosong.',
        ]);


        $detail_transaksi = $request->keranjang;
        $total_pembelian = 0;

        $data = Transaksi::where('id_transaksi', $request->id_transaksi)->first();

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
            $total_pembelian += $dt['total'];
            $updateTransaksi = DB::table('tbl_transaksi')->where('id_transaksi', $request->id_transaksi)->update([
                'total_pembelian' => $total_pembelian + $data->total_pembelian,
            ]);
            $product = DB::table('tbl_product')->where('id_product', $dt['id_product'])->first();
            if($product->stok < $dt['qty']){
                return response()->json([
                    'message' => 'Stok tidak mencukupi',
                ], 400);
            }
            DB::table('tbl_product')
                ->where('id_product', $dt['id_product'])->update([
                    'stok' => $product->stok - $dt['qty']
                ]);
        }

        return response()->json([
            'message' => 'Data berhasil disimpan.',
        ]);
    }

    public function update(Request $request, $id)
    {

        $detail_transaksi = DB::table('tbl_detail_transaksi')
            ->where('id_detail_transaksi', $id)
            ->update([
                'nama_product' => $request->nama_product,
                'hpp' => $request->hpp,
                'harga' => $request->harga,
                'qty' => $request->qty,
                'subtotal' => $request->total,
            ]);

            $detail_transaksiId = DB::table('tbl_detail_transaksi')->where('id_transaksi', $request->id_transaksi)->get();

            $total_pembelian = 0;
            foreach ($detail_transaksiId as $dt) {
                $total_pembelian += $dt->subtotal;
            }

            $tbl_servis = DB::table('tbl_servis')->where('id_transaksi', $request->id_transaksi)->first();
            $total_unit = 0;

            if($tbl_servis > 0){
                $tbl_detail_servis = DB::table('tbl_detail_servis')->where('id_servis', $tbl_servis->id_servis)->get();
                foreach ($tbl_detail_servis as $dts) {
                    $tbl_unit_transaksi = DB::table('tbl_unit_transaksi')->where('id_detail_servis', $dts->id_detail_servis)->get();
                    foreach ($tbl_unit_transaksi as $dts) {
                        $total_unit += $dts->total;

                    }
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

    public function destroy($id, Request $request)
    {
        $product = DB::table('tbl_product')->where('id_product', $request->detail['id_product'])->first();
        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi', $request->detail['id_transaksi'])->first();
        $total =  $product->stok + $request->detail['qty'];
        $total_pembelian = $transaksi->total_pembelian - $request->detail['subtotal'];
        DB::table('tbl_product')
        ->where('id_product', $request->detail['id_product'])->update([
            'stok' => $product->stok + $request->detail['qty']
        ]);
        $trxUpdate = DB::table('tbl_transaksi')->where('id_transaksi', $request->detail['id_transaksi'])->update([
            'total_pembelian' => $total_pembelian
        ]);
        DB::table('tbl_detail_transaksi')->where('id_detail_transaksi', $request->detail['id_detail_transaksi'])->delete();

        return response()->json([
            'message' => 'Data berhasil dihapus.',
            'total' => $total,
            'total_pembelian' => $total_pembelian,
            'trxUpdate' => $trxUpdate
        ]);
    }
}
