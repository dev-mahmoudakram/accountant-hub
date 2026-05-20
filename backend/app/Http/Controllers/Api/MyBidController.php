<?php

namespace App\Http\Controllers\Api;

use App\Actions\Bids\ListMyBidsAction;
use App\Actions\Bids\UpdateMyBidAction;
use App\Enums\BidStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMyBidRequest;
use App\Http\Resources\BidResource;
use App\Models\Bid;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MyBidController extends Controller
{
    public function index(Request $request, ListMyBidsAction $action): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', Rule::in(['pending', 'accepted', 'rejected', 'all'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 12);
        $paginator = $action->execute($request->user(), $validated['status'] ?? null, $perPage);

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

    public function stats(Request $request): JsonResponse
    {
        $counts = $request->user()
            ->bids()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return response()->json([
            'success' => true,
            'data' => [
                'total' => (int) $counts->sum(),
                'pending' => (int) ($counts[BidStatus::Pending->value] ?? 0),
                'accepted' => (int) ($counts[BidStatus::Accepted->value] ?? 0),
                'rejected' => (int) ($counts[BidStatus::Rejected->value] ?? 0),
            ],
        ]);
    }

    public function update(UpdateMyBidRequest $request, Bid $bid, UpdateMyBidAction $action): JsonResponse
    {
        $this->authorize('modify', $bid);

        $bid = $action->execute($request, $bid);

        return response()->json([
            'success' => true,
            'message' => 'Bid updated successfully.',
            'data' => new BidResource($bid),
        ]);
    }

    public function destroy(Bid $bid): JsonResponse
    {
        $this->authorize('modify', $bid);

        $bid->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bid withdrawn successfully.',
        ]);
    }
}
