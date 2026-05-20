<?php

namespace App\Http\Requests;

use App\Models\Job;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class SubmitBidRequest extends FormRequest
{
    /**
     * Allowed delivery durations and their length in days.
     * Mirrors frontend/lib/deliveryOptions.ts.
     */
    private const DELIVERY_DURATIONS = [
        '1 week'   => 7,
        '2 weeks'  => 14,
        '3 weeks'  => 21,
        '1 month'  => 30,
        '6 weeks'  => 42,
        '2 months' => 60,
        '3 months' => 90,
    ];

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
            'estimated_delivery_time' => [
                'required',
                'string',
                'in:' . implode(',', array_keys(self::DELIVERY_DURATIONS)),
                $this->deliveryNotLongerThanJobRule(),
            ],
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
            'estimated_delivery_time.in' => 'Please choose one of the listed delivery durations.',
        ];
    }

    /**
     * Reject a bid whose delivery is longer than the job's expected delivery.
     */
    private function deliveryNotLongerThanJobRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            $job = $this->route('job');
            if (! $job instanceof Job) {
                return;
            }

            $bidDays = self::DELIVERY_DURATIONS[$value] ?? null;
            $jobDays = self::DELIVERY_DURATIONS[$job->expected_delivery_time] ?? null;

            if ($bidDays !== null && $jobDays !== null && $bidDays > $jobDays) {
                $fail("Your delivery time can't exceed the job's expected delivery ({$job->expected_delivery_time}).");
            }
        };
    }
}
