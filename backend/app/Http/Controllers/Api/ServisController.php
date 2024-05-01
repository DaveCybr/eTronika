<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Servis;
use Illuminate\Support\Facades\DB;
use App\Models\Teknisi;

class ServisController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');
        $id_member = $request->input('id_member', '');

        $query = DB::table('tbl_servis');

        if ($id_member != '') {
            $query->where('id_member', $id_member);
        }

        $query->where(function ($q) use ($search) {
            $q->where('deskripsi_servis', 'like', "%$search%")
                ->orWhere('tanggal_waktu', 'like', "%$search%")
                ->orWhere('nama_member', 'like', "%$search%")
                ->orWhere('status_servis', 'like', "%$search%");
        });

        $servis = $query->select('tbl_servis.*')
            ->orderBy('tbl_servis.id_servis', 'desc')
            ->paginate($limit);

        $member = DB::table('tbl_member')->get();
        $tim_teknisi = DB::table('tbl_tim_teknisi')->get();
        $karyawan = DB::table('tbl_karyawan')
            ->where('status_karyawan', 'Ready')
            ->get();

            $jumlah_unit_servis = [];
            foreach ($servis as $s) {
                $count = DB::table('tbl_detail_servis')->where('id_servis', $s->id_servis)->count();
                $jumlah_unit_servis[$s->id_servis]= $count;
            }

            $jumlah_jasa = [];

            foreach ($servis as $s) {
                $count = DB::table('tbl_jasa_transaksi')->where('id_servis', $s->id_servis)->count();
                $jumlah_jasa[$s->id_servis]= $count;
            }

            $totalHargaJasa = [];

            foreach ($servis as $s) {
                $total = DB::table('tbl_jasa_transaksi')->where('id_servis', $s->id_servis)->sum('total');
                $totalUnitTransaksi = DB::table('tbl_unit_transaksi')->join('tbl_detail_servis', 'tbl_unit_transaksi.id_detail_servis', '=', 'tbl_detail_servis.id_detail_servis')
                ->where('tbl_detail_servis.id_servis', $s->id_servis)->sum('total');
                $total = $total + $totalUnitTransaksi;
                $totalHargaJasa[$s->id_servis] = $total;
            }


        $jasa = DB::table('tbl_product')
        ->leftjoin('tbl_kategori', 'tbl_product.id_kategori', '=', 'tbl_kategori.id_kategori')
        ->where('tbl_product.id_kategori', '2')->orWhere('tbl_product.id_kategori', '3')
        ->select('tbl_product.*', 'tbl_kategori.nama_kategori')
        ->get();

            return response()->json([
                'total_harga' => $totalHargaJasa,
                'jumlah_unit_servis' => $jumlah_unit_servis,
                'jumlah_jasa' => $jumlah_jasa,
                'servis' => $servis,
                'member' => $member,
                'tim_teknisi' => $tim_teknisi,
                'karyawan' => $karyawan,
                'jasa' => $jasa
            ]);

    }

    public function show($id){
        $query = DB::table('tbl_servis')->where('id_servis', $id);
        $servis = $query->leftjoin('tbl_member', 'tbl_servis.id_member', '=', 'tbl_member.id_member')
        ->select('tbl_servis.*', 'tbl_member.nama_member', 'tbl_member.nomor_telepon', 'tbl_member.alamat')
        ->orderBy('tbl_servis.id_servis', 'desc')
        ->get();

        return response()->json([
            'data'=> $servis
        ]);
    }

    public function getJasaTransaksi($id){
        $query = DB::table('tbl_jasa_transaksi')->where('id_servis', $id);
        $jasa_transaksi = $query->leftjoin('tbl_jasa', 'tbl_jasa_transaksi.id_jasa', '=', 'tbl_jasa.id_jasa')
        ->select('tbl_jasa_transaksi.*', 'tbl_jasa.nama_jasa', 'tbl_jasa.harga')
        ->orderBy('tbl_jasa_transaksi.id_jasa_transaksi', 'desc')
        ->get();

        return response()->json([
            'data'=> $jasa_transaksi
        ]);
    }

    public function store(Request $request)
    {

        // return response()->json(
        //     request()->servis
        // );

        $servis = Servis::create([
            'id_servis' => $request->id_servis,
            // // 'id_member' => $request->servis->id_member,
            // // 'deskripsi_servis' => $request->servis->deskripsi_servis,
            'nama_member' => $request->servis['nama_member'],
            'nomor_telepon' => $request->servis['nomor_telepon'],
            'alamat' => $request->servis['alamat'],
            'tanggal_waktu' => $request->servis['tanggal_waktu'],
            'status_servis' => 'pending',
        ]);

        foreach ($request->keranjang as $item) {
           $detailServis = DB::table('tbL_detail_servis')->insert([
               'id_servis' => $request->id_servis,
               'id_detail_servis' => $item['id_detail_servis'],
               'id_karyawan' => $item['id_karyawan'],
               'nama_unit' => $item['nama_unit'],
               'nama_karyawan' => $item['nama_karyawan'],
            ]);
        }

        foreach ($request->keranjangJS as $item) {
            $unit_transaksi = DB::table('tbl_unit_transaksi')->insert([
                'id_detail_servis' => $item['id_detail_servis'],
                'id_product' => $item['id_product'],
                'nama_product' => $item['nama'],
                'qty' => $item['qty'],
                'harga' => $item['harga'],
                'nama_kategori' => $item['nama_kategori'],
                'total' => $item['total'],
            ]);
        }


        return response()->json([
            'message' => 'Data servis berhasil disimpan',
            'servis' => $servis
        ]);
    }

    public function update(Request $request, $id)
    {

        $servis = Servis::where('id_servis',$id);
        $servis->update([
            'id_member' => $request->id_member,
            'deskripsi_servis' => $request->deskripsi_servis,
            'tanggal_waktu' => $request->tanggal_waktu,
            'status_servis' => $request->status_servis
        ]);

        return response()->json([
            'message' => 'Data servis berhasil diupdate',
            'servis' => $servis
        ]);
    }

    public function addTeknisi(Request $request, $id)
    {
        $this->validate($request, [
            'id_karyawan' => 'required'
        ]);

        $teknisi = Teknisi::create([
            'id_servis' => $request->id_servis,
            'id_servis' => $id,
            'id_karyawan' => $request->id_karyawan
        ]);

        $karayawan = DB::table('tbl_karyawan')
            ->where('id_karyawan', $request->id_karyawan)
            ->update([
                'status_karyawan' => 'Kerja'
            ]);

        return response()->json([
            'message' => 'Data teknisi berhasil ditambahkan',
            'teknisi' => $teknisi
        ]);
    }



    public function updateTeknisi(Request $request, $id)
    {
        $this->validate($request, [
            'id_karyawan' => 'required'
        ]);

        $teknisi = Teknisi::where('id_servis', $id)->where('id_teknisi', $request->id_teknisi)
            ->update([
                'id_karyawan' => $request->id_karyawan
            ]);

        $karayawan = DB::table('tbl_karyawan')
            ->where('id_karyawan', $request->id_karyawan)
            ->update([
                'status_karyawan' => 'Kerja'
            ]);

        return response()->json([
            'message' => 'Data teknisi berhasil diupdate',
            'teknisi' => $teknisi
        ]);
    }

    public function deleteTeknisi($id, $idTeknisi)
    {
        $teknisi = Teknisi::where('id_servis', $id)->where('id_teknisi', $idTeknisi)->delete();

        return response()->json([
            'message' => 'Data teknisi berhasil dihapus',
            'teknisi' => $teknisi
        ]);
    }

    public function getServisTeknisi($id)
    {
        $servisDone = DB::table('tbl_tim_teknisi')
        ->leftjoin('tbl_servis', 'tbl_tim_teknisi.id_servis', '=', 'tbl_servis.id_servis')
        ->where('tbl_tim_teknisi.id_karyawan', $id)
        ->where('tbl_servis.status_servis', 'done')
        ->get();

        $servisPending =  DB::table('tbl_tim_teknisi')
        ->leftjoin('tbl_servis', 'tbl_tim_teknisi.id_servis', '=', 'tbl_servis.id_servis')
        ->where('tbl_tim_teknisi.id_karyawan', $id)
        ->where('tbl_servis.status_servis', 'pending')
        ->get();

        $teknisi = DB::table('tbl_tim_teknisi')
        ->where('id_servis', $id)
        ->leftJoin('tbl_karyawan', 'tbl_tim_teknisi.id_karyawan', '=', 'tbl_karyawan.id_karyawan')
        ->select('tbl_tim_teknisi.*', 'tbl_karyawan.nama_karyawan')
        ->get();

        return response()->json(
            [
                'servisDone' => $servisDone,
                'servisPending' => $servisPending,
                'teknisi' => $teknisi
            ]
        );
    }

    public function getDetailDeskripsi($id)
    {
        $detail_deskripsi = DB::table('tbl_detail_deskripsi')
            ->where('id_detail_servis', $id)
            ->get();

        return response()->json(
             $detail_deskripsi
        );
    }

    public function addDetailDeskripsi(Request $request, $id){

        $file = $request->file('foto');
        $nama_file = url('/').'/gambar/'.random_int(0,100000000).'.'.$file->extension();
        $tujuan_upload = public_path('gambar');
        $file->move($tujuan_upload, $nama_file);

        DB::table('tbl_detail_deskripsi')->insert([
            'id_detail_servis' => $id,
            'deskripsi_foto' => $request->deskripsi_foto,
            'foto' => $nama_file
        ]);
        return response()->json([
            'message' => 'Data detail deskripsi berhasil ditambahkan',
            'detail_deskripsi' => $nama_file
        ]);
    }

    public function deleteDetailDeskripsi($id)
    {
        $detail_deskripsi = DB::table('tbl_detail_deskripsi')
            ->where('id_detail_deskripsi', $id)
            ->delete();

        return response()->json([
            'message' => 'Data detail deskripsi berhasil dihapus',
            'detail_deskripsi' => $detail_deskripsi
        ]);
    }

    public function updateDetailDeskripsi(Request $request, $id)
    {
        if($request->file('foto') != null){
            $file = $request->file('foto');
            $nama_file = url('/').'/gambar/'.random_int(0,100000000).'.'.$file->extension();
            $tujuan_upload = public_path('gambar');
            $file->move($tujuan_upload, $nama_file);
        } else {
            $nama_file = $request->foto;
        }

        $detail_deskripsi = DB::table('tbl_detail_deskripsi')
            ->where('id_detail_deskripsi', $id)
            ->update([
                'deskripsi_foto' => $request->deskripsi_foto,
                'foto' => $nama_file
            ]);

        return response()->json([
            'message' => 'Data detail deskripsi berhasil diubah',
            'detail_deskripsi' => $detail_deskripsi
        ]);
    }

}