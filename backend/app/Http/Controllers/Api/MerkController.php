<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Merk;

class MerkController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $merk = Merk::where('nama_merk', 'like', "%$search%")
            ->orderBy('updated_at', 'desc')
            ->paginate($perPage);

        }else{
            $merk = Merk::orderBy('updated_at', 'desc')
            ->paginate($perPage);
        }

        return response()->json([
            'data' => $merk,
        ]);
    }

    public function store(Request $request)
    {
        $supplier = Merk::create([
            'nama_merk' => $request->nama_merk,
        ]);
        return response()->json(
            $supplier
        );
    }

    public function update(Request $request, $id)
    {
        $merk = Merk::where('id_merk', $id)
            ->update([
                'nama_merk' => $request->nama_merk,
            ]);

        return response()->json(
            $merk
        );
    }

    public function destroy($id)
    {
        $merk = Merk::where('id_merk', $id)->delete();

        return response()->json(
            $merk
        );
    }

}