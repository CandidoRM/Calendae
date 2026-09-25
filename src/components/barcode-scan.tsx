import { ScanBarcode, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGlyphFlash } from "@/components/calendar-glyph";
import { sanitizeBarcode } from "@/lib/boleto";
import { cn, withTip } from "@/lib/utils";

type Detector = { detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]> };

function makeDetector(): Detector | null {
  const Ctor = (window as unknown as {
    BarcodeDetector?: new (opts?: { formats?: string[] }) => Detector;
  }).BarcodeDetector;
  if (!Ctor) return null;
  try {
    return new Ctor({ formats: ["itf", "code_128", "codabar", "code_39"] });
  } catch {
    try {
      return new Ctor();
    } catch {
      return null;
    }
  }
}

function pickDigits(raw: string): string {
  return sanitizeBarcode(raw);
}

export function BarcodeScanButton({ onRead }: { onRead: (digits: string) => void }) {
  const [live, setLive] = useState(false);
  const [flash, ping] = useGlyphFlash();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loopRef = useRef(0);

  function stop() {
    cancelAnimationFrame(loopRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLive(false);
  }

  useEffect(() => () => stop(), []);

  async function fromSource(source: CanvasImageSource) {
    const detector = makeDetector();
    if (!detector) return "";
    const codes = await detector.detect(source);
    for (const code of codes) {
      const digits = pickDigits(code.rawValue);
      if (digits.length >= 44) return digits;
    }
    return "";
  }

  async function loop() {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      loopRef.current = requestAnimationFrame(() => void loop());
      return;
    }
    try {
      const digits = await fromSource(video);
      if (digits) {
        onRead(digits);
        stop();
        return;
      }
    } catch {
      /* keep scanning */
    }
    loopRef.current = requestAnimationFrame(() => void loop());
  }

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      fileRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setLive(true);
      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play().then(() => void loop());
      });
    } catch {
      fileRef.current?.click();
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const bmp = await createImageBitmap(file);
      const digits = await fromSource(bmp);
      bmp.close();
      if (digits) onRead(digits);
    } catch {
      /* typed field still works */
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Ler código de barras"
        {...withTip("Câmera", "flex size-8 shrink-0 items-center justify-center text-fg")}
        onClick={() => {
          ping();
          void openCamera();
        }}
      >
        <ScanBarcode className={cn("cal-glyph size-4", flash && "is-flash")} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void onFile(file);
        }}
      />
      {live
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex flex-col bg-black">
              <video
                ref={videoRef}
                className="min-h-0 flex-1 object-cover"
                playsInline
                muted
                autoPlay
              />
              <button
                type="button"
                aria-label="Fechar câmera"
                className={cn("absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-black/50 text-white")}
                onClick={stop}
              >
                <X className="size-5" />
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
