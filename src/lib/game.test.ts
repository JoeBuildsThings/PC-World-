import test from "node:test";
import assert from "node:assert/strict";
import {
  ANNOUNCER_LINES,
  OBSTACLE_KINDS,
  RUNNER_CONSTANTS,
  RUNNER_PACES,
  RUNNER_PACE_ORDER,
  checkCollision,
  checkNearMiss,
  createInitialPhysicsState,
  gameRounds,
  getGameOutcome,
  getNormalizedSpawnBounds,
  getRoundsForCreator,
  getZoneIndex,
  kayjayRounds,
  stepRunnerPhysics,
} from "./game";
import { creatorProfiles, creatorRoster } from "./creators";
import {
  AVATAR_HEIGHT,
  AVATAR_WIDTH,
  PORTRAIT_SIZE,
  sampleAvatarSignature,
} from "./pixel-avatar";
import {
  findCopyViolations,
  getRouteMeta,
  navigationItems,
  researchBrief,
  routeMeta,
  siteConfig,
} from "./site";
import { homeHeroCopy } from "../views/home-view";
import {
  builderContactEmail,
  builderTiktokHandle,
  builderTiktokName,
  builderTiktokUrl,
  supportChecks,
  supportLetterParagraphs,
  supportProofProjects,
  supportTargetSpecs,
} from "../views/support-view";
import { hireCapabilities, hireProcess, hireServices } from "../views/hire-view";

test("every route has a unique document title, description, and absolute share card URL", () => {
  assert.equal(siteConfig.siteUrl.startsWith("https://"), true);
  assert.equal(siteConfig.ogImageUrl, `${siteConfig.siteUrl}/og-card.png`);

  const requiredPaths = [
    "/",
    "/play",
    "/play/carterpcs",
    "/play/kayjayohpcs",
    "/support",
    "/hire",
  ];
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const p of requiredPaths) {
    const meta = getRouteMeta(p);
    assert.equal(meta.path, p);
    assert.equal(meta.title.length > 10, true);
    assert.equal(meta.description.length > 30, true);
    titles.add(meta.title);
    descriptions.add(meta.description);
  }

  assert.equal(titles.size, requiredPaths.length);
  assert.equal(descriptions.size, requiredPaths.length);
});

test("creator roster has accurate public profiles, optional avatarSrc support, and distinct worlds", () => {
  assert.equal(creatorRoster.length, 2);
  assert.deepEqual(
    creatorRoster.map((c) => c.slug),
    ["carterpcs", "kayjayohpcs"],
  );
  assert.equal(creatorProfiles.carterpcs.pixelLook.beard, false);
  assert.equal(creatorProfiles.kayjayohpcs.pixelLook.beard, true);
  assert.equal("avatarSrc" in creatorProfiles.carterpcs, true);
  assert.equal("avatarSrc" in creatorProfiles.kayjayohpcs, true);
  assert.notEqual(
    creatorProfiles.carterpcs.world.worldName,
    creatorProfiles.kayjayohpcs.world.worldName,
  );
});

test("pixel avatar supports idle, blink, 6 run frames, jump, and hit states at 24x32 plus 36x36 portrait", () => {
  assert.equal(AVATAR_WIDTH, 24);
  assert.equal(AVATAR_HEIGHT, 32);
  assert.equal(PORTRAIT_SIZE, 36);
  assert.equal(creatorProfiles.carterpcs.pixelLook.glasses, false);
  assert.equal(creatorProfiles.kayjayohpcs.pixelLook.glasses, false);

  for (const creator of creatorRoster) {
    const runSignatures = new Set<string>();
    for (let f = 0; f < 6; f += 1) {
      runSignatures.add(
        sampleAvatarSignature(creator.pixelLook, { state: "run", frame: f }),
      );
    }
    assert.equal(
      runSignatures.size,
      6,
      `Expected 6 distinct run frames for ${creator.slug}`,
    );

    const idleSig = sampleAvatarSignature(creator.pixelLook, { state: "idle", frame: 0 });
    const blinkSig = sampleAvatarSignature(creator.pixelLook, { state: "blink", frame: 0 });
    const jumpSig = sampleAvatarSignature(creator.pixelLook, { state: "jump", frame: 0 });
    const hitSig = sampleAvatarSignature(creator.pixelLook, { state: "hit", frame: 0 });

    assert.notEqual(idleSig, blinkSig);
    assert.notEqual(idleSig, jumpSig);
    assert.notEqual(jumpSig, hitSig);
  }
});

test("runner physics supports tap hop, hold higher, input buffering, and landing", () => {
  // Tap to hop (holdingJump = false)
  let tapState = createInitialPhysicsState();
  tapState.bufferTimer = RUNNER_CONSTANTS.INPUT_BUFFER_WINDOW;
  tapState.holdingJump = false;

  let maxTapHeight = 0;
  for (let i = 0; i < 60; i += 1) {
    const res = stepRunnerPhysics(tapState, 1 / 60, RUNNER_CONSTANTS.BASE_SPEED);
    tapState = res.next;
    if (tapState.y > maxTapHeight) maxTapHeight = tapState.y;
  }

  // Hold to go higher (holdingJump = true)
  let holdState = createInitialPhysicsState();
  holdState.bufferTimer = RUNNER_CONSTANTS.INPUT_BUFFER_WINDOW;
  holdState.holdingJump = true;

  let maxHoldHeight = 0;
  for (let i = 0; i < 60; i += 1) {
    const res = stepRunnerPhysics(holdState, 1 / 60, RUNNER_CONSTANTS.BASE_SPEED);
    holdState = res.next;
    if (holdState.y > maxHoldHeight) maxHoldHeight = holdState.y;
  }

  assert.equal(maxTapHeight > 20, true, "Tap jump must lift player off desk");
  assert.equal(
    maxHoldHeight > maxTapHeight + 15,
    true,
    "Holding jump must reach a significantly higher peak than tapping",
  );
  assert.equal(tapState.onGround, true, "Player must return to ground after jump");
});

test("collision, near miss bonus, and zone shifts from day to sunset to night work accurately", () => {
  const ramObstacle = {
    x: RUNNER_CONSTANTS.PLAYER_X + 4,
    w: 12,
    h: 26,
    kindIndex: 0,
    passed: false,
    nearMissed: false,
  };

  assert.equal(checkCollision(0, ramObstacle), true, "Grounded player hits obstacle");
  assert.equal(checkCollision(32, ramObstacle), false, "Airborne player clears obstacle");
  assert.equal(
    checkNearMiss(32, ramObstacle),
    true,
    "Clearing obstacle within margin triggers near miss bonus",
  );
  assert.equal(
    checkNearMiss(60, ramObstacle),
    false,
    "High clearance does not trigger near miss",
  );

  // Zone shifts: Day (0) -> Sunset (1) -> RGB Night (2)
  assert.equal(getZoneIndex(0), 0);
  assert.equal(getZoneIndex(RUNNER_CONSTANTS.ZONE_LENGTH_METERS + 10), 1);
  assert.equal(getZoneIndex(RUNNER_CONSTANTS.ZONE_LENGTH_METERS * 2 + 10), 2);
});

test("runner pace presets scale speed and normalize obstacle cadence for mobile and desktop widths", () => {
  assert.deepEqual(RUNNER_PACE_ORDER, ["chill", "arcade", "overclock"]);
  assert.equal(RUNNER_PACES.overclock.multiplier > RUNNER_PACES.arcade.multiplier, true);
  assert.equal(RUNNER_PACES.arcade.multiplier > RUNNER_PACES.chill.multiplier, true);
  assert.equal(RUNNER_PACES.arcade.multiplier > 1.0, true);

  const mobileBounds = getNormalizedSpawnBounds(
    RUNNER_CONSTANTS.BASE_SPEED * RUNNER_PACES.arcade.multiplier,
    RUNNER_CONSTANTS.CANVAS_WIDTH_NARROW,
    RUNNER_PACES.arcade.multiplier,
  );
  const desktopBounds = getNormalizedSpawnBounds(
    RUNNER_CONSTANTS.BASE_SPEED * RUNNER_PACES.arcade.multiplier,
    RUNNER_CONSTANTS.CANVAS_WIDTH_WIDE,
    RUNNER_PACES.arcade.multiplier,
  );

  assert.equal(mobileBounds.minGap >= 0.42, true);
  assert.equal(mobileBounds.maxGap > mobileBounds.minGap, true);
  assert.equal(desktopBounds.minGap >= 0.42, true);
  assert.equal(desktopBounds.maxGap > desktopBounds.minGap, true);
  assert.equal(mobileBounds.minGap >= desktopBounds.minGap, true);
});

test("bench quiz bonus mode validates rounds and win/loss threshold", () => {
  assert.equal(getRoundsForCreator("carterpcs").length, 6);
  assert.equal(getRoundsForCreator("kayjayohpcs").length, 6);
  for (const round of [...gameRounds, ...kayjayRounds]) {
    assert.equal(round.choices.length, 3);
    assert.equal(
      round.choices.some((c) => c.id === round.answerId),
      true,
    );
  }
  assert.equal(getGameOutcome(4, 0), "win");
  assert.equal(getGameOutcome(5, 2), "win");
  assert.equal(getGameOutcome(3, 1), "loss");
  assert.equal(getGameOutcome(4, 3), "loss");
});

test("all user facing copy obeys strict copy rules: no dashes, no phones, no Termux, no programming languages", () => {
  const stringsToCheck: string[] = [
    siteConfig.name,
    siteConfig.description,
    siteConfig.disclaimer,
    siteConfig.shortDisclaimer,
    ...Object.values(routeMeta).flatMap((m) => [m.title, m.description]),
    ...Object.values(homeHeroCopy),
    ...navigationItems.map((n) => n.label),
    researchBrief.title,
    researchBrief.summary,
    ...researchBrief.tenBulletPlan,
    ...researchBrief.uiCritique.flatMap((c) => [c.issue, c.fix]),
    ...researchBrief.creators.flatMap((c) => [
      c.toneAndDelivery,
      c.visualBrandingAndLook,
      c.worldTranslation,
      ...c.contentFormats,
      ...c.recurringBits,
    ]),
    ...creatorRoster.flatMap((c) => [
      c.name,
      c.category,
      c.label,
      c.tagline,
      c.modeTitle,
      c.modeDescription,
      c.description,
      c.world.worldName,
      c.world.deskSubtitle,
      ...c.world.propNames,
    ]),
    ...OBSTACLE_KINDS.flatMap((o) => [o.label, o.cause]),
    ...RUNNER_PACE_ORDER.flatMap((id) => [
      RUNNER_PACES[id].label,
      RUNNER_PACES[id].detail,
    ]),
    ...ANNOUNCER_LINES.ready,
    ...ANNOUNCER_LINES.start,
    ...ANNOUNCER_LINES.nearMiss,
    ...ANNOUNCER_LINES.milestone,
    ANNOUNCER_LINES.zoneDay,
    ANNOUNCER_LINES.zoneSunset,
    ANNOUNCER_LINES.zoneNight,
    ...ANNOUNCER_LINES.gameOver,
    ...[...gameRounds, ...kayjayRounds].flatMap((r) => [
      r.prompt,
      r.context,
      r.explanation,
      ...r.choices.flatMap((ch) => [ch.label, ch.detail]),
    ]),
    ...supportLetterParagraphs,
    ...supportTargetSpecs.flatMap(([k, v]) => [k, v]),
    ...supportChecks,
    ...supportProofProjects.flatMap((p) => [p.tag, p.title, p.description]),
    ...hireServices.flatMap((s) => [s.title, s.description, s.deliverables]),
    ...hireCapabilities,
    ...hireProcess.flatMap(([n, t, d]) => [n, t, d]),
  ];

  assert.equal(builderContactEmail, "adebiyijosephayomide@gmail.com");
  assert.equal(builderTiktokHandle, "@joebuildsthings");
  assert.equal(builderTiktokName, "JoeCodes");
  assert.equal(builderTiktokUrl, "https://www.tiktok.com/@joebuildsthings");

  for (const str of stringsToCheck) {
    const violations = findCopyViolations(str);
    assert.deepEqual(
      violations,
      [],
      `Copy rule violation in "${str}": ${violations.join(", ")}`,
    );
  }
});
