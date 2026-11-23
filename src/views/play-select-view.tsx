import { useState, useSyncExternalStore } from "react";
import { AppLink } from "@/components/app-link";
import { PixelAvatarBadge } from "@/components/pixel-avatar-badge";
import { type CreatorProfile, type CreatorSlug, creatorRoster } from "@/lib/creators";
import { BEST_SCORE_EVENT, readBestScore } from "@/lib/game";
import { siteConfig } from "@/lib/site";

function subscribeBest(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener(BEST_SCORE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(BEST_SCORE_EVENT, cb);
  };
}

function CreatorSelectCard({
  creator,
  index,
  total,
}: {
  creator: CreatorProfile;
  index: number;
  total: number;
}) {
  const [activeHover, setActiveHover] = useState(false);
  const bestDistance = useSyncExternalStore(
    subscribeBest,
    () => readBestScore(creator.slug as CreatorSlug),
    () => 0,
  );

  return (
    <article
      className={`select-card select-card-${creator.variant}`}
      onMouseEnter={() => setActiveHover(true)}
      onMouseLeave={() => setActiveHover(false)}
      onFocus={() => setActiveHover(true)}
      onBlur={() => setActiveHover(false)}
    >
      {/* Top World Preview Stage with Live Animated 24x32 Pixel Avatar */}
      <div className="select-stage">
        <div className="select-stage-topline">
          <span>{creator.world.worldName}</span>
          <span>
            BEST {String(bestDistance).padStart(4, "0")}M
          </span>
        </div>

        <div className="select-stage-floor">
          <div className="select-stage-avatars">
            <span className="select-face-frame">
              <PixelAvatarBadge
                creator={creator}
                scale={2}
                variant="face"
                mode={activeHover ? "jump" : "idle"}
              />
            </span>
            <PixelAvatarBadge
              creator={creator}
              scale={2}
              variant="sprite"
              mode={activeHover ? "run" : "idle"}
            />
          </div>
          <div className="select-prop-list" aria-label="Desk world props">
            {creator.world.propNames.slice(0, 2).map((prop) => (
              <span key={prop}>{prop}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Concise Editorial Copy (Max 2 type sizes in body section) */}
      <div className="select-body">
        <p className="creator-card-kicker">
          0{index + 1} / 0{total} · {creator.modeTitle}
        </p>
        <h2>{creator.name}</h2>
        <p className="select-description">{creator.description}</p>
      </div>

      {/* Primary Action in Thumb Zone (48px minimum tap target) */}
      <div className="select-actions">
        <AppLink
          className="button button-primary select-primary-btn"
          href={`/play/${creator.slug}`}
          aria-label={`Play the ${creator.name} edition`}
        >
          Play {creator.name} <span aria-hidden="true">→</span>
        </AppLink>

        <div className="select-meta-links">
          <a
            className="creator-profile-link"
            href={creator.profileUrl}
            target="_blank"
            rel="noreferrer"
          >
            Public profile: {creator.handle} <span aria-hidden="true">↗</span>
          </a>
          <a
            className="creator-profile-link"
            href={creator.contextUrl}
            target="_blank"
            rel="noreferrer"
          >
            Creator background / Micro Center <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function PlaySelectView() {
  return (
    <main id="main-content" className="play-page anim-page-reveal">
      <div className="play-topline">
        <p className="play-eyebrow">CREATOR ARCADE / CHARACTER SELECT</p>
        <span>{siteConfig.shortDisclaimer}</span>
      </div>

      <section className="play-intro" aria-labelledby="play-title">
        <h1 id="play-title">
          Pick your
          <br />
          <span>player.</span>
        </h1>
        <p>
          Two creators, two custom desk worlds. Run Carter&apos;s dual monitor
          setup or enter KayJay&apos;s car tire PC build lab.
        </p>
      </section>

      <section className="creator-selection" aria-label="Choose a creator">
        {creatorRoster.map((creator, index) => (
          <CreatorSelectCard
            key={creator.slug}
            creator={creator}
            index={index}
            total={creatorRoster.length}
          />
        ))}
      </section>
    </main>
  );
}
