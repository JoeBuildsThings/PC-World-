import { AppLink } from "@/components/app-link";
import { navigationItems, siteConfig } from "@/lib/site";

export type SiteHeaderProps = {
  currentPath: string;
  onOpenBrief: () => void;
};

export function SiteHeader({ currentPath, onOpenBrief }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <AppLink className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          C<span>/</span>A
        </span>
        <span className="brand-name">{siteConfig.name}</span>
      </AppLink>

      <nav className="main-nav" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const isActive =
            currentPath === item.href ||
            currentPath.startsWith(`${item.href}/`);
          return (
            <AppLink
              href={item.href}
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "is-active" : undefined}
            >
              {item.label}
            </AppLink>
          );
        })}
        <button
          type="button"
          className="nav-brief-trigger"
          onClick={onOpenBrief}
        >
          Research brief
        </button>
      </nav>

      <a
        className="header-source"
        href={siteConfig.githubUrl}
        target="_blank"
        rel="noreferrer"
      >
        Inspect the build <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
