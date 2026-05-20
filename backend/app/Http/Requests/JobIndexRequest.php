<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:500'],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:open,closed,all'],
            'sort' => ['nullable', 'string', 'in:newest,highest_budget,lowest_budget'],
            'date_from' => ['nullable', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'date_to'   => ['nullable', 'regex:/^\d{4}-(0[1-9]|1[0-2])$/'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }
}
