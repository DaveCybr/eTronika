<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Garansi;

class GaransiController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $garansi = Garansi::where('jenis_garansi', 'like', "%$search%")
            ->orderBy('updated_at', 'desc')
            ->paginate($perPage);

        }else{
            $garansi = Garansi::orderBy('updated_at', 'desc')
            ->paginate($perPage);
        }

        return response()->json([
            'data' => $garansi,
        ]);
    }

    public function store(Request $request)
    {
        $garansi = Garansi::create([
            'jenis_garansi' => $request->jenis_garansi,
        ]);
        return response()->json(
            $garansi
        );
    }

    public function update(Request $request, $id)
    {
        $garansi = Garansi::where('id_garansi', $id)
            ->update([
                'jenis_garansi' => $request->jenis_garansi,
            ]);

        return response()->json(
            $garansi
        );
    }

    public function destroy($id)
    {
        $garansi = Garansi::where('id_garansi', $id)->delete();

        return response()->json(
            $garansi
        );
    }
}
