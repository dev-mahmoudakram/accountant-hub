<?php

namespace App\Http\Requests;

use App\Models\Job;
use Illuminate\Foundation\Http\FormRequest;

class SubmitBidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $priceRules = ['required', 'numeric', 'min:1'];

        $job = $this->route('job');
        if ($job instanceof Job) {
            $priceRules[] = 'min:' . $job->budget_min;
            $priceRules[] = 'max:' . $job->budget_max;
        }

        return [
            'proposed_price' => $priceRules,
            'estimated_delivery_time' => ['required', 'string', 'max:60'],
            'cover_letter' => ['required', 'string', 'min:50'],
            'experience_summary' => ['required', 'string', 'min:30'],
        ];
    }

    public function messages(): array
    {
        $job = $this->route('job');
        if (! $job instanceof Job) {
            return [];
        }

        return [
            'proposed_price.min' => "Your price must be at least \${$job->budget_min} (the job's minimum budget).",
            'proposed_price.max' => "Your price must be at most \${$job->budget_max} (the job's maximum budget).",
        ];
    }
}
