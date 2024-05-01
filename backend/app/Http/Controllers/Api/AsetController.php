<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Aset;

class AsetController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $aset = Aset::where('nama_aset', 'like', "%$search%")
                ->orWhere('nilai_aset', 'like', "%$search%")
                ->orWhere('jumlah', 'like', "%$search%")
                ->orderBy('updated_at', 'desc')
                ->paginate($limit);
        } else {
            $aset = Aset::orderBy('updated_at', 'desc')
                ->paginate($limit);
        }

        $jumlah_data = Aset::count();
        $jumlah_aset = Aset::sum('jumlah');
        $total_nominal = 0;
        $as = Aset::all();

        foreach ($as as $key => $value) {
            $as[$key] = $value->nilai_aset * $value->jumlah;
            $total_nominal += $as[$key];
        }

        return response()->json(
            [
                'data' => $aset,
                'jumlah' => $jumlah_aset,
                'total' => $total_nominal
            ]
        );
    }

    public function store(Request $request)
    {
        $aset = Aset::insert([
            'nama_aset' => $request->nama_aset,
            'nilai_aset' => $request->nilai_aset,
            'jumlah' => $request->jumlah,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(
            $aset
        );
    }

    public function update(Request $request, $id)
    {
        $aset = Aset::where('id_aset', $id)
            ->update([
                'nama_aset' => $request->nama_aset,
                'nilai_aset' => $request->nilai_aset,
                'jumlah' => $request->jumlah,
                'updated_at' => now()
            ]);

        return response()->json(
            $aset
        );
    }

    public function destroy($id)
    {
        $aset = Aset::where('id_aset', $id)
            ->delete();

        return response()->json(
            $aset
        );
    }
}