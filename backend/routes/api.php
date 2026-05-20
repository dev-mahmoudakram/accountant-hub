<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BidController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\Client\ClientBidController;
use App\Http\Controllers\Api\Client\ClientJobController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\MyBidController;
use Illuminate\Support\Facades\Route;

// Auth — public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/switch-role', [AuthController::class, 'switchRole']);
    Route::get('/me', [AuthController::class, 'me']);

    // Accountant-only routes
    Route::middleware('role:accountant')->group(function () {
        Route::post('/jobs/{job}/bids', [BidController::class, 'store']);
        Route::get('/my-bids', [MyBidController::class, 'index']);
        Route::get('/my-bids/stats', [MyBidController::class, 'stats']);
        Route::patch('/my-bids/{bid}', [MyBidController::class, 'update']);
        Route::delete('/my-bids/{bid}', [MyBidController::class, 'destroy']);
    });

    // Client-only routes
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('/jobs', [ClientJobController::class, 'index']);
        Route::post('/jobs', [ClientJobController::class, 'store']);
        Route::get('/jobs/{job}', [ClientJobController::class, 'show']);
        Route::patch('/jobs/{job}', [ClientJobController::class, 'update']);
        Route::delete('/jobs/{job}', [ClientJobController::class, 'destroy']);
        Route::get('/jobs/{job}/bids', [ClientBidController::class, 'index']);
        Route::patch('/jobs/{job}/bids/{bid}', [ClientBidController::class, 'update']);
        Route::post('/jobs/{job}/attachments', [ClientJobController::class, 'storeAttachment']);
        Route::delete('/jobs/{job}/attachments', [ClientJobController::class, 'destroyAttachment']);
    });
});

// Categories — public
Route::get('/categories', [CategoryController::class, 'index']);

// Jobs — public
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/years', [JobController::class, 'years']);
Route::get('/jobs/{job}', [JobController::class, 'show']);
