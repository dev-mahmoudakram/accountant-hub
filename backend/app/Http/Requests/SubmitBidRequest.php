<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitBidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'proposed_price' => ['required', 'numeric', 'min:1'],
            'estimated_delivery_time' => ['required', 'string', 'max:60'],
            'cover_letter' => ['required', 'string', 'min:50'],
            'experience_summary' => ['required', 'string', 'min:30'],
        ];
    }
}
