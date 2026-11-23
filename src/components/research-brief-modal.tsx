import { useEffect } from "react";
import { PixelAvatarBadge } from "@/components/pixel-avatar-badge";
import { creatorProfiles } from "@/lib/creators";
import { researchBrief } from "@/lib/site";

export type ResearchBriefModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ResearchBriefModal({ open, onClose }: ResearchBriefModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="letter-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="letter-paper brief-modal-paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-modal-title"
      >
        <div className="letter-topline">
          <span>STUDIO DELIVERABLE / STEP 01</span>
          <button
            type="button"
            className="letter-close"
            aria-label="Close research brief"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>

        <p className="letter-kicker">PUBLIC CHANNEL RESEARCH AND PLAN</p>
        <h2 id="brief-modal-title">{researchBrief.title}.</h2>
        <p>{researchBrief.summary}</p>

        <div className="brief-creators-grid">
          {researchBrief.creators.map((entry) => {
            const profile = creatorProfiles[entry.slug];
            return (
              <article key={entry.slug} className="brief-creator-card">
                <div className="brief-creator-head">
                  <PixelAvatarBadge creator={profile} scale={2} variant="face" mode="idle" />
                  <div>
                    <h3>
                      {entry.name} ({entry.handle})
                    </h3>
                    <span className="brief-creator-sub">
                      Public creator: {entry.realNamePublic}
                    </span>
                  </div>
                </div>
                <p>
                  <strong>Tone:</strong> {entry.toneAndDelivery}
                </p>
                <p>
                  <strong>Visual look:</strong> {entry.visualBrandingAndLook}
                </p>
                <p>
                  <strong>Desk world props:</strong> {entry.worldTranslation}
                </p>
                <ul className="brief-list">
                  {entry.recurringBits.map((bit) => (
                    <li key={bit}>{bit}</li>
                  ))}
                </ul>
                <div className="brief-citations">
                  {entry.citations.map((cite) => (
                    <a
                      key={cite.url}
                      href={cite.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {cite.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="brief-section">
          <h3>UI Critique of Previous Play Screen</h3>
          <ul className="brief-list">
            {researchBrief.uiCritique.map((item) => (
              <li key={item.issue}>
                <strong>Problem:</strong> {item.issue} <strong>Fix:</strong>{" "}
                {item.fix}
              </li>
            ))}
          </ul>
        </div>

        <div className="brief-section">
          <h3>10 Point Studio Build Plan</h3>
          <ol className="brief-list">
            {researchBrief.tenBulletPlan.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="letter-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={onClose}
          >
            Back to arcade
          </button>
        </div>
      </section>
    </div>
  );
}
