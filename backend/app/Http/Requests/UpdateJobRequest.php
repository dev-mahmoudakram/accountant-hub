<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'integer', 'exists:job_categories,id'],
            'title' => ['sometimes', 'string', 'max:180'],
            'company_name' => ['sometimes', 'string', 'max:140'],
            'short_description' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'min:50'],
            'budget_min' => ['sometimes', 'numeric', 'min:1'],
            'budget_max' => ['sometimes', 'numeric', 'gte:budget_min'],
            'deadline' => ['sometimes', 'date', 'after:today'],
            'expected_delivery_time' => ['sometimes', 'string', 'max:60'],
            'required_skills' => ['sometimes', 'array', 'min:1'],
            'required_skills.*' => ['required_with:required_skills', 'string', 'max:50'],
        ];
    }
}
