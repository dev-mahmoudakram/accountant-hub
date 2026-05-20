<?php

namespace App\Http\Requests;

use App\Models\Job;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Fill missing budget fields from the existing job so that the
     * `gte:budget_min` rule has both sides to compare on partial updates.
     */
    protected function prepareForValidation(): void
    {
        $job = $this->route('job');
        if (! $job instanceof Job) {
            return;
        }

        $fill = [];
        if (! $this->has('budget_min') && $this->has('budget_max')) {
            $fill['budget_min'] = (float) $job->budget_min;
        }
        if (! $this->has('budget_max') && $this->has('budget_min')) {
            $fill['budget_max'] = (float) $job->budget_max;
        }

        if ($fill) {
            $this->merge($fill);
        }
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
