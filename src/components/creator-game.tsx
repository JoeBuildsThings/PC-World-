import { Suspense, lazy } from "react";
import { AppLink } from "@/components/app-link";
import { PixelAvatarBadge } from "@/components/pixel-avatar-badge";
import type { CreatorProfile } from "@/lib/creators";
import { siteConfig } from "@/lib/site";

const LazyCreatorRunner = lazy(() =>
  import("@/components/creator-runner").then((m) => ({
    default: m.CreatorRunner,
  })),
);

const LazyBenchQuiz = lazy(() =>
  import("@/components/bench-quiz").then((m) => ({
    default: m.BenchQuiz,
  })),
);

export type CreatorGameProps = {
  creator: CreatorProfile;
};

export function CreatorGame({ creator }: CreatorGameProps) {
  return (
    <main id="main-content" className="creator-game-page anim-page-reveal">
      <div className="creator-game-topline">
        <AppLink className="play-back-link" href="/play">
          <span aria-hidden="true">←</span> Change creator
        </AppLink>
        <span className="play-topline-note">{siteConfig.shortDisclaimer}</span>
      </div>

      <section
        className={`creator-game creator-game-${creator.variant}`}
        aria-labelledby="creator-game-title"
      >
        <header className="creator-game-heading">
          <div className="creator-game-heading-copy">
            <p className="play-eyebrow">
              {creator.label} / {creator.world.worldName}
            </p>
            <h1 id="creator-game-title">
              {creator.name}
              <span> challenge.</span>
            </h1>
            <p className="creator-game-description">{creator.tagline}</p>
          </div>

          <div className="creator-game-avatar-box">
            <PixelAvatarBadge
              creator={creator}
              scale={2}
              variant="face"
              mode="idle"
            />
            <span className="creator-game-avatar-label">{creator.handle}</span>
          </div>
        </header>

        {/* Primary Hero Experience: 60fps Endless Desk Runner (Lazy Loaded) */}
        <Suspense
          fallback={
            <div className="runner-loading-shell" role="status">
              LOADING 60FPS DESK RUNNER...
            </div>
          }
        >
          <LazyCreatorRunner creator={creator} />
        </Suspense>

        {/* Bonus Mode: The Bench Quiz (Lazy Loaded) */}
        <Suspense
          fallback={
            <div className="runner-loading-shell" role="status">
              LOADING BENCH QUIZ...
            </div>
          }
        >
          <LazyBenchQuiz creator={creator} />
        </Suspense>
      </section>

      <p className="creator-game-disclaimer">
        This is an independently made fan experience. It is not affiliated with,
        sponsored by, or endorsed by {creator.name}.
      </p>
    </main>
  );
}
