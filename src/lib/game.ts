import type { CreatorProfile, CreatorSlug, WorldZonePalette } from "./creators";
import { drawCreatorFacePortrait } from "./pixel-avatar";

export type QuizChoice = {
  id: string;
  label: string;
  detail: string;
};

export type QuizRound = {
  id: string;
  prompt: string;
  context: string;
  answerId: string;
  explanation: string;
  choices: readonly [QuizChoice, QuizChoice, QuizChoice];
};

export const gameRounds: readonly QuizRound[] = [
  {
    id: "boot-drive",
    prompt: "A gaming PC feels slow when loading games. What upgrade makes the biggest difference first?",
    context: "Focus on the component responsible for loading files and levels.",
    answerId: "nvme",
    explanation:
      "Moving games and the operating system onto a fast NVMe solid state drive cuts load times dramatically compared with an older hard drive.",
    choices: [
      {
        id: "nvme",
        label: "NVMe solid state drive",
        detail: "Fast storage directly speeds up game and system loading.",
      },
      {
        id: "fans",
        label: "Extra RGB case fans",
        detail: "Airflow helps cooling, not file loading speed.",
      },
      {
        id: "stand",
        label: "A taller monitor arm",
        detail: "Ergonomics matter, though storage is the bottleneck here.",
      },
    ],
  },
  {
    id: "psu-swap",
    prompt: "You are upgrading to a much hungrier graphics card. What must be verified before powering on?",
    context: "Sudden shutdowns under load usually trace back to power delivery.",
    answerId: "psu",
    explanation:
      "Confirm the power supply wattage, rail quality, and required PCIe power cables match the new graphics card demand.",
    choices: [
      {
        id: "psu",
        label: "Power supply capacity and condition",
        detail: "Verify wattage headroom and dedicated power connectors.",
      },
      {
        id: "mousepad",
        label: "Desk mat thickness",
        detail: "A clean desk pad looks great without delivering wattage.",
      },
      {
        id: "audio",
        label: "USB microphone gain",
        detail: "Audio levels do not feed the graphics card.",
      },
    ],
  },
  {
    id: "ram-compat",
    prompt: "Before buying new memory sticks, what do you check first?",
    context: "Not every memory kit fits every motherboard slot.",
    answerId: "ddr",
    explanation:
      "Motherboards support one specific DDR generation and a maximum rated speed and capacity.",
    choices: [
      {
        id: "ddr",
        label: "DDR generation and motherboard support",
        detail: "Confirm the memory generation and supported capacity.",
      },
      {
        id: "case-color",
        label: "Case color and fan count",
        detail: "Visual styling does not govern memory slot compatibility.",
      },
      {
        id: "monitor-res",
        label: "Monitor resolution",
        detail: "Display pixels do not select the motherboard memory slot.",
      },
    ],
  },
  {
    id: "graphics",
    prompt: "Which component does most real time rendering in modern 3D games?",
    context: "Think about the processor built specifically for parallel frame rendering.",
    answerId: "gpu",
    explanation:
      "The graphics card handles real time 3D rendering workloads while the CPU coordinates game logic and frame preparation.",
    choices: [
      {
        id: "gpu",
        label: "Graphics card (GPU)",
        detail: "Built to process shaders, textures, and 3D frames.",
      },
      {
        id: "ssd",
        label: "Solid state drive",
        detail: "Stores and streams assets into memory.",
      },
      {
        id: "psu-unit",
        label: "Power supply unit",
        detail: "Delivers clean electrical power to the board.",
      },
    ],
  },
  {
    id: "cooling",
    prompt: "CPU temperature climbs rapidly under load. What should you inspect first?",
    context: "Check the physical cooling contact before tweaking software curves.",
    answerId: "cooler",
    explanation:
      "A loose cooler mount, forgotten protective plastic film, or dried thermal paste stops heat from transferring away from the processor.",
    choices: [
      {
        id: "cooler",
        label: "Cooler mounting and thermal contact",
        detail: "Inspect mounting pressure, fan spin, and thermal paste.",
      },
      {
        id: "wallpaper",
        label: "Desktop wallpaper resolution",
        detail: "Wallpapers are not a thermal interface material.",
      },
      {
        id: "rgb-app",
        label: "Lighting control software",
        detail: "Changing LED colors to blue does not lower core temps.",
      },
    ],
  },
  {
    id: "case-fit",
    prompt: "Before ordering a compact PC case, what measurements matter most?",
    context: "Parts have to fit physically before the side panel closes.",
    answerId: "clearance",
    explanation:
      "Verify motherboard form factor, maximum graphics card length, CPU cooler height, and radiator clearance.",
    choices: [
      {
        id: "clearance",
        label: "Motherboard form factor and component clearance",
        detail: "Confirm board size, GPU length, and cooler height.",
      },
      {
        id: "ssd-brand",
        label: "Storage drive brand logo",
        detail: "Brand stickers do not change physical chassis dimensions.",
      },
      {
        id: "keycaps",
        label: "Keyboard keycap profile",
        detail: "Peripherals sit outside the PC enclosure.",
      },
    ],
  },
] as const;

export const kayjayRounds: readonly QuizRound[] = [
  {
    id: "tire-airflow",
    prompt: "A gaming PC is going inside a car tire. What has to be solved before the first power on?",
    context: "A wild custom enclosure still has to move heat away from the components.",
    answerId: "airflow",
    explanation:
      "A confined custom shell needs a deliberate intake and exhaust path, enough open mesh area, and load temperature checks. Sealing it traps heat.",
    choices: [
      {
        id: "sealed",
        label: "Seal every opening to keep dust out",
        detail: "A sealed rubber enclosure traps heat around the hardware.",
      },
      {
        id: "airflow",
        label: "Plan a clear intake and exhaust path",
        detail: "Give cool air a route in and hot air a route out.",
      },
      {
        id: "lighting",
        label: "Add extra RGB strips inside",
        detail: "Lighting adds heat without moving any air.",
      },
    ],
  },
  {
    id: "radiator-fit",
    prompt: "A 360 mm radiator is planned for a custom enclosure. What should you measure?",
    context: "The nominal fan size is only part of the real physical footprint.",
    answerId: "radiator-clearance",
    explanation:
      "Measure the total radiator thickness, fan stack, end tanks, fittings, and tube bend radius so the full assembly mounts without stress.",
    choices: [
      {
        id: "radiator-clearance",
        label: "Radiator, fan stack, mounting points, and tube clearance",
        detail: "Measure the complete assembly including end tanks and fans.",
      },
      {
        id: "radiator-length",
        label: "Only the fan diameter number",
        detail: "End tanks, fittings, and fan thickness add extra millimeters.",
      },
      {
        id: "rgb-headers",
        label: "The motherboard RGB header count",
        detail: "Header pins do not confirm physical radiator clearance.",
      },
    ],
  },
  {
    id: "gpu-clearance",
    prompt: "A thick three slot GPU must fit inside a narrow custom shell. What do you verify?",
    context: "A card can fit on paper and still collide with a panel or power cable.",
    answerId: "gpu-dimensions",
    explanation:
      "Check card length, slot thickness, bracket mounting, and safe bend room for the power cable so the connector is never strained.",
    choices: [
      {
        id: "outputs",
        label: "Only the display output ports",
        detail: "Rear video ports do not tell you internal clearance.",
      },
      {
        id: "gpu-dimensions",
        label: "Card length, thickness, slot space, and cable bend room",
        detail: "Verify the entire installed footprint including power cables.",
      },
      {
        id: "fan-count",
        label: "Only the number of case fans",
        detail: "Case fan count does not guarantee GPU slot clearance.",
      },
    ],
  },
  {
    id: "power-budget",
    prompt: "A flagship GPU is paired with a high draw CPU. How should the power supply be chosen?",
    context: "A cable plugging in is not proof that the unit can handle transient loads.",
    answerId: "quality-psu",
    explanation:
      "Account for peak system demand, transient spikes, native connector support, and reputable protection circuits.",
    choices: [
      {
        id: "big-number",
        label: "Pick the cheapest unit with a big wattage sticker",
        detail: "Sticker numbers alone say nothing about rail stability.",
      },
      {
        id: "reuse",
        label: "Reuse any old supply if the plug fits",
        detail: "Matching plugs do not guarantee safe current capacity.",
      },
      {
        id: "quality-psu",
        label: "Check total load, connectors, and PSU build quality",
        detail: "Capacity, cable rating, and protection circuits all matter.",
      },
    ],
  },
  {
    id: "board-mount",
    prompt: "A motherboard is going onto a custom metal plate. What must be installed first?",
    context: "Solder points under the board must never rest against bare metal.",
    answerId: "standoffs",
    explanation:
      "Install properly aligned motherboard standoffs so the rear solder joints stay safely clear of the conductive metal tray.",
    choices: [
      {
        id: "direct",
        label: "Bolt the board flat against the metal plate",
        detail: "Direct metal contact causes an immediate electrical short.",
      },
      {
        id: "standoffs",
        label: "Install the proper standoffs at the mounting holes",
        detail: "Standoffs provide safe clearance and grounding points.",
      },
      {
        id: "foam",
        label: "Stick double sided tape under the board",
        detail: "Tape traps heat and is not a structural board mount.",
      },
    ],
  },
  {
    id: "first-post",
    prompt: "Before sealing up a one off custom build, what is the smart first test?",
    context: "Catch wiring or boot faults while every connector is still easy to reach.",
    answerId: "bench-test",
    explanation:
      "Run a controlled test boot on a stable, non conductive surface to verify POST, display output, and cooler operation before final assembly.",
    choices: [
      {
        id: "sealed-first",
        label: "Bolt every panel shut before testing power",
        detail: "Closing the shell first makes simple wiring fixes painful.",
      },
      {
        id: "carpet",
        label: "Set the bare board on thick carpet and power on",
        detail: "Carpet builds static and blocks bottom airflow.",
      },
      {
        id: "bench-test",
        label: "POST test on a stable, non conductive bench surface",
        detail: "Confirm core hardware boots cleanly before final assembly.",
      },
    ],
  },
] as const;

export function getRoundsForCreator(slug: CreatorSlug): readonly QuizRound[] {
  return slug === "kayjayohpcs" ? kayjayRounds : gameRounds;
}

export type GameOutcome = "win" | "loss";

export function getGameOutcome(score: number, strikes: number): GameOutcome {
  return score >= 4 && strikes < 3 ? "win" : "loss";
}

// ============================================================================
// RUNNER GAME MECHANICS & CONSTANTS (No magic numbers)
// ============================================================================

export const RUNNER_CONSTANTS = {
  CANVAS_WIDTH_WIDE: 480,
  CANVAS_WIDTH_NARROW: 360,
  CANVAS_HEIGHT_WIDE: 272,
  CANVAS_HEIGHT_NARROW: 288,
  GROUND_OFFSET_BOTTOM: 48,
  PLAYER_X: 64,
  PLAYER_HITBOX_W: 16,
  PLAYER_HITBOX_H: 26,
  SPRITE_SCALE: 1.5,
  BASE_SPEED: 245,
  MAX_SPEED: 520,
  SPEED_RAMP_PER_SEC: 10.5,
  GRAVITY_HOLD: 1450,
  GRAVITY_RELEASE: 3250,
  GRAVITY_FAST_FALL: 4600,
  JUMP_VELOCITY: 535,
  HOLD_MAX_DURATION: 0.18,
  INPUT_BUFFER_WINDOW: 0.13,
  COYOTE_TIME_WINDOW: 0.09,
  NEAR_MISS_MARGIN: 16,
  NEAR_MISS_BONUS_METERS: 15,
  ZONE_LENGTH_METERS: 450,
  METERS_PER_PIXEL: 0.06,
} as const;

export type RunnerPaceId = "chill" | "arcade" | "overclock";

export type RunnerPaceSpec = {
  id: RunnerPaceId;
  label: string;
  keyHint: string;
  multiplier: number;
  detail: string;
};

export const RUNNER_PACES: Record<RunnerPaceId, RunnerPaceSpec> = {
  chill: {
    id: "chill",
    label: "CHILL",
    keyHint: "1",
    multiplier: 0.85,
    detail: "Steady studio cruise",
  },
  arcade: {
    id: "arcade",
    label: "ARCADE",
    keyHint: "2",
    multiplier: 1.2,
    detail: "Fast default runner pace",
  },
  overclock: {
    id: "overclock",
    label: "OVERCLOCK",
    keyHint: "3",
    multiplier: 1.52,
    detail: "Peak boost clock sprint",
  },
} as const;

export const RUNNER_PACE_ORDER: readonly RunnerPaceId[] = [
  "chill",
  "arcade",
  "overclock",
] as const;

export function getNormalizedSpawnBounds(
  effectiveSpeed: number,
  stageWidth: number,
  paceMultiplier: number,
): { minGap: number; maxGap: number; firstDelay: number } {
  const safeMult = Math.max(0.7, paceMultiplier);
  const rawMin =
    (1.14 - Math.max(0, effectiveSpeed - 220) / 480) / Math.sqrt(safeMult);
  const clampedBase = Math.max(0.42, Math.min(1.18, rawMin));
  // Keep reaction rhythm consistent across narrow touch (360px) and wide PC (480px) viewports
  const viewportFactor = stageWidth < 420 ? 1.04 : 0.94;
  const minGap = Number((clampedBase * viewportFactor).toFixed(3));
  const maxGap = Number(((clampedBase + 0.42) * viewportFactor).toFixed(3));
  const firstDelay = Number((0.46 / Math.sqrt(safeMult)).toFixed(3));
  return { minGap, maxGap, firstDelay };
}

export type ObstacleKind = {
  id: "ram" | "psu" | "gpu" | "fan" | "tower";
  label: string;
  w: number;
  h: number;
  cause: string;
};

export const OBSTACLE_KINDS: readonly ObstacleKind[] = [
  { id: "ram", label: "RAM STICK", w: 12, h: 26, cause: "Clipped a loose DDR5 memory stick." },
  { id: "psu", label: "PSU BRICK", w: 28, h: 22, cause: "Walked straight into a modular PSU brick." },
  { id: "gpu", label: "TRIPLE SLOT GPU", w: 38, h: 15, cause: "Tripped over a sagging triple fan GPU." },
  { id: "fan", label: "120MM CASE FAN", w: 16, h: 34, cause: "Ran face first into a high RPM case fan." },
  { id: "tower", label: "MINI ITX TOWER", w: 24, h: 30, cause: "Bonked a steel mini tower on the bench." },
] as const;

export const ANNOUNCER_LINES = {
  ready: [
    "Announcer: Bench is clear. Tap to hop, hold to clear tall fans.",
    "Announcer: Power supply switched on. Watch the loose RAM sticks.",
  ],
  start: [
    "Announcer: And they are off. Mind the modular cables.",
    "Announcer: Run is live. Thermal paste is fresh today.",
    "Announcer: Clearing the desk. Keep those frame times steady.",
  ],
  nearMiss: [
    "Announcer: Close shave over that hardware. Plus 15m style bonus.",
    "Announcer: Barely cleared the heatsink fins. Clean hop.",
    "Announcer: Millimeters to spare. The crowd approves.",
  ],
  milestone: [
    "Announcer: Boost clocks engaged. Pace is picking up.",
    "Announcer: Thermals holding steady. Fans spinning up.",
    "Announcer: Zero thermal throttling so far.",
    "Announcer: Bench numbers are looking sharp today.",
  ],
  zoneDay: "Announcer: Daylight shift on the workbench. Fresh coffee poured.",
  zoneSunset: "Announcer: Golden hour in the studio. Ambient lights warming up.",
  zoneNight: "Announcer: RGB night shift engaged. Full desk illumination.",
  gameOver: [
    "Announcer: Tough collision. Reset the bench and go again.",
    "Announcer: Hardware clearance check failed. Ready for another run.",
    "Announcer: That was a solid warm up pass. Run it back.",
  ],
} as const;

export type RunnerPhysicsState = {
  y: number;
  vy: number;
  onGround: boolean;
  holdTimer: number;
  holdingJump: boolean;
  fastFall: boolean;
  bufferTimer: number;
  coyoteTimer: number;
  squash: number;
  runPhase: number;
};

export function createInitialPhysicsState(): RunnerPhysicsState {
  return {
    y: 0,
    vy: 0,
    onGround: true,
    holdTimer: 0,
    holdingJump: false,
    fastFall: false,
    bufferTimer: 0,
    coyoteTimer: RUNNER_CONSTANTS.COYOTE_TIME_WINDOW,
    squash: 0,
    runPhase: 0,
  };
}

export function stepRunnerPhysics(
  state: RunnerPhysicsState,
  dt: number,
  speed: number,
): { next: RunnerPhysicsState; jumped: boolean; landed: boolean } {
  const s = { ...state };
  let jumped = false;
  let landed = false;

  s.bufferTimer = Math.max(0, s.bufferTimer - dt);
  if (s.onGround) {
    s.coyoteTimer = RUNNER_CONSTANTS.COYOTE_TIME_WINDOW;
  } else {
    s.coyoteTimer = Math.max(0, s.coyoteTimer - dt);
  }

  // Trigger jump if buffered and within coyote/ground window
  if (s.bufferTimer > 0 && (s.onGround || s.coyoteTimer > 0)) {
    s.vy = RUNNER_CONSTANTS.JUMP_VELOCITY;
    s.onGround = false;
    s.coyoteTimer = 0;
    s.bufferTimer = 0;
    s.holdTimer = RUNNER_CONSTANTS.HOLD_MAX_DURATION;
    s.squash = -0.25;
    jumped = true;
  }

  if (!s.onGround) {
    if (s.holdingJump && s.holdTimer > 0 && s.vy > 0 && !s.fastFall) {
      s.holdTimer = Math.max(0, s.holdTimer - dt);
      s.vy -= RUNNER_CONSTANTS.GRAVITY_HOLD * dt;
    } else if (s.fastFall) {
      s.vy -= RUNNER_CONSTANTS.GRAVITY_FAST_FALL * dt;
    } else {
      s.vy -= RUNNER_CONSTANTS.GRAVITY_RELEASE * dt;
    }

    s.y += s.vy * dt;
    if (s.y <= 0) {
      s.y = 0;
      s.vy = 0;
      s.onGround = true;
      s.fastFall = false;
      s.squash = 0.28;
      landed = true;
    }
  } else {
    s.runPhase += dt * (speed / 24);
  }

  // Exponentially relax squash back to 0
  s.squash = s.squash * Math.pow(0.001, dt);
  if (Math.abs(s.squash) < 0.01) s.squash = 0;

  return { next: s, jumped, landed };
}

export type ActiveObstacle = {
  x: number;
  w: number;
  h: number;
  kindIndex: number;
  passed: boolean;
  nearMissed: boolean;
};

export function checkCollision(
  playerY: number,
  obstacle: ActiveObstacle,
): boolean {
  const px = RUNNER_CONSTANTS.PLAYER_X + 4;
  const pw = RUNNER_CONSTANTS.PLAYER_HITBOX_W;
  const py = playerY;
  const ph = RUNNER_CONSTANTS.PLAYER_HITBOX_H;

  const ox = obstacle.x + 2;
  const ow = Math.max(4, obstacle.w - 4);
  const oh = Math.max(4, obstacle.h - 3);

  const overlapX = px < ox + ow && px + pw > ox;
  const overlapY = py < oh && py + ph > 0;
  return overlapX && overlapY;
}

export function checkNearMiss(
  playerY: number,
  obstacle: ActiveObstacle,
): boolean {
  if (obstacle.nearMissed) return false;
  const px = RUNNER_CONSTANTS.PLAYER_X + 4;
  const pw = RUNNER_CONSTANTS.PLAYER_HITBOX_W;
  const ox = obstacle.x;
  const ow = obstacle.w;
  const oh = obstacle.h;

  const overlapX = px < ox + ow && px + pw > ox;
  const clearance = playerY - oh;
  return overlapX && clearance >= 0 && clearance <= RUNNER_CONSTANTS.NEAR_MISS_MARGIN;
}

export function getZoneIndex(distanceMeters: number): 0 | 1 | 2 {
  const cycle = Math.floor(
    Math.max(0, distanceMeters) / RUNNER_CONSTANTS.ZONE_LENGTH_METERS,
  );
  return (cycle % 3) as 0 | 1 | 2;
}

function parseHexRgb(hexColor: string): [number, number, number] {
  const clean = hexColor.replace("#", "");
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = parseHexRgb(a);
  const [r2, g2, b2] = parseHexRgb(b);
  const k = Math.max(0, Math.min(1, t));
  const r = Math.round(r1 + (r2 - r1) * k);
  const g = Math.round(g1 + (g2 - g1) * k);
  const bl = Math.round(b1 + (b2 - b1) * k);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function getZonePalette(
  zones: readonly [WorldZonePalette, WorldZonePalette, WorldZonePalette],
  distanceMeters: number,
): WorldZonePalette {
  const pos = Math.max(0, distanceMeters) / RUNNER_CONSTANTS.ZONE_LENGTH_METERS;
  const idx = Math.floor(pos) % 3;
  const nextIdx = (idx + 1) % 3;
  const frac = pos - Math.floor(pos);
  const t = frac > 0.82 ? (frac - 0.82) / 0.18 : 0;
  const a = zones[idx];
  const b = zones[nextIdx];

  return {
    skyTop: mixHex(a.skyTop, b.skyTop, t),
    skyBand: mixHex(a.skyBand, b.skyBand, t),
    farProp: mixHex(a.farProp, b.farProp, t),
    midProp: mixHex(a.midProp, b.midProp, t),
    deskSurface: mixHex(a.deskSurface, b.deskSurface, t),
    deskEdge: mixHex(a.deskEdge, b.deskEdge, t),
    traceLine: mixHex(a.traceLine, b.traceLine, t),
    obstacleMain: mixHex(a.obstacleMain, b.obstacleMain, t),
    obstacleShade: mixHex(a.obstacleShade, b.obstacleShade, t),
    ledAccent: mixHex(a.ledAccent, b.ledAccent, t),
    starAlpha: a.starAlpha + (b.starAlpha - a.starAlpha) * t,
  };
}

export const BEST_SCORE_EVENT = "creator-arcade:runner-best";

export function getBestScoreKey(slug: CreatorSlug): string {
  return `creator-arcade:runner-best:${slug}`;
}

export function readBestScore(slug: CreatorSlug): number {
  if (typeof window === "undefined") return 0;
  try {
    const val = Number(window.localStorage.getItem(getBestScoreKey(slug)));
    return Number.isInteger(val) && val > 0 ? val : 0;
  } catch {
    return 0;
  }
}

export function writeBestScore(slug: CreatorSlug, score: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getBestScoreKey(slug), String(Math.floor(score)));
    window.dispatchEvent(new Event(BEST_SCORE_EVENT));
  } catch {
    // Ignore storage block in restricted privacy contexts
  }
}

export function getRunnerPaceKey(): string {
  return "creator-arcade:runner-pace";
}

export function readRunnerPace(): RunnerPaceId {
  if (typeof window === "undefined") return "arcade";
  try {
    const val = window.localStorage.getItem(getRunnerPaceKey());
    if (val === "chill" || val === "arcade" || val === "overclock") {
      return val;
    }
    return "arcade";
  } catch {
    return "arcade";
  }
}

export function writeRunnerPace(pace: RunnerPaceId): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getRunnerPaceKey(), pace);
  } catch {
    // Ignore storage block in restricted privacy contexts
  }
}

/**
 * Draws a shareable 600x340 score card onto a canvas with the creator's
 * 36x36 expressive pixel face portrait, run distance, personal best, pace,
 * and strict paper/ink/accent palette (zero gradients).
 */
export function renderScoreCardCanvas(
  canvas: HTMLCanvasElement,
  creator: CreatorProfile,
  distance: number,
  bestDistance: number,
  isNewBest: boolean,
  pace: RunnerPaceId = "arcade",
): void {
  const W = 600;
  const H = 340;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  // Solid ink outer background
  ctx.fillStyle = "#151914";
  ctx.fillRect(0, 0, W, H);

  // Accent top structural bar (solid, no gradient)
  ctx.fillStyle = creator.accentHex;
  ctx.fillRect(0, 0, W, 10);

  // Inner framing border
  ctx.strokeStyle = "rgba(242, 239, 231, 0.22)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 26, W - 40, H - 46);

  // Top metadata row
  ctx.fillStyle = creator.accentHex;
  ctx.font = '800 11px "SFMono-Regular", Consolas, monospace';
  ctx.fillText(`CREATOR ARCADE / ${creator.world.worldName}`, 40, 56);

  ctx.fillStyle = "#85897d";
  ctx.textAlign = "right";
  ctx.fillText(
    isNewBest ? "NEW PERSONAL RECORD" : `PACE: ${RUNNER_PACES[pace].label}`,
    W - 40,
    56,
  );
  ctx.textAlign = "left";

  // Divider line
  ctx.fillStyle = "rgba(242, 239, 231, 0.16)";
  ctx.fillRect(40, 70, W - 80, 1);

  // Avatar pedestal box on the left
  ctx.fillStyle = "#293029";
  ctx.fillRect(40, 92, 136, 168);
  ctx.strokeStyle = creator.accentHex;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 92, 136, 168);

  // Draw detailed 36x36 face portrait at 3x scale centered inside pedestal (108x108)
  drawCreatorFacePortrait(
    ctx,
    creator.pixelLook,
    { state: isNewBest ? "jump" : "idle", frame: 0 },
    54,
    122,
    3,
  );

  // Creator Name & Distance Hero Readout on the right
  ctx.fillStyle = "#f2efe7";
  ctx.font = '900 22px "Arial Black", Impact, sans-serif';
  ctx.fillText(creator.name.toUpperCase(), 200, 118);

  ctx.fillStyle = creator.accentHex;
  ctx.font = '900 74px "Arial Black", Impact, sans-serif';
  ctx.fillText(`${Math.floor(distance)}M`, 198, 194);

  // Best score & world subtitle
  ctx.fillStyle = "#e9e6dc";
  ctx.font = '800 13px "SFMono-Regular", Consolas, monospace';
  ctx.fillText(
    `PERSONAL BEST: ${String(Math.floor(bestDistance)).padStart(4, "0")}M  /  ${RUNNER_PACES[pace].label}`,
    200,
    228,
  );

  ctx.fillStyle = "#85897d";
  ctx.font = '700 11px "SFMono-Regular", Consolas, monospace';
  ctx.fillText(`WORLD: ${creator.world.deskSubtitle.toUpperCase()}`, 200, 252);

  // Footer strip
  ctx.fillStyle = "rgba(242, 239, 231, 0.16)";
  ctx.fillRect(40, 278, W - 80, 1);

  ctx.fillStyle = "#85897d";
  ctx.font = '700 10px "SFMono-Regular", Consolas, monospace';
  ctx.fillText("INDEPENDENT FAN PROJECT, NOT AFFILIATED", 40, 300);

  ctx.fillStyle = creator.accentHex;
  ctx.textAlign = "right";
  ctx.fillText(creator.handle.toUpperCase(), W - 40, 300);
  ctx.textAlign = "left";
}
