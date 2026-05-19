<?php

namespace App\Actions\Jobs;

use App\Models\Job;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
class UploadJobAttachmentAction
{
    public function execute(Job $job, UploadedFile $file): string
    {
        $path = $file->storeAs("job-attachments/{$job->id}", $file->getClientOriginalName(), 'public');

        $attachments = $job->attachments ?? [];
        $attachments[] = $path;
        $job->update(['attachments' => $attachments]);

        return $path;
    }
}
