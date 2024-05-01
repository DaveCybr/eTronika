<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $kategori = Kategori::where('nama_kategori', 'like', "%$search%")
            ->orderBy('updated_at', 'desc')
            ->paginate($perPage);

        }else{
            $kategori = Kategori::orderBy('updated_at', 'desc')
            ->paginate($perPage);
        }

        return response()->json([
            'data' => $kategori,
        ]);
    }

    public function store(Request $request)
    {
        $supplier = Kategori::create([
            'nama_kategori' => $request->nama_kategori,
        ]);
        return response()->json(
            $supplier
        );
    }

    public function update(Request $request, $id)
    {
        $kategori = Kategori::where('id_kategori', $id)
            ->update([
                'nama_kategori' => $request->nama_kategori,
            ]);

        return response()->json(
            $kategori
        );
    }

    public function destroy($id)
    {
        $kategori = Kategori::where('id_kategori', $id)->delete();

        return response()->json(
            $kategori
        );
    }
}