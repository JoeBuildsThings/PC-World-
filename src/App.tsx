import { Suspense, lazy, useEffect, useState } from "react";
import { AppLink } from "@/components/app-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { creatorProfiles } from "@/lib/creators";
import { getRouteMeta, siteConfig } from "@/lib/site";
import { HomeView } from "@/views/home-view";

const LazyPlaySelectView = lazy(() =>
  import("@/views/play-select-view").then((m) => ({
    default: m.PlaySelectView,
  })),
);

const LazyCreatorGame = lazy(() =>
  import("@/components/creator-game").then((m) => ({
    default: m.CreatorGame,
  })),
);

const LazySupportView = lazy(() =>
  import("@/views/support-view").then((m) => ({
    default: m.SupportView,
  })),
);

const LazyHireView = lazy(() =>
  import("@/views/hire-view").then((m) => ({
    default: m.HireView,
  })),
);

const LazyResearchBriefModal = lazy(() =>
  import("@/components/research-brief-modal").then((m) => ({
    default: m.ResearchBriefModal,
  })),
);

function normalizePathname(raw: string): string {
  if (!raw || raw === "/") return "/";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function setMetaTag(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute("content", content);
  }
}

export default function App() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== "undefined"
      ? normalizePathname(window.location.pathname)
      : "/",
  );
  const [briefOpen, setBriefOpen] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("brief") === "1"
      : false,
  );

  useEffect(() => {
    const syncLocation = () => {
      setPathname(normalizePathname(window.location.pathname));
    };
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = getRouteMeta(pathname);
    const canonicalUrl = `${siteConfig.siteUrl}${meta.path === "/" ? "/" : meta.path}`;

    document.title = meta.title;
    setMetaTag('meta[name="description"]', meta.description);
    setMetaTag('meta[property="og:title"]', meta.title);
    setMetaTag('meta[property="og:description"]', meta.description);
    setMetaTag('meta[property="og:url"]', canonicalUrl);
    setMetaTag('meta[name="twitter:title"]', meta.title);
    setMetaTag('meta[name="twitter:description"]', meta.description);

    const canonicalEl = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (canonicalEl) {
      canonicalEl.setAttribute("href", canonicalUrl);
    }
  }, [pathname]);

  function renderRoute() {
    if (pathname === "/") {
      return <HomeView />;
    }
    if (pathname === "/play") {
      return <LazyPlaySelectView />;
    }
    if (pathname === "/play/carterpcs") {
      return <LazyCreatorGame creator={creatorProfiles.carterpcs} />;
    }
    if (pathname === "/play/kayjayohpcs" || pathname === "/play/kayjahopc") {
      return <LazyCreatorGame creator={creatorProfiles.kayjayohpcs} />;
    }
    if (pathname === "/support") {
      return <LazySupportView />;
    }
    if (pathname === "/hire") {
      return <LazyHireView />;
    }
    return (
      <main id="main-content" className="detail-page">
        <section className="detail-hero section-wrap">
          <p className="detail-pretitle">404 / ROUTE NOT FOUND</p>
          <h1 className="detail-title">
            That bench
            <br />
            <span>is not here.</span>
          </h1>
          <div className="arena-actions">
            <AppLink className="button button-primary" href="/play">
              Choose a creator <span aria-hidden="true">→</span>
            </AppLink>
            <AppLink className="arena-text-link" href="/">
              Return home <span aria-hidden="true">↗</span>
            </AppLink>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader
        currentPath={pathname}
        onOpenBrief={() => setBriefOpen(true)}
      />
      <Suspense
        fallback={
          <main id="main-content" className="route-loading-shell" role="status">
            LOADING BENCH...
          </main>
        }
      >
        {renderRoute()}
      </Suspense>
      <SiteFooter onOpenBrief={() => setBriefOpen(true)} />
      {briefOpen && (
        <Suspense fallback={null}>
          <LazyResearchBriefModal
            open={briefOpen}
            onClose={() => setBriefOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
