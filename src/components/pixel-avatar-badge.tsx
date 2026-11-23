import { useEffect, useRef } from "react";
import type { CreatorProfile } from "@/lib/creators";
import {
  AVATAR_HEIGHT,
  AVATAR_WIDTH,
  type AvatarAnimState,
  PORTRAIT_SIZE,
  drawCreatorFacePortrait,
  drawCreatorPixelAvatar,
} from "@/lib/pixel-avatar";

export type PixelAvatarBadgeProps = {
  creator: CreatorProfile;
  scale?: number;
  mode?: "idle" | "run" | "jump";
  variant?: "sprite" | "face";
  className?: string;
};

export function PixelAvatarBadge({
  creator,
  scale = 3,
  mode = "idle",
  variant = "sprite",
  className = "",
}: PixelAvatarBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseW = variant === "face" ? PORTRAIT_SIZE : AVATAR_WIDTH;
  const baseH = variant === "face" ? PORTRAIT_SIZE : AVATAR_HEIGHT;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = Math.round(baseW * scale);
    const h = Math.round(baseH * scale);
    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = false;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let frameTick = 0;
    const renderFrame = (state: AvatarAnimState, frame: number) => {
      ctx.clearRect(0, 0, w, h);
      if (variant === "face") {
        drawCreatorFacePortrait(ctx, creator.pixelLook, { state, frame }, 0, 0, scale);
      } else {
        drawCreatorPixelAvatar(ctx, creator.pixelLook, { state, frame }, 0, 0, scale);
      }
    };

    renderFrame(mode === "run" ? "run" : mode === "jump" ? "jump" : "idle", 0);

    if (reducedMotion) {
      return;
    }

    const intervalMs = mode === "run" ? 110 : 420;
    const timer = window.setInterval(() => {
      frameTick += 1;
      if (mode === "run") {
        renderFrame("run", frameTick % 6);
      } else if (mode === "jump") {
        renderFrame("jump", 0);
      } else {
        const isBlink = frameTick % 7 === 0;
        renderFrame(isBlink ? "blink" : "idle", Math.floor(frameTick / 2) % 2);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [creator, scale, mode, variant, baseW, baseH]);

  if (creator.avatarSrc) {
    return (
      <img
        src={creator.avatarSrc}
        alt={`${creator.name} ${variant === "face" ? "portrait" : "pixel avatar"}`}
        width={Math.round(baseW * scale)}
        height={Math.round(baseH * scale)}
        referrerPolicy="no-referrer"
        className={`pixel-avatar-img ${className}`.trim()}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={Math.round(baseW * scale)}
      height={Math.round(baseH * scale)}
      className={`pixel-avatar-canvas ${className}`.trim()}
      aria-label={`${creator.name} stylized pixel ${variant === "face" ? "face portrait" : "avatar"}`}
      role="img"
    />
  );
}
