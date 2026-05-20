<?php

namespace App\Actions\Jobs;

use App\Models\Job;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Storage;

class DeleteJobAttachmentAction
{
    public function execute(Job $job, string $path): void
    {
        $attachments = $job->attachments ?? [];

        if (! in_array($path, $attachments, true)) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Attachment does not belong to this job.',
            ], 404));
        }

        Storage::disk('public')->delete($path);

        $job->update([
            'attachments' => array_values(array_filter($attachments, fn ($a) => $a !== $path)),
        ]);
    }
}
