<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        if (!auth()->attempt($credentials)) {
            return response([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = auth()->user()->createToken('authToken')->plainTextToken;

        return response([
            'user' => auth()->user(),
            'token' => $token
        ],200);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        return response()->json(['message' => 'Successfully logged out']);
    }
}