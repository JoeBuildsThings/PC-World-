import { useState } from "react";
import { AppLink } from "@/components/app-link";

export const supportLetterParagraphs = [
  "Hello PC creators and community,",
  "My name is Joseph. I am a university student and independent developer, learning by building real projects. I made this small experience because I enjoy PC culture and wanted to create something useful and fun for people who share that interest.",
  "I am working toward a dependable development laptop. A suitable machine would let me run modern development tools, test larger projects locally, and keep building without my hardware becoming the main limitation. It would also give me a better starting point for learning game development with Unity and Unreal Engine.",
  "I am looking for a refurbished Lenovo ThinkPad T14 Gen 2 AMD with a Ryzen 5 PRO 5650U, 16GB RAM, and a 512GB SSD, or another reliable machine with comparable specifications. It does not need to be brand new. A healthy, verified refurbished laptop would make a meaningful difference.",
  "If you or someone in the community might be open to helping me source a suitable laptop or discussing support privately, I would be grateful. I can share the specifications and check any machine before a purchase. There is no pressure, and this website does not collect payments.",
] as const;

export const supportTargetSpecs = [
  ["Reference model", "Lenovo ThinkPad T14 Gen 2 AMD"],
  ["Reference machine type", "20XK00BGUS"],
  ["Processor", "AMD Ryzen 5 PRO 5650U, 6 cores / 12 threads"],
  ["Memory", "16GB soldered DDR4 3200"],
  ["Memory expansion", "Up to 48GB on supported configurations"],
  ["Storage", "512GB M.2 2280 PCIe NVMe SSD"],
  ["Display", "14 inch FHD IPS"],
] as const;

export const supportChecks = [
  "Confirm the exact machine type or regional model number. T14 Gen 2 configurations vary.",
  "Check that the BIOS is accessible and no supervisor password or organization lock prevents use.",
  "Inspect the screen, hinges, keyboard, trackpad, ports, webcam, speakers, and charger.",
  "Request battery health information and an SSD health report where possible.",
  "Confirm that the installed memory and storage match the agreed configuration.",
  "Agree on a reasonable inspection or return window before completing a purchase.",
] as const;

export const supportProofProjects = [
  {
    tag: "01 / SECURITY WORKBENCH",
    title: "NetRecon",
    description:
      "A web reconnaissance workbench for DNS, TLS, web security posture, and scoped network checks, with explicit safeguards around active probing.",
    url: "https://github.com/JoeBuildsThings/NetRecon",
  },
  {
    tag: "02 / AUDIO APPLICATION",
    title: "Frost Music Player",
    description:
      "An offline first audio player built with modern media playback architecture, background audio service, and local library management.",
    url: "https://github.com/JoeBuildsThings/frost-music-player",
  },
  {
    tag: "03 / DEVELOPER TOOLING",
    title: "JOEBOT",
    description:
      "A command line developer assistant with workspace tools, provider fallback, and an approval gate before file writes or shell commands.",
    url: "https://github.com/JoeBuildsThings/joebot",
  },
  {
    tag: "04 / RETAIL STOREFRONT",
    title: "Synsorempire",
    description:
      "A retail storefront with a managed product catalogue, private admin area, and direct messaging order flow for a local fashion brand.",
    url: "https://github.com/JoeBuildsThings/synsorempire",
  },
] as const;

export const builderContactEmail = "adebiyijosephayomide@gmail.com";
export const builderTiktokHandle = "@joebuildsthings";
export const builderTiktokName = "JoeCodes";
export const builderTiktokUrl = "https://www.tiktok.com/@joebuildsthings";
export const builderTiktokScreenshot =
  "/assets/aistudio/Screenshot_20261123-182818_44fdcb5f.png";

export function SupportView() {
  const [requestOpened, setRequestOpened] = useState(false);
  const [showTiktokPreview, setShowTiktokPreview] = useState(false);

  if (!requestOpened) {
    return (
      <main id="main-content" className="detail-page support-letter-stage">
        <section
          className="letter-paper support-letter-card anim-letter-enter"
          aria-labelledby="letter-title"
        >
          <div className="letter-topline">
            <span className="letter-status-pill">
              <span className="live-dot" aria-hidden="true" />
              PRIVATE NOTE / 001
            </span>
            <span>FROM JOSEPH AYOMIDE ADEBIYI</span>
          </div>

          <p className="letter-kicker">A NOTE FROM THE BUILDER</p>
          <h1 id="letter-title" className="support-letter-heading">
            A note from <span>Joseph.</span>
          </h1>

          <p className="letter-greeting">{supportLetterParagraphs[0]}</p>
          {supportLetterParagraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="letter-signoff">
            <p className="letter-signoff-thanks">
              Thank you for taking the time to play and read this.
            </p>
            <div className="letter-signoff-grid">
              <div>
                <strong>Joseph Ayomide Adebiyi</strong>
                <span className="letter-signoff-role">
                  {builderTiktokName} ({builderTiktokHandle})
                </span>
              </div>
              <div className="letter-signoff-links">
                <a
                  className="support-letter-email"
                  href={`mailto:${builderContactEmail}?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support`}
                >
                  {builderContactEmail}
                </a>
                <a
                  className="support-letter-email"
                  href={builderTiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  TikTok: {builderTiktokHandle} ↗
                </a>
              </div>
            </div>
          </div>

          <div className="letter-actions">
            <button
              type="button"
              data-testid="open-support-request"
              className="button button-primary"
              onClick={() => {
                setRequestOpened(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Open the laptop request <span aria-hidden="true">→</span>
            </button>
            <a
              className="support-contact-secondary"
              href={`mailto:${builderContactEmail}?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support`}
            >
              Email Joseph <span aria-hidden="true">↗</span>
            </a>
            <a
              className="support-contact-secondary"
              href={builderTiktokUrl}
              target="_blank"
              rel="noreferrer"
            >
              DM on TikTok ({builderTiktokHandle}) <span aria-hidden="true">↗</span>
            </a>
            <AppLink className="letter-text-button" href="/play">
              Back to the arcade
            </AppLink>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="detail-page anim-page-reveal">
      <div className="support-reopen-bar">
        <span className="letter-status-pill">
          <span className="live-dot" aria-hidden="true" />
          READING FULL WORKSTATION REQUEST
        </span>
        <button
          type="button"
          className="support-reopen-btn"
          onClick={() => setRequestOpened(false)}
        >
          ← Read Joseph&apos;s letter again
        </button>
      </div>

      <section className="detail-hero section-wrap">
        <div className="detail-kicker">
          <span className="eyebrow">01 / Workstation support</span>
          <span className="detail-index">A DIRECT, TRANSPARENT REQUEST</span>
        </div>

        <div className="detail-hero-grid">
          <div>
            <p className="detail-pretitle">HELP EQUIP THE NEXT BUILD.</p>
            <h1 className="detail-title">
              A better machine
              <br />
              <span>for the work ahead.</span>
            </h1>
          </div>
          <div className="detail-summary">
            <p>
              I am looking for help acquiring a dependable development laptop so
              I can keep designing, building, testing, and shipping software.
            </p>
            <p>
              The request is direct: help source this machine or a comparable
              one. There is no payment form, checkout, donation counter, or
              public fundraising tally. A supporter can arrange a laptop
              directly or contact me before discussing any contribution.
            </p>
          </div>
        </div>

        <div className="support-status-line">
          <span>REQUEST DETAILS PUBLISHED</span>
          <span>NO PAYMENT PROCESSING</span>
          <span>NO AFFILIATION OR ENDORSEMENT CLAIMED</span>
        </div>
      </section>

      <section
        className="support-proof section-wrap"
        aria-labelledby="support-proof-title"
      >
        <div className="support-proof-heading">
          <p className="eyebrow">02 / Work already in public</p>
          <h2 id="support-proof-title">
            Not a project
            <br />
            <span>that exists only on paper.</span>
          </h2>
          <p>
            These public repositories show software I have already designed and
            built. Each one can be inspected before anyone decides whether to
            help.
          </p>
        </div>

        <div className="support-proof-grid">
          {supportProofProjects.map((proj) => (
            <article key={proj.title}>
              <span>{proj.tag}</span>
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
              <a href={proj.url} target="_blank" rel="noreferrer">
                Inspect source <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        className="spec-section section-wrap"
        aria-labelledby="target-machine-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / Target machine</p>
            <h2 id="target-machine-title">
              Refurbished ThinkPad
              <br />
              <span>T14 Gen 2 AMD.</span>
            </h2>
          </div>
          <p className="section-intro">
            Chosen for practical Linux and web development performance, solid
            build quality, serviceable storage, and expandable memory.
          </p>
        </div>

        <dl className="spec-table">
          {supportTargetSpecs.map(([label, value]) => (
            <div className="spec-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="spec-link-row">
          <a
            className="arena-text-link"
            href="https://psref.lenovo.com/Detail/ThinkPad_T14_Gen_2_AMD?M=20XK00BGUS"
            target="_blank"
            rel="noreferrer"
          >
            Official specification record <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="support-options section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / Ways to help</p>
            <h2>
              Two straightforward
              <br />
              <span>ways to make it happen.</span>
            </h2>
          </div>
          <p className="section-intro">
            Support is entirely voluntary. There is no expected amount, public
            donor list, or pressure to contribute.
          </p>
        </div>

        <div className="support-option-grid">
          <article className="support-option">
            <span className="option-index">A / DIRECT GIFT</span>
            <h3>Help source the laptop itself.</h3>
            <p>
              A supporter can help locate or purchase a suitable machine and
              arrange a direct handover. The exact unit should be checked
              against the specification and condition notes on this page.
            </p>
          </article>

          <article className="support-option">
            <span className="option-index">B / PRIVATE DISCUSSION</span>
            <h3>Discuss financial help privately.</h3>
            <p>
              Someone who prefers to contribute financially can first get in
              touch to discuss the details privately. No money is collected
              through this website.
            </p>
          </article>
        </div>
      </section>

      <section className="inspection-section section-wrap">
        <div className="inspection-heading">
          <p className="eyebrow">05 / Before any purchase</p>
          <h2>
            Check the actual
            <br />
            <span>machine, not the listing.</span>
          </h2>
          <p>
            Refurbished laptops can differ significantly in condition. These
            checks protect both the supporter and the person receiving it.
          </p>
        </div>

        <ol className="inspection-list">
          {supportChecks.map((check, index) => (
            <li key={check}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{check}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="contact-placeholder section-wrap" id="contact">
        <div>
          <p className="eyebrow">06 / Start a conversation</p>
          <h2>
            Talk to me
            <br />
            <span>directly.</span>
          </h2>
          <p>
            For a laptop offer, a question about the specifications, or a
            private conversation about support, reach out to me directly by
            email, TikTok DM, or my public profiles below. Please do not send
            money to an account found in an unrelated comment or message.
          </p>

          <div className="support-direct-grid">
            <div className="support-direct-email-card">
              <span className="eyebrow">DIRECT EMAIL</span>
              <a
                className="support-direct-email-link"
                href={`mailto:${builderContactEmail}?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support`}
              >
                {builderContactEmail}
              </a>
              <span className="support-card-sub">
                Primary inbox for laptop offers and specification checks
              </span>
            </div>

            <div className="support-direct-email-card">
              <span className="eyebrow">TIKTOK / DM OPEN</span>
              <a
                className="support-direct-email-link"
                href={builderTiktokUrl}
                target="_blank"
                rel="noreferrer"
              >
                {builderTiktokName} ({builderTiktokHandle}) ↗
              </a>
              <div className="support-tiktok-meta">
                <span className="support-card-sub">
                  Web dev, backend engineering, and cybersecurity
                </span>
                <button
                  type="button"
                  className="support-screenshot-toggle"
                  aria-expanded={showTiktokPreview}
                  onClick={() => setShowTiktokPreview((prev) => !prev)}
                >
                  {showTiktokPreview
                    ? "Hide profile screenshot"
                    : "Verify TikTok profile screenshot"}
                </button>
              </div>
            </div>
          </div>

          {showTiktokPreview && (
            <figure className="support-tiktok-figure anim-letter-enter">
              <div className="support-tiktok-img-crop">
                <img
                  src={builderTiktokScreenshot}
                  alt="Screenshot of Joseph's TikTok profile JoeCodes (@joebuildsthings)"
                  loading="lazy"
                  className="support-tiktok-img"
                />
              </div>
              <figcaption>
                Verified TikTok account: {builderTiktokName} ({builderTiktokHandle})
              </figcaption>
            </figure>
          )}

          <div className="support-contact-actions">
            <a
              className="button button-primary"
              href={`mailto:${builderContactEmail}?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support`}
            >
              Email {builderContactEmail} <span aria-hidden="true">↗</span>
            </a>
            <a
              className="support-contact-secondary"
              href={builderTiktokUrl}
              target="_blank"
              rel="noreferrer"
            >
              TikTok {builderTiktokHandle} <span aria-hidden="true">↗</span>
            </a>
            <a
              className="support-contact-secondary"
              href="https://www.linkedin.com/in/joseph-ayomide-adebiyi-5bb66844b/"
              target="_blank"
              rel="noreferrer"
            >
              Message me on LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a
              className="support-contact-secondary"
              href="https://github.com/JoeBuildsThings"
              target="_blank"
              rel="noreferrer"
            >
              View my GitHub profile <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="creator-contact-block">
            <p className="eyebrow">PUBLIC CREATOR BUSINESS CONTACTS</p>
            <p>
              These addresses are listed publicly for business enquiries. They
              are simply contact routes, not an indication of support or
              endorsement. A single, respectful message is enough.
            </p>
            <div className="support-contact-actions">
              <a
                className="support-contact-secondary"
                href="mailto:Carterpcs@rakugomedia.com?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support%20request"
              >
                CarterPCs team inbox <span aria-hidden="true">↗</span>
              </a>
              <a
                className="support-contact-secondary"
                href="https://link.me/carterpcs_"
                target="_blank"
                rel="noreferrer"
              >
                Verify Carter&apos;s public contact{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <a
                className="support-contact-secondary"
                href="mailto:kayjayohpcs@gmail.com?subject=CREATOR%20ARCADE%20%7C%20Laptop%20support%20request"
              >
                KayJayOhPCs business inbox <span aria-hidden="true">↗</span>
              </a>
              <a
                className="support-contact-secondary"
                href="https://www.youtube.com/@Kayjayohpcs"
                target="_blank"
                rel="noreferrer"
              >
                Verify KayJay&apos;s public business listing{" "}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-placeholder-tag">
          <span className="live-dot" aria-hidden="true" />
          PUBLIC CONTACT / EMAIL + TIKTOK + LINKEDIN + GITHUB
        </div>
      </section>

      <p className="support-disclaimer section-wrap">
        CREATOR ARCADE is an independent fan made project. It is not affiliated
        with, sponsored by, or endorsed by any featured creator, their partners,
        or Lenovo.
      </p>
    </main>
  );
}
