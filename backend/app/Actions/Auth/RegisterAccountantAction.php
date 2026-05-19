<?php

namespace App\Actions\Auth;

use App\Http\Requests\RegisterRequest;
use App\Models\User;

class RegisterAccountantAction
{
    public function execute(RegisterRequest $request): array
    {
        $user = User::create($request->validated());

        $token = $user->createToken('api-token')->plainTextToken;

        return compact('user', 'token');
    }
}
