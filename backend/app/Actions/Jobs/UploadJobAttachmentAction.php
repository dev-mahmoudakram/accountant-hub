<?php

namespace App\Actions\Jobs;

use App\Models\Job;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadJobAttachmentAction
{
    public function execute(Job $job, UploadedFile $file): string
    {
        $original = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $basename = Str::slug(pathinfo($original, PATHINFO_FILENAME)) ?: 'file';
        $unique = Str::lower(Str::random(8));

        $filename = $extension
            ? "{$basename}-{$unique}.{$extension}"
            : "{$basename}-{$unique}";

        $path = $file->storeAs("job-attachments/{$job->id}", $filename, 'public');

        $attachments = $job->attachments ?? [];
        $attachments[] = $path;
        $job->update(['attachments' => $attachments]);

        return $path;
    }
}
