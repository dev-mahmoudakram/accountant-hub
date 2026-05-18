<?php

namespace App\Http\Controllers\Api;

use App\Actions\Bids\ListMyBidsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\BidResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyBidController extends Controller
{
    public function index(Request $request, ListMyBidsAction $action): JsonResponse
    {
        $perPage = min((int) $request->query('per_page', 12), 50);
        $paginator = $action->execute($request->user(), $perPage);

        return response()->json([
            'success' => true,
            'data' => BidResource::collection($paginator),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
