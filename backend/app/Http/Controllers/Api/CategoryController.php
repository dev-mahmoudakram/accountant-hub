<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobCategoryResource;
use App\Models\JobCategory;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = JobCategory::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => JobCategoryResource::collection($categories),
        ]);
    }
}
