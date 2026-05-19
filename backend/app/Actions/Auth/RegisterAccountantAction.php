<?php

namespace App\Actions\Auth;

use App\Http\Requests\RegisterRequest;
use App\Models\User;

class RegisterAccountantAction
{
    public function execute(RegisterRequest $request): void
    {
        User::create($request->validated());
    }
}
