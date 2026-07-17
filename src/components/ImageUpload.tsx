import { useEffect, useRef, useState } from "react";
import { FileUpload } from "@/components/application/file-upload/file-upload-base";
import { uploadStagingImage } from "@/lib/uploadImage";
import type { UploadedFile } from "@/types";

export interface StagedImage {
  url: string;
  altText?: string;
}

interface ImageUploadProps {
  // Reported on every change so the parent form can gate its submit
  // button — never lift raw File objects up, only the derived summary.
  onStateChange: (state: { images: StagedImage[]; isUploading: boolean; hasFailed: boolean }) => void;
}

export function ImageUpload({ onStateChange }: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Original File objects live here, keyed by id — kept OUT of state so
  // retry can re-send the actual file content instead of reconstructing
  // an empty File from just a name/type (a real bug in an earlier draft
  // of this component).
  const fileObjectsRef = useRef<Map<string, File>>(new Map());

  // Bubble up a derived summary any time the file list changes, so the
  // parent (CreatePlacePage) can decide whether "Create" should be
  // enabled and what image URLs to submit alongside the place.
  useEffect(() => {
    onStateChange({
      images: uploadedFiles.filter((f) => f.url).map((f) => ({ url: f.url! })),
      isUploading: uploadedFiles.some((f) => !f.failed && f.progress < 100),
      hasFailed: uploadedFiles.some((f) => f.failed),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles]);

  function startUpload(id: string, file: File) {
    uploadStagingImage(file, (progress) => {
      setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)));
    })
      .then((result) => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: 100, failed: false, url: result.url } : f))
        );
      })
      .catch(() => {
        setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, failed: true } : f)));
      });
  }

  function handleDropFiles(files: FileList) {
    const newFiles = Array.from(files);

    const newEntries: UploadedFile[] = newFiles.map((file) => {
      const id = crypto.randomUUID();
      fileObjectsRef.current.set(id, file);
      return { id, name: file.name, size: file.size, type: file.type, progress: 0 };
    });

    setUploadedFiles((prev) => [...newEntries, ...prev]);
    newEntries.forEach((entry) => startUpload(entry.id, fileObjectsRef.current.get(entry.id)!));
  }

  function handleDropUnacceptedFiles(files: FileList) {
    console.warn("Rejected files (wrong type or too large):", Array.from(files).map((f) => f.name));
  }

  function handleDeleteFile(id: string) {
    fileObjectsRef.current.delete(id);
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handleRetryFile(id: string) {
    const file = fileObjectsRef.current.get(id);
    if (!file) return; // original File is gone (e.g. page reload) — can't retry, only re-drop
    setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress: 0, failed: false } : f)));
    startUpload(id, file);
  }

  return (
    <FileUpload.Root>
      <FileUpload.DropZone
        accept="image/jpeg,image/png,image/webp"
        hint="PNG, JPEG, or WebP — up to 5MB each."
        onDropFiles={handleDropFiles}
        onDropUnacceptedFiles={handleDropUnacceptedFiles}
      />

      <FileUpload.List>
        {uploadedFiles.map((file) => (
          <FileUpload.ListItemProgressBar
            key={file.id}
            {...file}
            size={file.size}
            onDelete={() => handleDeleteFile(file.id)}
            onRetry={() => handleRetryFile(file.id)}
          />
        ))}
      </FileUpload.List>
    </FileUpload.Root>
  );
}