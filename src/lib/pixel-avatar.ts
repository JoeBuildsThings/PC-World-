import type { PixelLookConfig } from "./creators";

export type AvatarAnimState = "idle" | "blink" | "run" | "jump" | "hit";

export type AvatarPose = {
  state: AvatarAnimState;
  frame: number; // 0..5 for run, 0..1 for idle
};

export const AVATAR_WIDTH = 24;
export const AVATAR_HEIGHT = 32;
export const PORTRAIT_SIZE = 36;

type RunFrameSpec = {
  bodyOffsetY: number;
  headOffsetY: number;
  leftLegX: number;
  leftLegY: number;
  leftLegH: number;
  rightLegX: number;
  rightLegY: number;
  rightLegH: number;
  leftArmY: number;
  rightArmY: number;
  cordShift: number;
};

const RUN_CYCLE_FRAMES: readonly RunFrameSpec[] = [
  {
    bodyOffsetY: 0,
    headOffsetY: 0,
    leftLegX: 6,
    leftLegY: 25,
    leftLegH: 5,
    rightLegX: 14,
    rightLegY: 24,
    rightLegH: 7,
    leftArmY: 16,
    rightArmY: 18,
    cordShift: 0,
  },
  {
    bodyOffsetY: 1,
    headOffsetY: 1,
    leftLegX: 8,
    leftLegY: 25,
    leftLegH: 6,
    rightLegX: 13,
    rightLegY: 25,
    rightLegH: 7,
    leftArmY: 17,
    rightArmY: 17,
    cordShift: 1,
  },
  {
    bodyOffsetY: 0,
    headOffsetY: 0,
    leftLegX: 10,
    leftLegY: 24,
    leftLegH: 7,
    rightLegX: 11,
    rightLegY: 26,
    rightLegH: 5,
    leftArmY: 17,
    rightArmY: 16,
    cordShift: 0,
  },
  {
    bodyOffsetY: -1,
    headOffsetY: -1,
    leftLegX: 14,
    leftLegY: 24,
    leftLegH: 6,
    rightLegX: 6,
    rightLegY: 24,
    rightLegH: 5,
    leftArmY: 18,
    rightArmY: 15,
    cordShift: -1,
  },
  {
    bodyOffsetY: 0,
    headOffsetY: 0,
    leftLegX: 14,
    leftLegY: 24,
    leftLegH: 7,
    rightLegX: 7,
    rightLegY: 25,
    rightLegH: 5,
    leftArmY: 18,
    rightArmY: 16,
    cordShift: 0,
  },
  {
    bodyOffsetY: 1,
    headOffsetY: 1,
    leftLegX: 12,
    leftLegY: 25,
    leftLegH: 7,
    rightLegX: 9,
    rightLegY: 25,
    rightLegH: 6,
    leftArmY: 17,
    rightArmY: 17,
    cordShift: 1,
  },
] as const;

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/**
 * Renders the 24x32 stylized full-body creator pixel sprite with clear,
 * expressive eyes, brows, hair, beard/jawline, and signature hoodie.
 */
export function drawCreatorPixelAvatar(
  ctx: CanvasRenderingContext2D,
  look: PixelLookConfig,
  pose: AvatarPose,
  ox = 0,
  oy = 0,
  scale = 1,
) {
  ctx.save();
  ctx.translate(Math.round(ox), Math.round(oy));
  if (scale !== 1) {
    ctx.scale(scale, scale);
  }

  const runIdx = ((pose.frame % 6) + 6) % 6;
  const idleBreathe = pose.state === "idle" && pose.frame % 2 === 1 ? 1 : 0;
  const runSpec = RUN_CYCLE_FRAMES[runIdx];

  let bodyY = 15 + idleBreathe;
  let headY = 3 + idleBreathe;

  if (pose.state === "run") {
    bodyY = 15 + runSpec.bodyOffsetY;
    headY = 3 + runSpec.headOffsetY;
  } else if (pose.state === "jump") {
    bodyY = 14;
    headY = 2;
  } else if (pose.state === "hit") {
    bodyY = 15;
    headY = 4;
  }

  // 1. Ground shadow
  const shadowWidth = pose.state === "jump" ? 12 : 16;
  const shadowX = Math.floor((AVATAR_WIDTH - shadowWidth) / 2);
  px(ctx, shadowX, 30, shadowWidth, 2, "rgba(0, 0, 0, 0.26)");

  // 2. Legs & Shoes
  if (pose.state === "run") {
    px(ctx, runSpec.leftLegX, runSpec.leftLegY, 4, runSpec.leftLegH - 2, look.pants);
    px(ctx, runSpec.leftLegX, runSpec.leftLegY + runSpec.leftLegH - 2, 5, 2, look.shoes);
    px(ctx, runSpec.leftLegX + 3, runSpec.leftLegY + runSpec.leftLegH - 2, 2, 1, look.shoeAccent);

    px(ctx, runSpec.rightLegX, runSpec.rightLegY, 4, runSpec.rightLegH - 2, look.pants);
    px(ctx, runSpec.rightLegX, runSpec.rightLegY + runSpec.rightLegH - 2, 5, 2, look.shoes);
    px(ctx, runSpec.rightLegX + 3, runSpec.rightLegY + runSpec.rightLegH - 2, 2, 1, look.shoeAccent);
  } else if (pose.state === "jump") {
    px(ctx, 6, 23, 4, 4, look.pants);
    px(ctx, 5, 26, 5, 2, look.shoes);
    px(ctx, 8, 26, 2, 1, look.shoeAccent);

    px(ctx, 14, 22, 4, 4, look.pants);
    px(ctx, 14, 25, 5, 2, look.shoes);
    px(ctx, 17, 25, 2, 1, look.shoeAccent);
  } else if (pose.state === "hit") {
    px(ctx, 5, 24, 4, 5, look.pants);
    px(ctx, 4, 28, 5, 2, look.shoes);
    px(ctx, 15, 23, 4, 5, look.pants);
    px(ctx, 15, 27, 5, 2, look.shoes);
  } else {
    px(ctx, 7, 24, 4, 5, look.pants);
    px(ctx, 7, 29, 5, 2, look.shoes);
    px(ctx, 10, 29, 2, 1, look.shoeAccent);

    px(ctx, 13, 24, 4, 5, look.pants);
    px(ctx, 13, 29, 5, 2, look.shoes);
    px(ctx, 16, 29, 2, 1, look.shoeAccent);
  }

  // 3. Hoodie Torso
  px(ctx, 5, bodyY, 14, 9, look.hoodieMain);
  px(ctx, 5, bodyY + 7, 14, 2, look.hoodieShade);
  px(ctx, 7, bodyY, 10, 2, look.hoodieAccent);
  const cordLen = pose.state === "jump" ? 3 : 4;
  const cordShift = pose.state === "run" ? runSpec.cordShift : 0;
  px(ctx, 9, bodyY + 2 + cordShift, 1, cordLen, look.hoodieAccent);
  px(ctx, 14, bodyY + 2 - cordShift, 1, cordLen, look.hoodieAccent);

  // Arms
  if (pose.state === "jump") {
    px(ctx, 3, bodyY - 1, 2, 6, look.hoodieMain);
    px(ctx, 3, bodyY + 5, 2, 2, look.skin);
    px(ctx, 19, bodyY - 2, 2, 6, look.hoodieMain);
    px(ctx, 19, bodyY + 4, 2, 2, look.skin);
  } else if (pose.state === "run") {
    px(ctx, 3, runSpec.leftArmY, 2, 6, look.hoodieMain);
    px(ctx, 3, runSpec.leftArmY + 6, 2, 2, look.skin);
    px(ctx, 19, runSpec.rightArmY, 2, 6, look.hoodieMain);
    px(ctx, 19, runSpec.rightArmY + 6, 2, 2, look.skin);
  } else if (pose.state === "hit") {
    px(ctx, 2, bodyY - 2, 3, 5, look.hoodieMain);
    px(ctx, 19, bodyY - 2, 3, 5, look.hoodieMain);
  } else {
    px(ctx, 3, bodyY + 1, 2, 6, look.hoodieMain);
    px(ctx, 3, bodyY + 7, 2, 2, look.skin);
    px(ctx, 19, bodyY + 1, 2, 6, look.hoodieMain);
    px(ctx, 19, bodyY + 7, 2, 2, look.skin);
  }

  // 4. Head, Neck & Cheek Shading
  px(ctx, 10, headY + 11, 4, 2, look.skinShadow);
  px(ctx, 5, headY + 2, 14, 10, look.skin);
  px(ctx, 4, headY + 5, 1, 3, look.skinShadow);
  px(ctx, 19, headY + 5, 1, 3, look.skin);
  // Subtle nose bridge & cheek warmth
  px(ctx, 11, headY + 6, 2, 2, look.skinShadow);
  px(ctx, 6, headY + 7, 2, 1, look.cheekTint);
  px(ctx, 16, headY + 7, 2, 1, look.cheekTint);

  // 5. Hair
  if (look.hairStyle === "carter") {
    px(ctx, 5, headY, 14, 3, look.hair);
    px(ctx, 4, headY + 1, 2, 4, look.hair);
    px(ctx, 18, headY + 1, 2, 3, look.hair);
    px(ctx, 6, headY + 2, 4, 2, look.hair);
    px(ctx, 12, headY + 2, 3, 1, look.hair);
    px(ctx, 8, headY, 6, 1, look.hairHighlight);
  } else {
    px(ctx, 6, headY - 1, 12, 3, look.hair);
    px(ctx, 5, headY + 1, 14, 2, look.hair);
    px(ctx, 8, headY - 1, 5, 1, look.hairHighlight);
    px(ctx, 5, headY + 3, 1, 3, look.hair);
    px(ctx, 18, headY + 3, 1, 3, look.hair);
  }

  // 6. Expressive Eyebrows & Open Eyes
  const eyeY = headY + 5;
  const browY = headY + 4;

  // Brows
  if (pose.state === "jump") {
    px(ctx, 7, browY - 1, 3, 1, look.browColor);
    px(ctx, 14, browY - 1, 3, 1, look.browColor);
  } else if (pose.state === "hit") {
    px(ctx, 7, browY, 2, 1, look.browColor);
    px(ctx, 15, browY, 2, 1, look.browColor);
  } else {
    px(ctx, 7, browY, 3, 1, look.browColor);
    px(ctx, 14, browY, 3, 1, look.browColor);
  }

  if (pose.state === "blink") {
    px(ctx, 7, eyeY + 1, 3, 1, "#151914");
    px(ctx, 14, eyeY + 1, 3, 1, "#151914");
  } else if (pose.state === "hit") {
    px(ctx, 7, eyeY, 3, 2, "#f2efe7");
    px(ctx, 14, eyeY, 3, 2, "#f2efe7");
    px(ctx, 8, eyeY, 1, 2, "#ed643d");
    px(ctx, 15, eyeY, 1, 2, "#ed643d");
  } else {
    // Open expressive eyes (sclera + colored iris + dark pupil)
    px(ctx, 7, eyeY, 3, 2, "#f2efe7");
    px(ctx, 14, eyeY, 3, 2, "#f2efe7");
    px(ctx, 8, eyeY, 2, 2, look.eyeColor);
    px(ctx, 15, eyeY, 2, 2, look.eyeColor);
    px(ctx, 8, eyeY + 1, 1, 1, "#151914");
    px(ctx, 15, eyeY + 1, 1, 1, "#151914");
  }

  // 7. Beard / Jawline & Mouth Expression
  if (look.beard) {
    px(ctx, 5, headY + 8, 2, 3, look.beardColor);
    px(ctx, 17, headY + 8, 2, 3, look.beardColor);
    px(ctx, 6, headY + 10, 12, 2, look.beardColor);
    px(ctx, 9, headY + 9, 6, 1, look.beardColor);
    if (pose.state === "hit") {
      px(ctx, 10, headY + 10, 4, 2, "#f2efe7");
    } else if (pose.state === "jump") {
      px(ctx, 10, headY + 10, 4, 1, "#f2efe7");
    } else {
      px(ctx, 10, headY + 10, 4, 1, look.lipColor);
    }
  } else {
    px(ctx, 6, headY + 11, 12, 1, look.skinShadow);
    if (pose.state === "hit") {
      px(ctx, 10, headY + 9, 3, 2, "#151914");
    } else if (pose.state === "jump") {
      px(ctx, 9, headY + 9, 5, 1, "#f2efe7");
      px(ctx, 10, headY + 10, 3, 1, look.lipColor);
    } else {
      px(ctx, 10, headY + 9, 4, 1, look.lipColor);
      px(ctx, 13, headY + 8, 1, 1, look.skinShadow);
    }
  }

  ctx.restore();
}

/**
 * Renders a detailed 36x36 head-and-shoulders pixel portrait of the creator
 * for Character Select cards, Challenge Header badges, and Score Cards.
 */
export function drawCreatorFacePortrait(
  ctx: CanvasRenderingContext2D,
  look: PixelLookConfig,
  pose: AvatarPose,
  ox = 0,
  oy = 0,
  scale = 1,
) {
  ctx.save();
  ctx.translate(Math.round(ox), Math.round(oy));
  if (scale !== 1) {
    ctx.scale(scale, scale);
  }

  const bob = pose.state === "idle" && pose.frame % 2 === 1 ? 1 : 0;
  const y0 = bob;

  // Shoulders & Hoodie Collar
  px(ctx, 6, 27 + y0, 24, 9, look.hoodieMain);
  px(ctx, 4, 30 + y0, 28, 6, look.hoodieMain);
  px(ctx, 10, 26 + y0, 16, 4, look.hoodieShade);
  px(ctx, 11, 26 + y0, 14, 2, look.hoodieAccent);
  // Hoodie drawstrings
  px(ctx, 13, 28 + y0, 2, 6, look.hoodieAccent);
  px(ctx, 21, 28 + y0, 2, 6, look.hoodieAccent);

  // Neck & Chin shadow
  px(ctx, 14, 23 + y0, 8, 5, look.skinShadow);

  // Ears
  px(ctx, 6, 14 + y0, 2, 5, look.skinShadow);
  px(ctx, 28, 14 + y0, 2, 5, look.skin);

  // Head silhouette (rounded pixel jaw)
  px(ctx, 8, 7 + y0, 20, 16, look.skin);
  px(ctx, 10, 22 + y0, 16, 2, look.skin);
  px(ctx, 12, 23 + y0, 12, 1, look.skinShadow);

  // Forehead & cheekbone lighting
  px(ctx, 8, 11 + y0, 1, 10, look.skinShadow);
  px(ctx, 27, 11 + y0, 1, 10, look.skinShadow);
  px(ctx, 10, 17 + y0, 3, 2, look.cheekTint);
  px(ctx, 23, 17 + y0, 3, 2, look.cheekTint);

  // Hair Silhouette (distinct per creator)
  if (look.hairStyle === "carter") {
    // Textured medium-short brown hair with front sweep
    px(ctx, 8, 3 + y0, 20, 5, look.hair);
    px(ctx, 7, 5 + y0, 3, 8, look.hair);
    px(ctx, 26, 5 + y0, 3, 8, look.hair);
    // Textured fringe tufts
    px(ctx, 9, 7 + y0, 5, 3, look.hair);
    px(ctx, 14, 7 + y0, 4, 2, look.hair);
    px(ctx, 20, 7 + y0, 5, 2, look.hair);
    // Hair top highlights
    px(ctx, 11, 3 + y0, 9, 2, look.hairHighlight);
    px(ctx, 10, 5 + y0, 4, 1, look.hairHighlight);
  } else {
    // KayJay's styled dark crown hair with crisp fade sides
    px(ctx, 10, 2 + y0, 16, 4, look.hair);
    px(ctx, 8, 4 + y0, 20, 4, look.hair);
    px(ctx, 7, 7 + y0, 2, 6, look.hair);
    px(ctx, 27, 7 + y0, 2, 6, look.hair);
    // Subtle hairline peak & top texture highlights
    px(ctx, 16, 7 + y0, 4, 1, look.hair);
    px(ctx, 12, 3 + y0, 8, 1, look.hairHighlight);
    px(ctx, 15, 5 + y0, 6, 1, look.hairHighlight);
  }

  // Expressive Eyebrows
  const browY = pose.state === "jump" ? 10 + y0 : 11 + y0;
  px(ctx, 10, browY, 5, 1, look.browColor);
  px(ctx, 10, browY + 1, 2, 1, look.browColor);
  px(ctx, 21, browY, 5, 1, look.browColor);
  px(ctx, 24, browY + 1, 2, 1, look.browColor);

  // Expressive Eyes (sclera, colored iris, pupil, specular catchlight)
  const eyeY = 13 + y0;
  if (pose.state === "blink") {
    px(ctx, 10, eyeY + 2, 5, 1, "#151914");
    px(ctx, 21, eyeY + 2, 5, 1, "#151914");
  } else if (pose.state === "hit") {
    px(ctx, 10, eyeY, 5, 3, "#f2efe7");
    px(ctx, 21, eyeY, 5, 3, "#f2efe7");
    px(ctx, 12, eyeY + 1, 2, 2, "#ed643d");
    px(ctx, 22, eyeY + 1, 2, 2, "#ed643d");
  } else {
    // Upper lash shadow
    px(ctx, 10, eyeY, 5, 1, "#151914");
    px(ctx, 21, eyeY, 5, 1, "#151914");
    // Sclera
    px(ctx, 10, eyeY + 1, 5, 2, "#f2efe7");
    px(ctx, 21, eyeY + 1, 5, 2, "#f2efe7");
    // Iris + Pupil
    px(ctx, 12, eyeY + 1, 2, 2, look.eyeColor);
    px(ctx, 22, eyeY + 1, 2, 2, look.eyeColor);
    px(ctx, 12, eyeY + 2, 1, 1, "#151914");
    px(ctx, 22, eyeY + 2, 1, 1, "#151914");
    // Catchlight
    px(ctx, 11, eyeY + 1, 1, 1, "#ffffff");
    px(ctx, 21, eyeY + 1, 1, 1, "#ffffff");
  }

  // Nose bridge & tip shadow
  px(ctx, 17, 15 + y0, 2, 3, look.skinShadow);
  px(ctx, 16, 17 + y0, 4, 1, look.skinShadow);

  // Beard / Jaw & Smile
  if (look.beard) {
    // Full trimmed beard framing jaw and cheeks
    px(ctx, 8, 17 + y0, 2, 5, look.beardColor);
    px(ctx, 26, 17 + y0, 2, 5, look.beardColor);
    px(ctx, 9, 20 + y0, 18, 4, look.beardColor);
    px(ctx, 11, 23 + y0, 14, 1, look.beardColor);
    // Mustache
    px(ctx, 13, 19 + y0, 10, 1, look.beardColor);
    // Warm smile inside beard
    px(ctx, 15, 20 + y0, 6, 1, "#f2efe7");
    px(ctx, 16, 21 + y0, 4, 1, look.lipColor);
  } else {
    // Clean-shaven smile & chin shadow
    px(ctx, 14, 20 + y0, 8, 1, look.lipColor);
    px(ctx, 15, 19 + y0, 6, 1, "#f2efe7");
    px(ctx, 13, 19 + y0, 1, 1, look.skinShadow);
    px(ctx, 22, 19 + y0, 1, 1, look.skinShadow);
    px(ctx, 16, 22 + y0, 4, 1, look.skinShadow);
  }

  ctx.restore();
}

/**
 * Generates a deterministic matrix representation of the 24x32 avatar
 * for unit testing sprite states (idle, blink, run 0..5, jump, hit).
 */
export function sampleAvatarSignature(
  look: PixelLookConfig,
  pose: AvatarPose,
): string {
  const runIdx = ((pose.frame % 6) + 6) % 6;
  const spec = RUN_CYCLE_FRAMES[runIdx];
  return [
    look.hairStyle,
    look.beard ? "beard" : "clean",
    pose.state,
    pose.state === "run"
      ? `${runIdx}:${spec.leftLegX},${spec.rightLegX},${spec.bodyOffsetY}`
      : `${pose.frame % 2}`,
  ].join("|");
}
