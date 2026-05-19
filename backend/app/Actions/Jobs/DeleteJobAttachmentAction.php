<?php

namespace App\Actions\Jobs;

use App\Models\Job;
use Illuminate\Support\Facades\Storage;

class DeleteJobAttachmentAction
{
    public function execute(Job $job, string $path): void
    {
        Storage::disk('public')->delete($path);

        $attachments = array_values(
            array_filter($job->attachments ?? [], fn ($a) => $a !== $path)
        );

        $job->update(['attachments' => $attachments]);
    }
}
