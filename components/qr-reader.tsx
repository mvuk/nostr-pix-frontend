"use client";

import { useRef, useEffect } from "react";
import jsQR from "jsqr";

interface QRReaderProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
}

export function QRReader({ onResult, onError }: QRReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame: number;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          onResult(code.data);
          return;
        }
      }
      animationFrame = requestAnimationFrame(scan);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        animationFrame = requestAnimationFrame(scan);
      })
      .catch((err) => {
        onError?.(err.message);
      });

    return () => {
      cancelAnimationFrame(animationFrame);
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onResult, onError]);

  return (
    <div className="relative aspect-square">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-2 border-white/20" />
        <div className="absolute inset-[25%] border-2 border-white">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
        </div>
      </div>
    </div>
  );
}
