<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:job_categories,id'],
            'title' => ['required', 'string', 'max:180'],
            'company_name' => ['required', 'string', 'max:140'],
            'short_description' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:50'],
            'budget_min' => ['required', 'numeric', 'min:1'],
            'budget_max' => ['required', 'numeric', 'gte:budget_min'],
            'deadline' => ['required', 'date', 'after:today'],
            'expected_delivery_time' => ['required', 'string', 'max:60'],
            'required_skills' => ['required', 'array', 'min:1'],
            'required_skills.*' => ['required', 'string', 'max:50'],
        ];
    }
}
