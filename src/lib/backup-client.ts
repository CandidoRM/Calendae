const FILE_NAME = "calendae-backup.zip";

function bytesFromBase64(base64: string): Uint8Array {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function clickDownload(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = FILE_NAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function saveProjectBackup(pack: { base64: string; url?: string }): Promise<void> {
  try {
    const bytes = bytesFromBase64(pack.base64);
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    const blob = new Blob([copy], { type: "application/zip" });
    const href = URL.createObjectURL(blob);
    clickDownload(href);
    window.setTimeout(() => URL.revokeObjectURL(href), 4000);
    return;
  } catch {
    /* fall through */
  }
  if (pack.url) {
    clickDownload(pack.url);
    return;
  }
  throw new Error("download failed");
}
