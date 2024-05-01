<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $supplier = DB::table('tbl_supplier')
                ->where('nama_supplier', 'like', "%$search%")
                ->orWhere('alamat', 'like', "%$search%")
                ->orWhere('nomor_telepon', 'like', "%$search%")
                ->orderBy('updated_at', 'desc')
                ->paginate($limit);
        } else {
            $supplier = DB::table('tbl_supplier')
                ->orderBy('updated_at', 'desc')
                ->paginate($limit);
        }

        return response()->json(
            $supplier
        );
    }

    public function store(Request $request)
    {
        $supplier = DB::table('tbl_supplier')->insert([
            'nama_supplier' => $request->nama_supplier,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(
            $supplier
        );
    }

    public function update(Request $request, $id)
    {
        $supplier = DB::table('tbl_supplier')
            ->where('id_supplier', $id)
            ->update([
                'nama_supplier' => $request->nama_supplier,
                'alamat' => $request->alamat,
                'nomor_telepon' => $request->nomor_telepon,
                'updated_at' => now()
            ]);

        return response()->json(
            $supplier
        );
    }

    public function destroy($id)
    {
        $supplier = DB::table('tbl_supplier')
            ->where('id_supplier', $id)
            ->delete();

        return response()->json(
            $supplier
        );
    }
}
