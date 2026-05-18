<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\MyBidController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Bids
    Route::post('/jobs/{job}/bids', [BidController::class, 'store']);
    Route::get('/my-bids', [MyBidController::class, 'index']);
});

// Categories
Route::get('/categories', [CategoryController::class, 'index']);

// Jobs
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);
