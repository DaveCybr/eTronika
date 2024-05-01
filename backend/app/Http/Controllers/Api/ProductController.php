<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
{
    $perPage = $request->input('limit', 10);
    $search = $request->input('search', '');

    $query = Product::query();

    // Apply search query
    $query->where(function ($q) use ($search) {
        $q->where('nama', 'like', "%$search%")
            ->orWhere('harga', 'like', "%$search%")
            ->orWhere('stok', 'like', "%$search%")
            ->orWhere('hpp', 'like', "%$search%")
            ->orWhere('satuan', 'like', "%$search%")
            ->orWhere('kategori', 'like', "%$search%")
            ->orWhere('deskripsi', 'like', "%$search%")
            ->orWhere('seri', 'like', "%$search%");
    });

    // Order by updated_at
    $query->latest('updated_at');

    // Paginate the results
    $products = $query->paginate($perPage);


    $kategori = DB::table('tbl_kategori')->get();
    $supplier = DB::table('tbl_supplier')->get();
    $merk = DB::table('tbl_merk')->get();

    return response()->json([
        'data' => $products,
        'kategori' => $kategori,
        'supplier' => $supplier,
        'merk' => $merk,
    ]);
}


    public function store(Request $request)
    {
       if($request->file('foto') != null){
            $file = $request->file('foto');
            $nama_file = url('/').'/gambar/'.random_int(0,100000000).'.'.$file->extension();
            $tujuan_upload = public_path('gambar');
            $file->move($tujuan_upload, $nama_file);
        } else {
            $nama_file = '';
        }

        $product = new Product;
        $product->id_product = random_int(0,100000000);
        $product->nama = $request->nama;
        $product->harga = $request->harga;
        $product->hpp = $request->hpp;
        $product->stok = $request->stok;
        $product->satuan = $request->satuan;
        $product->kategori = $request->kategori;
        $product->seri = $request->seri;
        $product->foto = $nama_file;
        $product->deskripsi = $request->deskripsi;
        $product->created_at = now();
        $product->updated_at = now();
        $product->save();

        return response()->json(['success'=>'Berhasil Add Data'],201);
    }

    public function show($id)
    {
        $product = product::where('id_product', $id)->first();
        return response()->json($product);
    }

    public function edit($id)
    {
        $product = Product::where('id_product', $id)->first();
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {

        $productid = Product::where('id_product', $id)->first();

        if($request->file('foto') != null){
            $file = $request->file('foto');
            $nama_file = url('/').'/gambar/'.random_int(0,100000000).'.'.$file->extension();
            $tujuan_upload = public_path('gambar');
            $file->move($tujuan_upload, $nama_file);
        } else {
            $nama_file = $productid->foto;
        }

        $product = Product::where('id_product', $id)->update([
            'nama' => $request->nama,
            'harga' => $request->harga,
            'hpp' => $request->hpp,
            'satuan' => $request->satuan,
            'kategori' => $request->kategori,
            'stok' => $request->stok,
            'seri' => $request->seri,
            'foto' => $nama_file,
            'deskripsi' => $request->deskripsi,
            'updated_at' => now(),
        ]);

        return response()->json(['success'=>'Berhasil Update Data'],200);
    }

    public function destroy($id)
    {
        DB::table('tbl_product')->where('id_product', $id)->delete();
        return response()->json(['message' => 'product berhasil dihapus']);
    }

}
