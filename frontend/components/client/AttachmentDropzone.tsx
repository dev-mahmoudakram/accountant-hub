'use client';

import { useRef, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Attachment {
  path: string;
  url: string;
  name: string;
}

interface Props {
  /** When provided, files upload immediately. Omit for queue-only mode (create flow). */
  jobId?: number;
  initialAttachments?: Attachment[];
  /** Called in queue mode whenever the pending file list changes. */
  onPendingChange?: (files: File[]) => void;
}

const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip';
const MAX_MB = 10;

function FileIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

export default function AttachmentDropzone({ jobId, initialAttachments = [], onPendingChange }: Props) {
  const isQueueMode = jobId === undefined;

  // Live mode state (edit flow)
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Queue mode state (create flow)
  const [pending, setPending] = useState<File[]>([]);

  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Queue mode helpers ────────────────────────────────────────────────────

  function addPending(files: File[]) {
    const valid = files.filter((f) => {
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`${f.name} exceeds the ${MAX_MB} MB limit.`);
        return false;
      }
      return true;
    });
    const next = [...pending, ...valid];
    setPending(next);
    onPendingChange?.(next);
  }

  function removePending(index: number) {
    const next = pending.filter((_, i) => i !== index);
    setPending(next);
    onPendingChange?.(next);
  }

  // ── Live mode helpers ─────────────────────────────────────────────────────

  async function uploadFile(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`${file.name} exceeds the ${MAX_MB} MB limit.`);
      return;
    }
    const form = new FormData();
    form.append('file', file);
    setUploading(true);
    try {
      const res = await api.postForm<{ success: boolean; attachment: Attachment }>(
        `/client/jobs/${jobId}/attachments`,
        form,
      );
      setAttachments((prev) => [...prev, res.attachment]);
      toast.success(`${file.name} uploaded.`);
    } catch {
      toast.error(`Failed to upload ${file.name}.`);
    } finally {
      setUploading(false);
    }
  }

  async function deleteAttachment(path: string) {
    setDeleting(path);
    try {
      await api.delete(`/client/jobs/${jobId}/attachments`, { path });
      setAttachments((prev) => prev.filter((a) => a.path !== path));
      toast.success('Attachment removed.');
    } catch {
      toast.error('Failed to remove attachment.');
    } finally {
      setDeleting(null);
    }
  }

  // ── Shared drag/drop/input handlers ──────────────────────────────────────

  function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (isQueueMode) {
      addPending(arr);
    } else {
      arr.forEach(uploadFile);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const isBusy = uploading;

  return (
    <div className="space-y-3">
      {isQueueMode && (
        <p className="text-xs text-muted">Files will be uploaded automatically after the job is created.</p>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload attachments"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={[
          'relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-sm transition-colors cursor-pointer select-none',
          dragging
            ? 'border-brand bg-brand/5 text-brand'
            : 'border-border text-muted hover:border-brand/50 hover:bg-brand/5',
          isBusy ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
      >
        <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span>
          {uploading ? 'Uploading…' : (
            <>
              <span className="font-medium text-ink">Click to upload</span> or drag & drop
            </>
          )}
        </span>
        <span className="text-xs">PDF, DOC, XLS, PNG, JPG, ZIP · max {MAX_MB} MB each</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        aria-label="Upload attachment files"
        className="sr-only"
        onChange={onInputChange}
        tabIndex={-1}
      />

      {/* Queue mode: pending files */}
      {isQueueMode && pending.length > 0 && (
        <ul className="space-y-2">
          {pending.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm bg-white"
            >
              <span className="flex items-center gap-2 min-w-0 text-ink">
                <FileIcon />
                <span className="truncate">{f.name}</span>
              </span>
              <button
                type="button"
                onClick={() => removePending(i)}
                className="shrink-0 text-muted hover:text-red-500 transition-colors"
                aria-label={`Remove ${f.name}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Live mode: uploaded attachments */}
      {!isQueueMode && attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((a) => (
            <li
              key={a.path}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm bg-white"
            >
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 min-w-0 text-brand hover:underline"
              >
                <FileIcon />
                <span className="truncate">{a.name}</span>
              </a>
              <button
                type="button"
                disabled={deleting === a.path}
                onClick={() => deleteAttachment(a.path)}
                className="shrink-0 text-muted hover:text-red-500 transition-colors disabled:opacity-40"
                aria-label={`Remove ${a.name}`}
              >
                {deleting === a.path ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
