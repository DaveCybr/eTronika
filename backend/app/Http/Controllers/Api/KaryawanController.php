<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Karyawan;

class KaryawanController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $karyawan = Karyawan::where('nama_karyawan', 'like', "%$search%")
                ->orWhere('alamat', 'like', "%$search%")
                ->orWhere('nomor_telepon', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('jenis_kelamin', 'like', "%$search%")
                ->orWhere('status_karyawan', 'like', "%$search%")
                ->orderBy('updated_at', 'desc')
                ->paginate($limit);
        } else {
            $karyawan = Karyawan::orderBy('updated_at', 'desc')
                ->paginate($limit);
        }

        return response()->json(
            $karyawan
        );
    }

    public function store(Request $request)
    {
        $karyawan = Karyawan::insert([
            'nama_karyawan' => $request->nama_karyawan,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
            'email' => $request->email,
            'jenis_kelamin' => $request->jenis_kelamin,
            'status_karyawan' => $request->status_karyawan,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(
            $karyawan
        );
    }

    public function update(Request $request, $id)
    {
        $karyawan = Karyawan::where('id_karyawan', $id)
            ->update([
                'nama_karyawan' => $request->nama_karyawan,
                'alamat' => $request->alamat,
                'nomor_telepon' => $request->nomor_telepon,
                'email' => $request->email,
                'jenis_kelamin' => $request->jenis_kelamin,
                'status_karyawan' => $request->status_karyawan,
                'updated_at' => now()
            ]);

        return response()->json(
            $karyawan
        );
    }

    public function destroy($id)
    {
        $karyawan = Karyawan::where('id_karyawan', $id)
            ->delete();

        return response()->json(
            $karyawan
        );
    }
}
