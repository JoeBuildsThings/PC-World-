import { AppLink } from "@/components/app-link";
import { PixelAvatarBadge } from "@/components/pixel-avatar-badge";
import { creatorRoster } from "@/lib/creators";
import { siteConfig } from "@/lib/site";

export const homeHeroCopy = {
  railLeft: "FAN MADE 60FPS PC CREATOR ARCADE",
  railRight: "CARTERPCS + KAYJAYOHPCS",
  kicker: "WHAT THIS IS / PLAYABLE IN 10 SECONDS",
  howToPlay:
    "Pick CarterPCs or KayJayOhPCs below. Tap to hop and hold to jump higher over DDR5 RAM, triple slot GPUs, and car tire PCs, then test your build instincts in the 6 round hardware quiz.",
  requestLabel: "WHY THIS EXISTS / THINKPAD T14 GEN 2 REQUEST",
  requestSummary:
    "Built by university student Joseph Ayomide Adebiyi to earn a reply that helps source a refurbished Lenovo ThinkPad T14 Gen 2 AMD development laptop.",
  disclaimerNote:
    "INDEPENDENT FAN PROJECT. NO CREATOR PARTNERSHIP OR ENDORSEMENT IS IMPLIED.",
} as const;

export function HomeView() {
  return (
    <main id="main-content" className="arena-home anim-page-reveal">
      <section className="arena-hero" aria-labelledby="arena-title">
        <div className="arena-rail">
          <p>{homeHeroCopy.railLeft}</p>
          <span>{homeHeroCopy.railRight}</span>
        </div>

        <div className="arena-hero-grid">
          <div className="arena-hero-copy">
            <p className="arena-kicker">{homeHeroCopy.kicker}</p>
            <h1 id="arena-title">
              PC CULTURE
              <br />
              GOES <span>PLAYABLE.</span>
            </h1>
            <p className="arena-lede">{homeHeroCopy.howToPlay}</p>

            <div className="arena-actions">
              <AppLink
                className="button button-primary"
                href="/play/carterpcs"
              >
                Play CarterPCs now <span aria-hidden="true">→</span>
              </AppLink>
              <AppLink
                className="button button-dark"
                href="/play/kayjayohpcs"
              >
                Play KayJayOhPCs now <span aria-hidden="true">→</span>
              </AppLink>
            </div>

            <div
              className="arena-request-callout"
              aria-label="ThinkPad T14 Gen 2 laptop request and direct contact"
            >
              <p className="arena-request-kicker">
                <span className="live-dot" aria-hidden="true" />
                {homeHeroCopy.requestLabel}
              </p>
              <p className="arena-request-body">
                {homeHeroCopy.requestSummary}
              </p>
              <div className="arena-request-links">
                <AppLink className="arena-text-link" href="/support">
                  Read the ThinkPad T14 Gen 2 letter{" "}
                  <span aria-hidden="true">→</span>
                </AppLink>
                <a
                  className="arena-text-link"
                  href={`mailto:${siteConfig.email}?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support`}
                >
                  Email {siteConfig.email} <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="arena-text-link"
                  href={siteConfig.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  TikTok {siteConfig.tiktokHandle}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <p className="arena-note">{homeHeroCopy.disclaimerNote}</p>
          </div>

          <aside className="arena-scoreboard" aria-label="Choose a creator to play">
            <div className="arena-scoreboard-head">
              <span className="letter-status-pill">
                <span className="live-dot" aria-hidden="true" />
                TAP A CREATOR TO START RUNNING
              </span>
              <span>60FPS</span>
            </div>
            {creatorRoster.map((creator, index) => (
              <AppLink
                className={`arena-score-row arena-score-${creator.variant}`}
                href={`/play/${creator.slug}`}
                key={creator.slug}
              >
                <span className="arena-score-index">0{index + 1}</span>
                <span className="arena-score-avatar" aria-hidden="true">
                  <PixelAvatarBadge
                    creator={creator}
                    scale={1}
                    variant="face"
                    mode="idle"
                  />
                </span>
                <span className="arena-score-name">
                  <small>{creator.world.worldName}</small>
                  <strong>Play {creator.name}</strong>
                </span>
                <span className="arena-score-arrow" aria-hidden="true">
                  →
                </span>
              </AppLink>
            ))}
            <div className="arena-scoreboard-stats">
              <div>
                <strong>TAP</strong>
                <span>LOW HOP</span>
              </div>
              <div>
                <strong>HOLD</strong>
                <span>HIGH JUMP</span>
              </div>
              <div>
                <strong>T14 G2</strong>
                <span>THE GOAL</span>
              </div>
            </div>
            <p className="arena-scoreboard-foot">
              WORKS ON TOUCH AND KEYBOARD. NO DOWNLOAD REQUIRED.
            </p>
          </aside>
        </div>

        <div className="arena-hero-bottom">
          <span>TAP OR HOLD TO JUMP</span>
          <span>THINKPAD T14 GEN 2 REQUEST ON /SUPPORT</span>
          <span>MADE INDEPENDENTLY BY JOSEPH</span>
        </div>
      </section>

      <section className="arena-roster" aria-labelledby="roster-title">
        <div className="arena-section-head">
          <div>
            <p className="eyebrow">01 / The current lineup</p>
            <h2 id="roster-title">
              Choose your
              <br />
              <span>creator route.</span>
            </h2>
          </div>
          <p>
            Each creator gets a custom pixel avatar, a signature desk world, and
            a dedicated hardware quiz bank.
          </p>
        </div>

        <div className="arena-roster-grid">
          {creatorRoster.map((creator, index) => (
            <article
              className={`arena-creator-card arena-creator-${creator.variant}`}
              key={creator.slug}
            >
              <div className="arena-card-top">
                <span>{creator.label}</span>
                <span>
                  0{index + 1} / 0{creatorRoster.length}
                </span>
              </div>

              <div className="arena-card-stage">
                <PixelAvatarBadge
                  creator={creator}
                  scale={2}
                  variant="face"
                  mode="idle"
                />
                <div className="arena-card-world-meta">
                  <span>{creator.world.worldName}</span>
                  <small>{creator.world.deskSubtitle}</small>
                </div>
              </div>

              <div className="arena-card-copy">
                <p>
                  {creator.category} / {creator.modeTitle}
                </p>
                <h3>{creator.name}</h3>
                <span>{creator.description}</span>
              </div>

              <div className="arena-card-actions">
                <AppLink href={`/play/${creator.slug}`}>
                  Play this edition <span aria-hidden="true">↗</span>
                </AppLink>
                <a href={creator.profileUrl} target="_blank" rel="noreferrer">
                  {creator.handle} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="arena-project"
        id="project"
        aria-labelledby="project-title"
      >
        <div className="arena-project-heading">
          <p className="eyebrow">02 / Why this exists</p>
          <h2 id="project-title">
            A good project
            <br />
            <span>should do two jobs.</span>
          </h2>
        </div>

        <div className="arena-project-grid">
          <article>
            <span>01 / THE EXPERIENCE</span>
            <h3>Give PC communities something to play.</h3>
            <p>
              The game comes first. Sprint a creator desk runner at 60fps, dodge
              hardware obstacles, earn a shareable score card, and test your
              build instincts in the bonus bench quiz.
            </p>
            <AppLink href="/play">
              Enter the arcade <span aria-hidden="true">↗</span>
            </AppLink>
          </article>

          <article>
            <span>02 / THE REAL WORLD GOAL</span>
            <h3>Earn a reply for a ThinkPad T14 Gen 2 AMD.</h3>
            <p>
              The support page opens with Joseph&apos;s personal letter, the
              target refurbished ThinkPad T14 Gen 2 specifications, and direct
              email and TikTok contact routes. There is no payment form.
            </p>
            <AppLink href="/support">
              Read the ThinkPad T14 Gen 2 request{" "}
              <span aria-hidden="true">↗</span>
            </AppLink>
          </article>
        </div>
      </section>

      <section className="arena-build-strip">
        <div>
          <p className="eyebrow">03 / The engineering</p>
          <h2>Built to be inspected.</h2>
          <p>
            {siteConfig.description} The source, test coverage, and build
            history are public.
          </p>
        </div>
        <a
          className="button button-dark"
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          Inspect the source <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
