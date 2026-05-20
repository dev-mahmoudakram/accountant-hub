<?php

namespace App\Models;

use App\Enums\JobStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int $category_id
 * @property string $title
 * @property string $company_name
 * @property string $short_description
 * @property string $description
 * @property string $budget_min
 * @property string $budget_max
 * @property Carbon|null $deadline
 * @property string $expected_delivery_time
 * @property array<int, string> $required_skills
 * @property array<int, string>|null $attachments
 * @property JobStatus $status
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property int|null $bids_count
 */
class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'company_name',
        'short_description',
        'description',
        'budget_min',
        'budget_max',
        'deadline',
        'expected_delivery_time',
        'required_skills',
        'attachments',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'required_skills' => 'array',
            'attachments' => 'array',
            'status' => JobStatus::class,
            'deadline' => 'date',
            'budget_min' => 'decimal:2',
            'budget_max' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

    public function poster(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Close any open jobs whose application deadline has passed.
     *
     * Called by the scheduled command and lazily on the read endpoints,
     * so the listing / detail show fresh status even without cron.
     */
    public static function closeExpired(): int
    {
        return static::query()
            ->where('status', JobStatus::Open)
            ->whereDate('deadline', '<', today())
            ->update(['status' => JobStatus::Closed]);
    }
}
