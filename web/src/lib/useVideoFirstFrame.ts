"use client";

import { useEffect, type RefObject } from "react";

/** Paint the first decoded frame so paused videos don't need a separate poster image. */
export function useVideoFirstFrame(
  videoRef: RefObject<HTMLVideoElement | null>,
  resetKey: string | number,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const paintFirstFrame = () => {
      if (cancelled) return;

      const onSeeked = () => {
        if (cancelled) return;
        video.pause();
        video.removeEventListener("seeked", onSeeked);
      };

      video.pause();
      video.addEventListener("seeked", onSeeked);

      try {
        // A tiny seek forces browsers to decode and display a real video frame.
        video.currentTime = video.currentTime >= 0.05 ? 0 : 0.05;
      } catch {
        video.removeEventListener("seeked", onSeeked);
      }
    };

    if (video.readyState >= 2) {
      paintFirstFrame();
    } else {
      video.addEventListener("loadeddata", paintFirstFrame, { once: true });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", paintFirstFrame);
    };
  }, [videoRef, resetKey]);
}
