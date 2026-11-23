import { AppLink } from "@/components/app-link";
import { PixelAvatarBadge } from "@/components/pixel-avatar-badge";
import { creatorRoster } from "@/lib/creators";
import { siteConfig } from "@/lib/site";

export function HomeView() {
  return (
    <main id="main-content" className="arena-home anim-page-reveal">
      <section className="arena-hero" aria-labelledby="arena-title">
        <div className="arena-rail">
          <p>INDEPENDENT PC CREATOR ARCADE</p>
          <span>ISSUE 001 / OPEN PLAY</span>
        </div>

        <div className="arena-hero-grid">
          <div className="arena-hero-copy">
            <p className="arena-kicker">PICK A CREATOR. TAKE THE BENCH.</p>
            <h1 id="arena-title">
              PC CULTURE
              <br />
              GOES <span>PLAYABLE.</span>
            </h1>
            <p className="arena-lede">
              Creator inspired challenges built for people who love PCs. Choose
              a route, hurdle the desk hardware, and see whether your build
              instincts hold up.
            </p>
            <div className="arena-actions">
              <AppLink className="button button-primary" href="/play">
                Choose your creator <span aria-hidden="true">↗</span>
              </AppLink>
              <AppLink className="arena-text-link" href="/support">
                Why the laptop request exists <span aria-hidden="true">↗</span>
              </AppLink>
            </div>
            <p className="arena-note">
              INDEPENDENT FAN PROJECT. NO CREATOR PARTNERSHIP OR ENDORSEMENT IS
              IMPLIED.
            </p>
          </div>

          <aside className="arena-scoreboard" aria-label="Arcade status">
            <div className="arena-scoreboard-head">
              <span className="letter-status-pill">
                <span className="live-dot" aria-hidden="true" />
                THE BENCH / LIVE BOARD
              </span>
              <span>001</span>
            </div>
            {creatorRoster.map((creator, index) => (
              <AppLink
                className={`arena-score-row arena-score-${creator.variant}`}
                href={`/play/${creator.slug}`}
                key={creator.slug}
              >
                <span className="arena-score-index">0{index + 1}</span>
                <span className="arena-score-avatar" aria-hidden="true">
                  <PixelAvatarBadge creator={creator} scale={1} variant="face" mode="idle" />
                </span>
                <span className="arena-score-name">
                  <small>{creator.world.worldName}</small>
                  <strong>{creator.name}</strong>
                </span>
                <span className="arena-score-arrow" aria-hidden="true">
                  ↗
                </span>
              </AppLink>
            ))}
            <div className="arena-scoreboard-stats">
              <div>
                <strong>60FPS</strong>
                <span>DESK RUN</span>
              </div>
              <div>
                <strong>06</strong>
                <span>QUIZ PICKS</span>
              </div>
              <div>
                <strong>02</strong>
                <span>WORLDS</span>
              </div>
            </div>
            <p className="arena-scoreboard-foot">
              TWO DISTINCT CREATOR WORLDS ARE OPEN FOR PLAY.
            </p>
          </aside>
        </div>

        <div className="arena-hero-bottom">
          <span>NO DOWNLOAD REQUIRED</span>
          <span>BUILT FOR TOUCH + KEYBOARD</span>
          <span>MADE INDEPENDENTLY</span>
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
                <PixelAvatarBadge creator={creator} scale={2} variant="face" mode="idle" />
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
            <h3>Make a practical laptop request without pressure.</h3>
            <p>
              The support page explains the development laptop need, the target
              ThinkPad specifications, and how someone could help source a
              suitable refurbished machine. There is no payment form.
            </p>
            <AppLink href="/support">
              Read the laptop details <span aria-hidden="true">↗</span>
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
