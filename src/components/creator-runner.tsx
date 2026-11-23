import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AppLink } from "@/components/app-link";
import type { CreatorProfile, WorldZonePalette } from "@/lib/creators";
import {
  ANNOUNCER_LINES,
  type ActiveObstacle,
  BEST_SCORE_EVENT,
  OBSTACLE_KINDS,
  RUNNER_CONSTANTS,
  RUNNER_PACES,
  RUNNER_PACE_ORDER,
  type RunnerPaceId,
  checkCollision,
  checkNearMiss,
  createInitialPhysicsState,
  getNormalizedSpawnBounds,
  getZoneIndex,
  getZonePalette,
  readBestScore,
  readRunnerPace,
  renderScoreCardCanvas,
  stepRunnerPhysics,
  writeBestScore,
  writeRunnerPace,
} from "@/lib/game";
import {
  type AvatarAnimState,
  drawCreatorPixelAvatar,
} from "@/lib/pixel-avatar";

export type RunnerPhase = "ready" | "running" | "over";

export type CreatorRunnerProps = {
  creator: CreatorProfile;
};

type PooledParticle = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

type FloaterText = {
  active: boolean;
  text: string;
  x: number;
  y: number;
  life: number;
};

type RunnerApi = {
  press: () => void;
  release: () => void;
  fastFall: (active: boolean) => void;
  toggleSound: () => void;
  togglePause: () => void;
  setPace: (nextPace: RunnerPaceId) => void;
};

const PARTICLE_POOL_SIZE = 28;
const FLOATER_POOL_SIZE = 6;

const STAR_COORDS = [
  { x: 28, y: 22, phase: 0.4 },
  { x: 74, y: 44, phase: 1.3 },
  { x: 122, y: 18, phase: 2.1 },
  { x: 168, y: 36, phase: 3.5 },
  { x: 214, y: 14, phase: 4.2 },
  { x: 266, y: 40, phase: 0.9 },
  { x: 312, y: 24, phase: 2.8 },
  { x: 358, y: 34, phase: 5.1 },
  { x: 412, y: 20, phase: 1.7 },
  { x: 454, y: 42, phase: 3.9 },
] as const;

const DESK_TRACES = [
  { x: 12, y: 14, len: 56, jog: 1 },
  { x: 94, y: 26, len: 72, jog: -1 },
  { x: 186, y: 18, len: 48, jog: 1 },
] as const;

function fillBox(
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

function drawCarterDeskProps(
  ctx: CanvasRenderingContext2D,
  scroll: number,
  groundY: number,
  pal: WorldZonePalette,
  accent: string,
) {
  const parallax = (scroll * 0.22) % 480;
  for (let tile = 0; tile < 2; tile += 1) {
    const baseX = Math.round(tile * 480 - parallax);

    // Prop 1: Dual Monitor Setup + Chaotic App Dock on Screen
    const monX = baseX + 34;
    const monY = groundY - 82;
    // Monitor stand & base
    fillBox(ctx, monX + 46, groundY - 22, 8, 22, pal.midProp);
    fillBox(ctx, monX + 30, groundY - 4, 40, 4, pal.midProp);
    // Left screen bezel
    fillBox(ctx, monX, monY, 52, 34, pal.midProp);
    fillBox(ctx, monX + 3, monY + 3, 46, 28, pal.deskSurface);
    // App dock bar & windows inside left screen
    fillBox(ctx, monX + 8, monY + 26, 36, 3, accent);
    fillBox(ctx, monX + 7, monY + 7, 18, 12, pal.farProp);
    fillBox(ctx, monX + 28, monY + 9, 16, 10, pal.farProp);
    // Right vertical coder/chat monitor
    fillBox(ctx, monX + 56, monY - 8, 28, 46, pal.midProp);
    fillBox(ctx, monX + 59, monY - 5, 22, 40, pal.deskSurface);
    fillBox(ctx, monX + 62, monY, 14, 3, accent);
    fillBox(ctx, monX + 62, monY + 6, 16, 2, pal.farProp);
    fillBox(ctx, monX + 62, monY + 11, 12, 2, pal.farProp);

    // Prop 2: Smart Glasses Stand (Meta Ray-Bans on pedestal)
    const glX = baseX + 168;
    const glY = groundY - 36;
    fillBox(ctx, glX + 10, groundY - 18, 6, 18, pal.farProp);
    fillBox(ctx, glX + 4, groundY - 3, 18, 3, pal.midProp);
    // Glasses frame silhouette
    fillBox(ctx, glX, glY, 26, 4, pal.midProp);
    fillBox(ctx, glX + 2, glY + 3, 9, 7, pal.midProp);
    fillBox(ctx, glX + 15, glY + 3, 9, 7, pal.midProp);
    // Corner camera LED dot on glasses
    fillBox(ctx, glX + 22, glY + 1, 2, 2, accent);

    // Prop 3: Podcast Boom Arm & Condenser Microphone
    const micX = baseX + 264;
    fillBox(ctx, micX, groundY - 70, 4, 70, pal.farProp);
    fillBox(ctx, micX + 4, groundY - 68, 38, 4, pal.midProp);
    fillBox(ctx, micX + 38, groundY - 64, 8, 18, pal.midProp);
    fillBox(ctx, micX + 40, groundY - 50, 4, 4, accent);

    // Prop 4: Studio Key Light / Warm Lamp Arch
    const lampX = baseX + 372;
    fillBox(ctx, lampX + 24, groundY - 76, 4, 76, pal.farProp);
    fillBox(ctx, lampX, groundY - 78, 32, 8, pal.midProp);
    fillBox(ctx, lampX + 4, groundY - 70, 22, 3, accent);
  }
}

function drawKayJayDeskProps(
  ctx: CanvasRenderingContext2D,
  scroll: number,
  groundY: number,
  pal: WorldZonePalette,
  accent: string,
  time: number,
) {
  const parallax = (scroll * 0.22) % 480;
  const fanSpin = Math.floor(time * 10) % 2 === 0;

  for (let tile = 0; tile < 2; tile += 1) {
    const baseX = Math.round(tile * 480 - parallax);

    // Prop 1: Iconic Car Tire Gaming PC Enclosure on Test Bench Riser
    const tireX = baseX + 32;
    const tireY = groundY - 74;
    // Bench riser legs
    fillBox(ctx, tireX + 8, groundY - 12, 6, 12, pal.midProp);
    fillBox(ctx, tireX + 50, groundY - 12, 6, 12, pal.midProp);
    fillBox(ctx, tireX + 4, groundY - 14, 56, 4, pal.midProp);
    // Outer tire tread silhouette (chunky octagonal wheel)
    fillBox(ctx, tireX + 12, tireY, 40, 60, pal.midProp);
    fillBox(ctx, tireX + 4, tireY + 10, 56, 40, pal.midProp);
    // Tire tread notches along top/sides
    for (let notch = 0; notch < 4; notch += 1) {
      fillBox(ctx, tireX + 14 + notch * 10, tireY - 2, 6, 3, pal.farProp);
      fillBox(ctx, tireX + 2, tireY + 12 + notch * 9, 3, 5, pal.farProp);
      fillBox(ctx, tireX + 59, tireY + 12 + notch * 9, 3, 5, pal.farProp);
    }
    // Inner PC chamber inside tire wheel well
    fillBox(ctx, tireX + 16, tireY + 14, 32, 32, pal.deskSurface);
    // Glowing motherboard & spinning fan hub inside the tire PC
    fillBox(ctx, tireX + 20, tireY + 18, 24, 24, pal.farProp);
    fillBox(ctx, tireX + 28, tireY + 26, 8, 8, accent);
    if (fanSpin) {
      fillBox(ctx, tireX + 31, tireY + 20, 2, 20, accent);
    } else {
      fillBox(ctx, tireX + 22, tireY + 29, 20, 2, accent);
    }

    // Prop 2: 360mm Triple Fan Radiator Assembly on Vertical Test Mount
    const radX = baseX + 166;
    const radY = groundY - 82;
    fillBox(ctx, radX, radY, 26, 82, pal.midProp);
    for (let f = 0; f < 3; f += 1) {
      const fy = radY + 5 + f * 25;
      fillBox(ctx, radX + 4, fy, 18, 20, pal.deskSurface);
      fillBox(ctx, radX + 11, fy + 8, 4, 4, accent);
    }

    // Prop 3: Custom Liquid Cooling Reservoir Cylinder & Tube Loop
    const resX = baseX + 262;
    const resY = groundY - 64;
    fillBox(ctx, resX, resY, 22, 64, pal.midProp);
    fillBox(ctx, resX + 4, resY + 8, 14, 46, pal.deskSurface);
    // Acid lime coolant column inside reservoir
    fillBox(ctx, resX + 6, resY + 20, 10, 32, accent);

    // Prop 4: Open Frame Parts Shelf & Thermal Probe Monitor
    const shelfX = baseX + 356;
    fillBox(ctx, shelfX, groundY - 56, 72, 4, pal.midProp);
    fillBox(ctx, shelfX, groundY - 30, 72, 4, pal.midProp);
    fillBox(ctx, shelfX + 4, groundY - 56, 4, 56, pal.farProp);
    fillBox(ctx, shelfX + 64, groundY - 56, 4, 56, pal.farProp);
    fillBox(ctx, shelfX + 14, groundY - 68, 20, 12, pal.midProp);
    fillBox(ctx, shelfX + 17, groundY - 65, 14, 6, accent);
  }
}

function drawDeskObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: ActiveObstacle,
  groundY: number,
  pal: WorldZonePalette,
  time: number,
) {
  const x = Math.round(obstacle.x);
  const y = Math.round(groundY - obstacle.h);
  const { w, h, kindIndex } = obstacle;

  if (kindIndex === 0) {
    // DDR5 RAM Stick upright
    fillBox(ctx, x, y, w, h, pal.obstacleMain);
    fillBox(ctx, x + 2, y + 4, w - 4, 6, pal.obstacleShade);
    fillBox(ctx, x + 2, y + 13, w - 4, 6, pal.obstacleShade);
    // Gold/LED contact pins at bottom
    for (let pin = 0; pin < 4; pin += 1) {
      fillBox(ctx, x + 2 + pin * 2, y + h - 3, 1, 3, pal.ledAccent);
    }
  } else if (kindIndex === 1) {
    // Modular PSU Brick
    fillBox(ctx, x, y, w, h, pal.obstacleMain);
    fillBox(ctx, x + 3, y + 3, 14, h - 6, pal.obstacleShade);
    fillBox(ctx, x + 9, y + 5, 2, h - 10, pal.ledAccent);
    fillBox(ctx, x + 5, y + Math.floor(h / 2) - 1, 10, 2, pal.ledAccent);
    fillBox(ctx, x + w - 7, y + 4, 4, 3, pal.ledAccent);
  } else if (kindIndex === 2) {
    // Triple Slot GPU
    fillBox(ctx, x, y, w, h, pal.obstacleMain);
    fillBox(ctx, x + 5, y + 3, 12, h - 6, pal.obstacleShade);
    fillBox(ctx, x + 21, y + 3, 12, h - 6, pal.obstacleShade);
    fillBox(ctx, x + 10, y + 6, 3, 3, pal.ledAccent);
    fillBox(ctx, x + 26, y + 6, 3, 3, pal.ledAccent);
    fillBox(ctx, x, y, 3, h, pal.ledAccent);
  } else if (kindIndex === 3) {
    // 120mm Case Fan
    fillBox(ctx, x, y, w, h, pal.obstacleMain);
    fillBox(ctx, x + 2, y + 2, w - 4, h - 4, pal.obstacleShade);
    const spin = Math.floor(time * 16) % 2 === 0;
    fillBox(
      ctx,
      x + Math.floor(w / 2) - 1,
      y + 5,
      2,
      h - 10,
      spin ? pal.ledAccent : pal.obstacleMain,
    );
    fillBox(
      ctx,
      x + 4,
      y + Math.floor(h / 2) - 1,
      w - 8,
      2,
      spin ? pal.obstacleMain : pal.ledAccent,
    );
  } else {
    // Mini ITX Tower
    fillBox(ctx, x, y, w, h, pal.obstacleMain);
    fillBox(ctx, x + 3, y + 3, w - 6, 15, pal.obstacleShade);
    fillBox(ctx, x + 5, y + 6, w - 10, 2, pal.ledAccent);
    fillBox(ctx, x + 5, y + 11, w - 14, 2, pal.ledAccent);
    fillBox(ctx, x + Math.floor(w / 2) - 2, y + h - 7, 4, 3, pal.ledAccent);
  }
}

function subscribeBest(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener(BEST_SCORE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(BEST_SCORE_EVENT, cb);
  };
}

function pickLine(lines: readonly string[]): string {
  return lines[Math.floor(Math.random() * lines.length)];
}

export function CreatorRunner({ creator }: CreatorRunnerProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreCardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarImgRef = useRef<HTMLImageElement | null>(null);
  const apiRef = useRef<RunnerApi | null>(null);

  const pointerStartYRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<RunnerPhase>("ready");
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [pace, setPace] = useState<RunnerPaceId>(() => readRunnerPace());
  const [score, setScore] = useState(0);
  const [zoneName, setZoneName] = useState<"DAYLIGHT" | "SUNSET" | "RGB NIGHT">(
    "DAYLIGHT",
  );
  const [ticker, setTicker] = useState<string>(ANNOUNCER_LINES.ready[0]);
  const [shareNote, setShareNote] = useState("");
  const [overSnapshot, setOverSnapshot] = useState<{
    score: number;
    best: number;
    cause: string;
    isNewBest: boolean;
    pace: RunnerPaceId;
  }>({
    score: 0,
    best: 0,
    cause: "",
    isNewBest: false,
    pace: readRunnerPace(),
  });

  const [viewSize, setViewSize] = useState<{ w: number; h: number }>({
    w: RUNNER_CONSTANTS.CANVAS_WIDTH_WIDE,
    h: RUNNER_CONSTANTS.CANVAS_HEIGHT_WIDE,
  });

  const best = useSyncExternalStore(
    subscribeBest,
    () => readBestScore(creator.slug),
    () => 0,
  );

  // Sync optional approved avatarSrc image if present
  useEffect(() => {
    if (!creator.avatarSrc) {
      avatarImgRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = creator.avatarSrc;
    img.onload = () => {
      avatarImgRef.current = img;
    };
  }, [creator.avatarSrc]);

  // Sync body dataset state for automated verification & game shell contract
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (phase === "ready") {
      document.body.dataset.state = "title";
    } else if (phase === "running") {
      document.body.dataset.state = paused ? "paused" : "playing";
    } else {
      document.body.dataset.state = "gameover";
    }
  }, [phase, paused]);

  // Render shareable scorecard canvas whenever game ends
  useEffect(() => {
    if (phase !== "over" || !scoreCardCanvasRef.current) return;
    renderScoreCardCanvas(
      scoreCardCanvasRef.current,
      creator,
      overSnapshot.score,
      overSnapshot.best,
      overSnapshot.isNewBest,
      overSnapshot.pace,
    );
  }, [phase, creator, overSnapshot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let audioCtx: AudioContext | null = null;

    // Pre-allocated object pools (Zero GC in requestAnimationFrame)
    const particles: PooledParticle[] = Array.from(
      { length: PARTICLE_POOL_SIZE },
      () => ({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1,
        size: 2,
        color: creator.accentHex,
      }),
    );

    const floaters: FloaterText[] = Array.from(
      { length: FLOATER_POOL_SIZE },
      () => ({
        active: false,
        text: "",
        x: 0,
        y: 0,
        life: 0,
      }),
    );

    const initialPace = readRunnerPace();
    const initialMult = RUNNER_PACES[initialPace].multiplier;

    const sim = {
      W: RUNNER_CONSTANTS.CANVAS_WIDTH_WIDE as number,
      H: RUNNER_CONSTANTS.CANVAS_HEIGHT_WIDE as number,
      phase: "ready" as RunnerPhase,
      paused: false,
      sound: false,
      paceId: initialPace as RunnerPaceId,
      paceMultiplier: initialMult as number,
      time: 0,
      scroll: 0,
      speed: (RUNNER_CONSTANTS.BASE_SPEED * initialMult) as number,
      distance: 0,
      bonusMeters: 0,
      nextMilestone: 150,
      zoneIdx: 0 as 0 | 1 | 2,
      spawnCooldown: 0.45,
      shake: 0,
      flash: 0,
      blinkTimer: 2.2,
      blinkDuration: 0,
      physics: createInitialPhysicsState(),
      obstacles: [] as ActiveObstacle[],
      best: readBestScore(creator.slug),
    };

    function playTone(
      freq: number,
      duration: number,
      type: OscillatorType,
      gainVal = 0.04,
      slideTo?: number,
    ) {
      if (!sim.sound) return;
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!audioCtx) audioCtx = new Ctx();
        if (audioCtx.state === "suspended") void audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
        }
        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration);
      } catch {
        // Web Audio not permitted yet
      }
    }

    function spawnParticles(
      x: number,
      y: number,
      count: number,
      color: string,
      spread = 110,
    ) {
      if (reducedMotion) return;
      let spawned = 0;
      for (let i = 0; i < particles.length && spawned < count; i += 1) {
        const p = particles[i];
        if (!p.active) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 25 + Math.random() * spread;
          p.active = true;
          p.x = x;
          p.y = y;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed - 35;
          p.life = 0.25 + Math.random() * 0.22;
          p.maxLife = p.life;
          p.size = Math.random() > 0.5 ? 3 : 2;
          p.color = color;
          spawned += 1;
        }
      }
    }

    function spawnFloater(text: string, x: number, y: number) {
      for (const f of floaters) {
        if (!f.active) {
          f.active = true;
          f.text = text;
          f.x = x;
          f.y = y;
          f.life = 0.85;
          return;
        }
      }
    }

    function setPauseState(nextPaused: boolean) {
      if (sim.phase !== "running" || sim.paused === nextPaused) return;
      sim.paused = nextPaused;
      setPaused(nextPaused);
    }

    function startRun() {
      const mult = sim.paceMultiplier;
      const bounds = getNormalizedSpawnBounds(
        RUNNER_CONSTANTS.BASE_SPEED * mult,
        sim.W,
        mult,
      );
      sim.phase = "running";
      sim.paused = false;
      sim.time = 0;
      sim.scroll = 0;
      sim.speed = RUNNER_CONSTANTS.BASE_SPEED * mult;
      sim.distance = 0;
      sim.bonusMeters = 0;
      sim.nextMilestone = 150;
      sim.zoneIdx = 0;
      sim.spawnCooldown = bounds.firstDelay;
      sim.shake = 0;
      sim.flash = 0;
      sim.physics = createInitialPhysicsState();
      sim.obstacles.length = 0;
      for (const p of particles) p.active = false;
      for (const f of floaters) f.active = false;

      setPhase("running");
      setPaused(false);
      setScore(0);
      setZoneName("DAYLIGHT");
      setShareNote("");
      setTicker(pickLine(ANNOUNCER_LINES.start));
    }

    function pressJump() {
      if (sim.phase === "ready" || sim.phase === "over") {
        startRun();
      }
      if (sim.paused) {
        setPauseState(false);
        return;
      }
      sim.physics.holdingJump = true;
      sim.physics.bufferTimer = RUNNER_CONSTANTS.INPUT_BUFFER_WINDOW;
    }

    function releaseJump() {
      sim.physics.holdingJump = false;
    }

    function updateSim(dt: number) {
      sim.time += dt;
      sim.shake = Math.max(0, sim.shake - dt * 28);
      sim.flash = Math.max(0, sim.flash - dt * 2.8);

      // Blink cycle
      sim.blinkTimer -= dt;
      if (sim.blinkTimer <= 0) {
        sim.blinkDuration = 0.14;
        sim.blinkTimer = 2.4 + Math.random() * 2.2;
      }
      if (sim.blinkDuration > 0) {
        sim.blinkDuration = Math.max(0, sim.blinkDuration - dt);
      }

      const groundY = sim.H - RUNNER_CONSTANTS.GROUND_OFFSET_BOTTOM;

      // Update pooled particles & floaters even on game over flash
      for (const p of particles) {
        if (!p.active) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 380 * dt;
        p.life -= dt;
        if (p.life <= 0) p.active = false;
      }
      for (const f of floaters) {
        if (!f.active) continue;
        f.y -= 24 * dt;
        f.life -= dt;
        if (f.life <= 0) f.active = false;
      }

      if (sim.phase !== "running" || sim.paused) return;

      const mult = sim.paceMultiplier;
      sim.speed = Math.min(
        RUNNER_CONSTANTS.MAX_SPEED * mult,
        sim.speed + dt * RUNNER_CONSTANTS.SPEED_RAMP_PER_SEC * mult,
      );
      const dx = sim.speed * dt;
      sim.scroll += dx;

      // Step physics
      const physStep = stepRunnerPhysics(sim.physics, dt, sim.speed);
      sim.physics = physStep.next;

      if (physStep.jumped) {
        spawnParticles(
          RUNNER_CONSTANTS.PLAYER_X + 12,
          groundY - 2,
          7,
          creator.accentHex,
          85,
        );
        playTone(340, 0.09, "square", 0.04, 580);
      } else if (physStep.landed) {
        spawnParticles(
          RUNNER_CONSTANTS.PLAYER_X + 12,
          groundY - 2,
          5,
          "#f2efe7",
          65,
        );
        playTone(150, 0.04, "triangle", 0.03, 95);
      }

      // Spawn hardware obstacles normalized to both mobile (360px) and desktop (480px) canvas widths
      sim.spawnCooldown -= dt;
      if (sim.spawnCooldown <= 0) {
        const kindIndex = Math.floor(Math.random() * OBSTACLE_KINDS.length);
        const spec = OBSTACLE_KINDS[kindIndex];
        sim.obstacles.push({
          x: sim.W + 24,
          w: spec.w,
          h: spec.h,
          kindIndex,
          passed: false,
          nearMissed: false,
        });
        const bounds = getNormalizedSpawnBounds(sim.speed, sim.W, mult);
        sim.spawnCooldown =
          bounds.minGap + Math.random() * (bounds.maxGap - bounds.minGap);
      }

      // Advance obstacles & check near-miss / collision
      for (let i = sim.obstacles.length - 1; i >= 0; i -= 1) {
        const obs = sim.obstacles[i];
        obs.x -= dx;

        if (checkCollision(sim.physics.y, obs)) {
          sim.phase = "over";
          if (!reducedMotion) {
            sim.shake = 9;
            sim.flash = 0.85;
          }
          spawnParticles(
            RUNNER_CONSTANTS.PLAYER_X + 14,
            groundY - sim.physics.y - 14,
            18,
            creator.accentHex,
            165,
          );
          playTone(170, 0.24, "sawtooth", 0.06, 58);

          const finalMeters = Math.floor(sim.distance);
          const isNewBest = finalMeters > sim.best;
          if (isNewBest) {
            sim.best = finalMeters;
            writeBestScore(creator.slug, finalMeters);
          }

          const kindSpec = OBSTACLE_KINDS[obs.kindIndex];
          setScore(finalMeters);
          setOverSnapshot({
            score: finalMeters,
            best: Math.max(sim.best, finalMeters),
            cause: kindSpec.cause,
            isNewBest,
            pace: sim.paceId,
          });
          setTicker(pickLine(ANNOUNCER_LINES.gameOver));
          setPhase("over");
          return;
        }

        if (!obs.nearMissed && !sim.physics.onGround && checkNearMiss(sim.physics.y, obs)) {
          obs.nearMissed = true;
          sim.bonusMeters += RUNNER_CONSTANTS.NEAR_MISS_BONUS_METERS;
          spawnFloater(
            `+${RUNNER_CONSTANTS.NEAR_MISS_BONUS_METERS}M CLOSE`,
            RUNNER_CONSTANTS.PLAYER_X,
            groundY - sim.physics.y - 42,
          );
          spawnParticles(
            RUNNER_CONSTANTS.PLAYER_X + 12,
            groundY - sim.physics.y - 6,
            6,
            "#d9ff70",
            70,
          );
          playTone(740, 0.08, "sine", 0.035, 980);
          setTicker(pickLine(ANNOUNCER_LINES.nearMiss));
        }

        if (!obs.passed && obs.x + obs.w < RUNNER_CONSTANTS.PLAYER_X) {
          obs.passed = true;
        }

        if (obs.x + obs.w < -40) {
          sim.obstacles.splice(i, 1);
        }
      }

      // Update distance & zone shifts (Day -> Sunset -> RGB Night)
      const nextDist =
        sim.scroll * RUNNER_CONSTANTS.METERS_PER_PIXEL + sim.bonusMeters;
      if (Math.floor(nextDist) !== Math.floor(sim.distance)) {
        setScore(Math.floor(nextDist));
      }
      sim.distance = nextDist;

      if (sim.distance >= sim.nextMilestone) {
        sim.nextMilestone += 150;
        setTicker(pickLine(ANNOUNCER_LINES.milestone));
        playTone(520, 0.1, "triangle", 0.04, 860);
      }

      const currentZone = getZoneIndex(sim.distance);
      if (currentZone !== sim.zoneIdx) {
        sim.zoneIdx = currentZone;
        if (currentZone === 0) {
          setZoneName("DAYLIGHT");
          setTicker(ANNOUNCER_LINES.zoneDay);
        } else if (currentZone === 1) {
          setZoneName("SUNSET");
          setTicker(ANNOUNCER_LINES.zoneSunset);
        } else {
          setZoneName("RGB NIGHT");
          setTicker(ANNOUNCER_LINES.zoneNight);
        }
      }
    }

    function drawSim() {
      const H = sim.H;
      const W = sim.W;
      const groundY = H - RUNNER_CONSTANTS.GROUND_OFFSET_BOTTOM;
      const pal = getZonePalette(creator.world.zones, sim.distance);

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      if (sim.shake > 0 && !reducedMotion) {
        ctx.translate(
          Math.round((Math.random() - 0.5) * sim.shake),
          Math.round((Math.random() - 0.5) * sim.shake),
        );
      }

      // 1. Solid stepped sky backdrop (No gradients per strict design rule)
      fillBox(ctx, 0, 0, W, Math.floor(groundY * 0.56), pal.skyTop);
      fillBox(
        ctx,
        0,
        Math.floor(groundY * 0.56),
        W,
        groundY - Math.floor(groundY * 0.56),
        pal.skyBand,
      );

      // 2. Stars in Sunset / RGB Night zones
      if (pal.starAlpha > 0.05) {
        ctx.fillStyle = "#f2efe7";
        for (const st of STAR_COORDS) {
          if (st.x < W) {
            const twinkle =
              0.4 + 0.6 * Math.sin(sim.time * 2.2 + st.phase);
            ctx.globalAlpha = pal.starAlpha * twinkle;
            ctx.fillRect(st.x, st.y, 2, 2);
          }
        }
        ctx.globalAlpha = 1;
      }

      // 3. Creator-specific Desk World Background Props
      if (creator.slug === "carterpcs") {
        drawCarterDeskProps(ctx, sim.scroll, groundY, pal, creator.accentHex);
      } else {
        drawKayJayDeskProps(
          ctx,
          sim.scroll,
          groundY,
          pal,
          creator.accentHex,
          sim.time,
        );
      }

      // 4. PC Desk Surface & Motherboard PCB Traces
      fillBox(ctx, 0, groundY, W, H - groundY + 12, pal.deskSurface);
      fillBox(ctx, 0, groundY, W, 3, pal.deskEdge);

      const traceOffset = Math.round(sim.scroll % 220);
      ctx.globalAlpha = 0.55;
      for (let tile = -1; tile < 4; tile += 1) {
        for (const tr of DESK_TRACES) {
          const tx = tr.x + tile * 220 - traceOffset;
          const ty = groundY + 10 + tr.y;
          fillBox(ctx, tx, ty, tr.len, 2, pal.traceLine);
          fillBox(
            ctx,
            tx + tr.len,
            ty + (tr.jog > 0 ? 0 : -8),
            2,
            10,
            pal.traceLine,
          );
          fillBox(ctx, tx - 2, ty - 2, 5, 5, pal.traceLine);
        }
      }
      ctx.globalAlpha = 1;

      // 5. Hardware Obstacles (RAM, PSU, GPU, Fans, Mini Tower)
      for (const obs of sim.obstacles) {
        drawDeskObstacle(ctx, obs, groundY, pal, sim.time);
      }

      // 6. Creator 24x32 Pixel Avatar (idle, blink, 6-frame run, jump, hit)
      const scale = RUNNER_CONSTANTS.SPRITE_SCALE;
      const drawW = 24 * scale;
      const drawH = 32 * scale;
      const avatarX = RUNNER_CONSTANTS.PLAYER_X - 4;
      const avatarY = Math.round(groundY - drawH - sim.physics.y);

      let animState: AvatarAnimState = "idle";
      let animFrame = 0;

      if (sim.phase === "over") {
        animState = "hit";
      } else if (!sim.physics.onGround) {
        animState = "jump";
      } else if (sim.phase === "running") {
        animState = "run";
        animFrame = Math.floor(sim.physics.runPhase) % 6;
      } else if (sim.blinkDuration > 0) {
        animState = "blink";
      } else {
        animState = "idle";
        animFrame = Math.floor(sim.time * 2) % 2;
      }

      if (avatarImgRef.current) {
        ctx.drawImage(avatarImgRef.current, avatarX, avatarY, drawW, drawH);
      } else {
        drawCreatorPixelAvatar(
          ctx,
          creator.pixelLook,
          { state: animState, frame: animFrame },
          avatarX,
          avatarY,
          scale,
        );
      }

      // 7. Particles & Near-Miss Floaters
      for (const p of particles) {
        if (!p.active) continue;
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        fillBox(ctx, p.x, p.y, p.size, p.size, p.color);
      }
      ctx.globalAlpha = 1;

      ctx.font = '800 9px "SFMono-Regular", Consolas, monospace';
      for (const f of floaters) {
        if (!f.active) continue;
        ctx.globalAlpha = Math.min(1, f.life * 1.8);
        ctx.fillStyle = pal.ledAccent;
        ctx.fillText(f.text, Math.round(f.x), Math.round(f.y));
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      if (sim.flash > 0 && !reducedMotion) {
        ctx.fillStyle = `rgba(242, 239, 231, ${sim.flash * 0.35})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    const handleResize = (containerWidth: number) => {
      const isNarrow = containerWidth < 520;
      const w = isNarrow
        ? RUNNER_CONSTANTS.CANVAS_WIDTH_NARROW
        : RUNNER_CONSTANTS.CANVAS_WIDTH_WIDE;
      const h = isNarrow
        ? RUNNER_CONSTANTS.CANVAS_HEIGHT_NARROW
        : RUNNER_CONSTANTS.CANVAS_HEIGHT_WIDE;
      if (w !== sim.W || h !== sim.H) {
        sim.W = w;
        sim.H = h;
        canvas.width = w;
        canvas.height = h;
        setViewSize({ w, h });
      }
    };

    canvas.width = sim.W;
    canvas.height = sim.H;
    handleResize(stage.getBoundingClientRect().width || 480);

    const resizer = new ResizeObserver((entries) => {
      if (entries[0]) handleResize(entries[0].contentRect.width);
    });
    resizer.observe(stage);

    const intersectionWatcher = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].intersectionRatio < 0.3) {
          setPauseState(true);
        }
      },
      { threshold: [0, 0.3, 1] },
    );
    intersectionWatcher.observe(stage);

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const targetTag = target?.tagName;
      if (targetTag === "INPUT" || targetTag === "TEXTAREA") return;
      if (document.querySelector(".letter-backdrop")) return;

      const isInsideQuiz = Boolean(target?.closest(".bench-quiz-wrap"));
      if (isInsideQuiz && sim.phase !== "running") return;

      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (!e.repeat) pressJump();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        if (sim.phase === "running") {
          e.preventDefault();
          sim.physics.fastFall = true;
        }
      } else if (e.code === "Enter" && sim.phase !== "running" && !isInsideQuiz) {
        if (targetTag !== "A" && targetTag !== "BUTTON") {
          e.preventDefault();
          pressJump();
        }
      } else if ((e.code === "KeyP" || e.code === "Escape") && sim.phase === "running") {
        e.preventDefault();
        setPauseState(!sim.paused);
      } else if (
        !isInsideQuiz &&
        (e.code === "Digit1" || e.code === "Digit2" || e.code === "Digit3")
      ) {
        const nextPace: RunnerPaceId =
          e.code === "Digit1"
            ? "chill"
            : e.code === "Digit2"
              ? "arcade"
              : "overclock";
        applyPace(nextPace);
      }
    };

    function applyPace(nextPace: RunnerPaceId) {
      const prevMult = sim.paceMultiplier;
      const nextMult = RUNNER_PACES[nextPace].multiplier;
      sim.paceId = nextPace;
      sim.paceMultiplier = nextMult;
      sim.speed = Math.min(
        RUNNER_CONSTANTS.MAX_SPEED * nextMult,
        (sim.speed / prevMult) * nextMult,
      );
      writeRunnerPace(nextPace);
      setPace(nextPace);
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        releaseJump();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        sim.physics.fastFall = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        sim.physics.holdingJump = false;
        sim.physics.fastFall = false;
        setPauseState(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onVisibilityChange);

    apiRef.current = {
      press: pressJump,
      release: releaseJump,
      fastFall: (active: boolean) => {
        if (sim.phase === "running") {
          sim.physics.fastFall = active;
          if (active) sim.physics.holdingJump = false;
        }
      },
      toggleSound: () => {
        sim.sound = !sim.sound;
        setSound(sim.sound);
        if (sim.sound) playTone(520, 0.09, "square", 0.04, 780);
      },
      togglePause: () => {
        setPauseState(!sim.paused);
      },
      setPace: applyPace,
    };

    // Check if ?autostart=1 is present
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("autostart") === "1"
    ) {
      startRun();
    }

    let rafId = 0;
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.035, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      updateSim(dt);
      drawSim();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      resizer.disconnect();
      intersectionWatcher.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      apiRef.current = null;
    };
  }, [creator]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    e.preventDefault();
    pointerStartYRef.current = e.clientY;
    stageRef.current?.focus();
    apiRef.current?.press();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartYRef.current === null) return;
    if (e.clientY - pointerStartYRef.current > 28) {
      apiRef.current?.fastFall(true);
    }
  };

  const onPointerUp = () => {
    pointerStartYRef.current = null;
    apiRef.current?.fastFall(false);
    apiRef.current?.release();
  };

  async function handleShareScoreCard() {
    const canvas = scoreCardCanvasRef.current;
    const shareText = `I ran ${overSnapshot.score}m as ${creator.name} in CREATOR ARCADE. Can you beat that distance?`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/png"),
        );
        if (blob) {
          const file = new File(
            [blob],
            `${creator.slug}_scorecard_${overSnapshot.score}m.png`,
            { type: "image/png" },
          );
          if (
            typeof navigator !== "undefined" &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            await navigator.share({
              title: "CREATOR ARCADE",
              text: shareText,
              files: [file],
            });
            setShareNote("Score card shared.");
            return;
          }
          // Download score card PNG directly
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = `${creator.slug}_scorecard_${overSnapshot.score}m.png`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(objectUrl);
          setShareNote("Score card image downloaded.");
          return;
        }
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setShareNote("Score summary copied to clipboard.");
      }
    } catch {
      setShareNote("Score card ready to save.");
    }
  }

  return (
    <section
      className={`runner runner-${creator.variant}`}
      aria-label={`${creator.name} runner game`}
    >
      {/* Top Runner Telemetry Bar */}
      <div className="runner-bar">
        <span className="runner-bar-title">
          {creator.world.worldName} / {zoneName}
        </span>
        <span className="runner-hi">
          BEST {String(best).padStart(5, "0")}M
        </span>
        <span className="runner-score" aria-label="Distance in metres">
          {String(score).padStart(5, "0")}M
        </span>
        <button
          type="button"
          className="runner-sound"
          aria-pressed={sound}
          onClick={() => apiRef.current?.toggleSound()}
        >
          SOUND {sound ? "ON" : "OFF"}
        </button>
      </div>

      {/* Adjustable Runner Pace Selector (Mobile Touch + Desktop Keys 1/2/3) */}
      <div
        className="runner-pace-row"
        role="group"
        aria-label="Runner pace speed"
      >
        <span className="runner-pace-label">PACE</span>
        <div className="runner-pace-buttons">
          {RUNNER_PACE_ORDER.map((paceId) => {
            const spec = RUNNER_PACES[paceId];
            const active = pace === paceId;
            return (
              <button
                key={paceId}
                type="button"
                className="runner-pace-btn"
                aria-pressed={active}
                title={`${spec.detail} (Key ${spec.keyHint})`}
                onClick={() => apiRef.current?.setPace(paceId)}
              >
                {spec.label}
              </button>
            );
          })}
        </div>
        <span className="runner-pace-detail">{RUNNER_PACES[pace].detail}</span>
      </div>

      {/* Main Pixel Runner Canvas Viewport */}
      <div className="runner-stage-band">
        <div
          ref={stageRef}
          className="runner-stage"
          style={{ aspectRatio: `${viewSize.w} / ${viewSize.h}` }}
          tabIndex={0}
          role="application"
          aria-label={`${creator.name} runner game. Press space, tap or click to jump.`}
          data-phase={phase}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <canvas ref={canvasRef} className="runner-canvas" />

          {phase === "ready" && (
            <div className="runner-overlay">
              <p className="runner-kicker">{creator.world.worldName}</p>
              <h2 className="runner-title">
                Clear the <span>desk.</span>
              </h2>
              <p className="runner-hint">
                Tap to hop, hold to go higher. Hurdle RAM sticks, PSU bricks,
                triple slot GPUs, and case fans.
              </p>
              <button
                type="button"
                data-start="true"
                className="runner-tap-btn"
                onClick={() => {
                  stageRef.current?.focus();
                  apiRef.current?.press();
                  apiRef.current?.release();
                }}
              >
                TAP OR PRESS SPACE TO RUN
              </button>
            </div>
          )}

          {paused && phase === "running" && (
            <div className="runner-overlay">
              <p className="runner-kicker">BENCH PAUSED</p>
              <h2 className="runner-title">
                Catch your <span>breath.</span>
              </h2>
              <button
                type="button"
                className="runner-tap-btn"
                onClick={() => apiRef.current?.togglePause()}
              >
                RESUME RUN
              </button>
            </div>
          )}

          {phase === "over" && (
            <div className="runner-overlay runner-overlay-over">
              <div className="runner-over-head">
                <p className="runner-kicker">
                  {overSnapshot.isNewBest ? "NEW PERSONAL BEST" : "RUN OVER"}
                </p>
                <p className="runner-title">
                  {overSnapshot.score}
                  <span>m</span>
                </p>
                <p className="runner-hint">{overSnapshot.cause}</p>
              </div>

              <div
                className="runner-over-cta-row"
                role="group"
                aria-label="Game over actions"
              >
                <button
                  type="button"
                  data-start="true"
                  className="button button-primary runner-primary-cta"
                  onClick={() => {
                    stageRef.current?.focus();
                    apiRef.current?.press();
                    apiRef.current?.release();
                  }}
                >
                  Run again <span aria-hidden="true">→</span>
                </button>
                <AppLink
                  className="button button-secondary runner-secondary-cta"
                  href="/support"
                >
                  Laptop support <span aria-hidden="true">↗</span>
                </AppLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dock: Neutral Announcer Ticker + Shareable Score Card */}
      <div className="runner-dock">
        <p className="runner-ticker" aria-live="polite">
          <span>ANNOUNCER</span>
          {ticker.replace(/^Announcer:\s*/i, "")}
        </p>

        {phase === "over" ? (
          <div className="runner-gameover-sheet">
            <div className="scorecard-wrap">
              <div className="scorecard-head">
                <span>SHAREABLE SCORE CARD</span>
                <button
                  type="button"
                  className="scorecard-download-btn"
                  onClick={handleShareScoreCard}
                >
                  Save score card image <span aria-hidden="true">↗</span>
                </button>
              </div>
              <canvas
                ref={scoreCardCanvasRef}
                data-testid="scorecard-canvas"
                className="scorecard-canvas"
                aria-label={`${creator.name} score card showing ${overSnapshot.score} meters`}
              />
              {shareNote && (
                <p className="runner-note" aria-live="polite">
                  {shareNote}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="runner-help">
            <span>TAP OR SPACE: HOP</span>
            <span>HOLD: JUMP HIGHER</span>
            <span>SWIPE OR DOWN: FAST DROP</span>
            <span>KEYS 1, 2, 3: PACE</span>
          </div>
        )}
      </div>
    </section>
  );
}
