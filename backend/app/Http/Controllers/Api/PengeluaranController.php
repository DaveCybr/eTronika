<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengeluaran;
use Illuminate\Support\Facades\DB;

class PengeluaranController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 10);
        $search = $request->input('search', '');

        $query = Pengeluaran::query();

        // Apply search query
        $query->where(function ($q) use ($search) {
            $q->where('keterangan', 'like', "%$search%")
                ->orWhere('nominal', 'like', "%$search%")
                ->orWhere('tanggal', 'like', "%$search%")
                ->orWhere('jenis_pengeluaran', 'like', "%$search%");
        });

        // Order by updated_at
        $query->latest('tanggal');

        // Paginate the results
        $pengeluaran = $query->paginate($perPage);

        return response()->json(
            $pengeluaran,
        );
    }

    public function store(Request $request)
    {
        $pengeluaran = Pengeluaran::create([
            'nominal' => $request->nominal,
            'tanggal' => $request->tanggal,
            'jenis_pengeluaran' => $request->jenis_pengeluaran,
            'keterangan' => $request->keterangan,
        ]);
        return response()->json([
            'data' => $pengeluaran,
            'message' => 'Data berhasil disimpan'
        ]);
    }

    public function update(Request $request, $id)
    {
        $pengeluaran = DB::table('tbl_pengeluaran')->where('id_pengeluaran', $id);
        $pengeluaran->update([
            'nominal' => $request->nominal,
            'tanggal' => $request->tanggal,
            'jenis_pengeluaran' => $request->jenis_pengeluaran,
            'keterangan' => $request->keterangan,
        ]);
        return response()->json([
            'data' => $pengeluaran,
            'message' => 'Data berhasil diubah'
        ]);
    }

    public function destroy($id)
    {
        $pengeluaran = Pengeluaran::where('id_pengeluaran', $id);
        $pengeluaran->delete();
        return response()->json([
            'message' => 'Data berhasil dihapus'
        ]);
    }

}
