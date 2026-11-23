import { AppLink } from "@/components/app-link";
import { siteConfig } from "@/lib/site";

export type SiteFooterProps = {
  onOpenBrief: () => void;
};

export function SiteFooter({ onOpenBrief }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <p>{siteConfig.disclaimer}</p>
      <nav className="footer-nav" aria-label="Footer navigation">
        <AppLink href="/play">Creators</AppLink>
        <AppLink href="/support">Laptop support</AppLink>
        <AppLink href="/hire">Hire</AppLink>
        <button
          type="button"
          className="footer-brief-link"
          onClick={onOpenBrief}
        >
          Research brief
        </button>
        <a href={siteConfig.githubProfileUrl} target="_blank" rel="noreferrer">
          Engineered by JoeBuildsThings <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </footer>
  );
}
