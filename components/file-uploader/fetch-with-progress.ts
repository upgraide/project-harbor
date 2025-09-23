export function fetchWithProgress(
  url: string,
  opts: {
    headers?: Headers;
    method?: string;
    body?: File;
  } = {},
  onProgress?: (this: XMLHttpRequest, progress: ProgressEvent) => void,
  onError?: (this: XMLHttpRequest, progress: ProgressEvent) => void,
  onLoad?: (this: XMLHttpRequest, progress: ProgressEvent) => void,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open(opts.method ?? "get", url);
    opts.headers &&
      Object.keys(opts.headers).forEach(
        (h) =>
          opts.headers && xhr.setRequestHeader(h, opts.headers.get(h) ?? ""),
      );

    if (onLoad) xhr.onload = onLoad;
    if (onError) xhr.onerror = onError;
    if (onProgress && xhr.upload) xhr.upload.onprogress = onProgress;
    xhr.send(opts.body);
  });
}
