const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "huye_finds_token";

export interface UploadedImage {
  id: string;
  url: string;
  altText: string;
  isCover: boolean;
}

function xhrUpload<T>(url: string, formData: FormData, onProgress: (percent: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let body: unknown;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        return reject(new Error("Malformed response from server"));
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(body as T);
      } else {
        const message = (body as { error?: string })?.error ?? `Upload failed with status ${xhr.status}`;
        reject(new Error(message));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

// XMLHttpRequest, not fetch — fetch's Response stream has no
// upload-progress event, only a download-progress equivalent (which is
// useless here since the response body is tiny). XHR's `upload.onprogress`
// is the only way to drive a real per-file progress bar during the actual
// upload, not a fake one.
export function uploadPlaceImage(
  placeId: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("image", file);
  return xhrUpload<UploadedImage>(`${API_URL}/places/${placeId}/images`, formData, onProgress);
}

// Uploads a file with no place attached yet — used while a place is still
// being drafted in the create form. Returns just the hosted URL; the
// frontend holds these in local state and sends them along with the
// createPlace request once the person actually submits the form.
export function uploadStagingImage(file: File, onProgress: (percent: number) => void): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);
  return xhrUpload<{ url: string }>(`${API_URL}/uploads/image`, formData, onProgress);
}