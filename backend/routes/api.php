<?php

use App\Http\Controllers\Api\AsetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomFunctionController;
use App\Http\Controllers\Api\KaryawanController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\MerkController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\UnitTerdaftarController;
use App\Http\Controllers\Api\ServisController;
use App\Http\Controllers\Api\GaransiController;
use App\Http\Controllers\Api\DetailServisController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\DetailTransaksiController;
use App\Http\Controllers\Api\PembayaranController;
use App\Http\Controllers\Api\PengeluaranController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login'])->middleware('guest');

Route::group(['middleware'=> ['api','cors']], function(){
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::get('/dashboard', [CustomFunctionController::class, 'dashboard']);

    Route::get('/satuan', [CustomFunctionController::class, 'satuan']);
    Route::get('/unitTerdaftar/{id}', [CustomFunctionController::class, 'unitTerdaftar']);
    Route::get('/ready-product', [CustomFunctionController::class, 'readyProduct']);
    Route::get('/ready-barang', [CustomFunctionController::class, 'readyBarang']);
    Route::get('/unitMember/{id}', [CustomFunctionController::class, 'unitMember']);
    Route::get('/transaksiById/{id}', [CustomFunctionController::class, 'getTransaksiById']);

    Route::get('/servisHistory', [CustomFunctionController::class, 'servisHistory']);

    Route::get('/laporanHarian', [CustomFunctionController::class, 'laporanHarian']);
    Route::get('/laporanBulanan', [CustomFunctionController::class, 'laporanBulanan']);
    Route::get('/laporanTahunan', [CustomFunctionController::class, 'laporanTahunan']);

    Route::post('/daftarServis',[CustomFunctionController::class, 'storePendaftarServisGratis']);
    Route::get('/daftarServis',[CustomFunctionController::class, 'listPendaftarServisGratis']);
    Route::delete('/daftarServis/{id}',[CustomFunctionController::class, 'hapusPendaftarServisGratis']);
    Route::post('/daftarServis/{id}/update',[CustomFunctionController::class, 'updatePendaftarServisGratis']);

    Route::resource('/product', ProductController::class);
    Route::post('/product/{id}/update', [ProductController::class, 'update']);

    Route::resource('/kategori', KategoriController::class);
    Route::post('/kategori/{id}/update', [KategoriController::class, 'update']);

    Route::resource('/supplier', SupplierController::class);
    Route::post('/supplier/{id}/update', [SupplierController::class, 'update']);

    Route::resource('/merk', MerkController::class);
    Route::post('/merk/{id}/update', [MerkController::class, 'update']);

    Route::resource('/garansi', GaransiController::class);
    Route::post('/garansi/{id}/update', [GaransiController::class, 'update']);

    Route::resource('/member', MemberController::class);
    Route::post('/member/{id}/update', [MemberController::class, 'update']);

    Route::resource('/unit-terdaftar', UnitTerdaftarController::class);
    Route::post('/unit-terdaftar/{id}/update', [UnitTerdaftarController::class, 'update']);

    Route::resource('/transaksi', TransaksiController::class);
    Route::post('/transaksi/{id}/update', [TransaksiController::class, 'update']);
    Route::post('/transaksi/{id}/member', [TransaksiController::class, 'memberCreate']);
    Route::post('/transaksi/bayar/{id}', [TransaksiController::class, 'bayar']);
    Route::get('/transaksiPrint/{id}', [TransaksiController::class, 'transaksiPrint']);

    Route::resource('transaksi/detail', DetailTransaksiController::class);
    Route::post('transaksi/detail-delete/{id}', [DetailTransaksiController::class, 'destroy']);
    Route::post('transaksi/detail/{id}/update', [DetailTransaksiController::class, 'update']);

    Route::resource('/karyawan', KaryawanController::class);
    Route::post('/karyawan/{id}/update', [KaryawanController::class, 'update']);

    Route::resource('/aset', AsetController::class);
    Route::post('/aset/{id}/update', [AsetController::class, 'update']);

    Route::resource('/servis', ServisController::class);
    Route::post('/servis/{id}/update', [ServisController::class, 'update']);

    Route::get('/servis/{id}/teknisi', [ServisController::class, 'getServisTeknisi']);
    Route::post('/servis/{id}/teknisi', [ServisController::class, 'addTeknisi']);
    Route::post('/servis/{id}/teknisi/update', [ServisController::class, 'updateTeknisi']);
    Route::delete('/servis/{id}/{idTeknisi}/teknisi/delete', [ServisController::class, 'deleteTeknisi']);

    Route::get('/servis/{id}/{idMember}/detail-servis', [DetailServisController::class, 'getDetailServis']);
    Route::post('/servis/{id}/detail-servis', [DetailServisController::class, 'addDetailServis']);
    Route::delete('/servis/{id}/detail-servis', [DetailServisController::class, 'deleteDetailServis']);
    Route::post('/servis/{id}/detail-servis/update', [DetailServisController::class, 'updateDetailServis']);
    Route::post('/servis/{id}/detail-servis/updateDetailTransaksiServis', [DetailServisController::class, 'updateDetailTransaksiServis']);
    Route::post('/servis/{id}/detail-servis/deleteDetailTransaksiServis', [DetailServisController::class, 'deleteDetailTransaksiServis']);
    Route::post('/servis/detail-servis/addDetailTransaksiServis', [DetailServisController::class, 'addDetailTransaksiServis']);

    Route::get('/servis/{id}/dokumentasi', [ServisController::class, 'getDetailDeskripsi']);
    Route::post('/servis/{id}/dokumentasi', [ServisController::class, 'addDetailDeskripsi']);
    Route::delete('/servis/{id}/dokumentasi', [ServisController::class, 'deleteDetailDeskripsi']);
    Route::post('/servis/{id}/dokumentasi/update', [ServisController::class, 'updateDetailDeskripsi']);

    Route::get('/getJasaTransaksi/{id}', [ServisController::class, 'getJasaTransaksi']);

    Route::resource('/pembayaran', PembayaranController::class);
    Route::post('/pembayaran/{id}/update', [PembayaranController::class, 'update']);

    Route::resource('/pengeluaran', PengeluaranController::class);
    Route::post('/pengeluaran/{id}/update', [PengeluaranController::class, 'update']);
});
