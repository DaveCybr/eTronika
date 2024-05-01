<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 5);
        $search = $request->input('search', '');

        if($search != ''){
            $member = Member::where('nama_member', 'like', "%$search%")
                ->orWhere('alamat', 'like', "%$search%")
                ->orWhere('nomor_telepon', 'like', "%$search%")
                ->orderBy('updated_at', 'desc')
                ->paginate($limit);
        } else {
            $member = Member::
                orderBy('updated_at', 'desc')
                ->paginate($limit);
        }

        return response()->json(
            $member
        );
    }

    public function store(Request $request)
    {
        $member = Member::insert([
            'nama_member' => $request->nama_member,
            'alamat' => $request->alamat,
            'nomor_telepon' => $request->nomor_telepon,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(
            $member
        );
    }

    public function update(Request $request, $id)
    {
        $member = Member::
            where('id_member', $id)
            ->update([
                'nama_member' => $request->nama_member,
                'alamat' => $request->alamat,
                'nomor_telepon' => $request->nomor_telepon,
                'updated_at' => now()
            ]);

        return response()->json(
            $member
        );
    }

    public function destroy($id)
    {
        $member = Member::
            where('id_member', $id)
            ->delete();

            $transaksi = Transaksi::where('id_member', $id)->get();

            foreach($transaksi as $t){
                $transakaksi = Transaksi::where('id_transaksi', $t->id_transaksi)->update([
                    'id_member' => null
                ]);
            }

            $UD = DB::table('tbl_unit_terdaftar')
                ->where('id_member', $id)->delete();

        return response()->json(
            $member
        );
    }
}