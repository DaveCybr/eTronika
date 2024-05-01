<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search','');
        $limit = $request->input('limit', 10);

        $query = DB::table('tbl_pembayaran')->leftjoin('tbl_transaksi','tbl_pembayaran.id_transaksi','=','tbl_transaksi.id_transaksi');

        if($search){
            $query->where('id_pembayaran','like','%'.$search.'%')
            ->orWhere('tbl_pembayaran.id_transaksi','like','%'.$search.'%')
                ->orWhere('tanggal_bayar','like','%'.$search.'%')
                ->orWhere('nominal','like','%'.$search.'%')
                ->orWhere('keterangan','like','%'.$search.'%');
        }

        $query->select('tbl_pembayaran.*','tbl_transaksi.id_member','tbl_transaksi.nama_pelanggan');
        $query->orderBy('id_pembayaran','desc');

        $data = $query->paginate($limit);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function destroy($id)
    {

        $data = DB::table('tbl_pembayaran')->where('id_pembayaran',$id)->first();

        $transaksi = DB::table('tbl_transaksi')->where('id_transaksi',$data->id_transaksi)->first();

        $updateTrx = DB::table('tbl_transaksi')->where('id_transaksi',$data->id_transaksi)->update([
            'total_pembayaran' => $transaksi->total_pembayaran - $data->nominal,
            'status_transaksi' => 'Diinput'
        ]);

        DB::table('tbl_pembayaran')->where('id_pembayaran',$id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil dihapus'
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();

        $update = DB::table('tbl_pembayaran')->where('id_pembayaran',$id)->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil diupdate'
        ]);
    }
}
