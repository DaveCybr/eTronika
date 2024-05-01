<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UnitTerdaftar;
use Illuminate\Support\Facades\DB;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;

class UnitTerdaftarController extends Controller
{
    public function index(Request $request)
    {

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
            ->select('tbl_unit_terdaftar.*', 'tbl_member.nama_member', 'tbl_garansi.jenis_garansi')
            ->paginate($perPage);
        $member = DB::table('tbl_member')->get();
        $garansi = DB::table('tbl_garansi')->get();

        return response()->json([
            'unit_terdaftar' => $unit_terdaftar,
            'member' => $member,
            'garansi' => $garansi,
        ]);
    }

    public function store(Request $request)
    {

        $unit_terdaftar = new UnitTerdaftar;
        $unit_terdaftar->id_member = $request->id_member;
        $unit_terdaftar->unique_seri = Str::random(9);
        $unit_terdaftar->nama_unit = $request->nama_unit;
        $unit_terdaftar->id_garansi = $request->id_garansi;
        $unit_terdaftar->tanggal_berakhir_garansi = $request->tanggal_berakhir_garansi;
        $unit_terdaftar->save();

        return response()->json($unit_terdaftar);
    }

    public function show($id)
    {
        $unit_terdaftar = UnitTerdaftar::find($id);
        return response()->json($unit_terdaftar);
    }

    public function update(Request $request, $id)
    {
        $unit_terdaftar = UnitTerdaftar::where('id_unit_terdaftar',$id)->first();
        $unit_terdaftar->id_member = $request->id_member;
        $unit_terdaftar->nama_unit = $request->nama_unit;
        $unit_terdaftar->id_garansi = $request->id_garansi;
        $unit_terdaftar->tanggal_berakhir_garansi = $request->tanggal_berakhir_garansi;
        $unit_terdaftar->save();

        return response()->json($unit_terdaftar);
    }

    public function destroy($id)
    {
        $unit_terdaftar = UnitTerdaftar::where('id_unit_terdaftar',$id);
        $unit_terdaftar->delete();

        return response()->json('unit_terdaftar berhasil dihapus');
    }

    public function generateQrCode($id)
    {
        $unit_terdaftar = UnitTerdaftar::where('id_unit_terdaftar',$id)->first();
        $qrCode = QrCode::size(500)->generate($unit_terdaftar->unique_seri);

        return response()->json($qrCode);
    }
}
