<?php

namespace App\Http\Controllers\Api;

use App\Actions\Auth\LoginAccountantAction;
use App\Actions\Auth\RegisterAccountantAction;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(RegisterRequest $request, RegisterAccountantAction $action): JsonResponse
    {
        $action->execute($request);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully. Please sign in.',
        ], 201);
    }

    public function login(LoginRequest $request, LoginAccountantAction $action): JsonResponse
    {
        try {
            ['user' => $user, 'token' => $token] = $action->execute($request);
        } catch (AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    public function switchRole(Request $request): JsonResponse
    {
        $request->validate(['role' => ['required', Rule::enum(UserRole::class)]]);

        $user = $request->user();
        $user->currentAccessToken()->delete();

        $newToken = $user->createToken('api-token', [$request->role]);

        // Attach the new token so UserResource resolves the new role,
        // not the old (now-deleted) token still held in memory.
        $user->withAccessToken($newToken->accessToken);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'token' => $newToken->plainTextToken,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ]);
    }
}
