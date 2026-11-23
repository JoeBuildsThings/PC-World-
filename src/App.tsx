import { useEffect, useState } from "react";
import { AppLink } from "@/components/app-link";
import { CreatorGame } from "@/components/creator-game";
import { ResearchBriefModal } from "@/components/research-brief-modal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { creatorProfiles } from "@/lib/creators";
import { HireView } from "@/views/hire-view";
import { HomeView } from "@/views/home-view";
import { PlaySelectView } from "@/views/play-select-view";
import { SupportView } from "@/views/support-view";

function normalizePathname(raw: string): string {
  if (!raw || raw === "/") return "/";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
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
    if (pathname === "/") {
      document.title = "CREATOR ARCADE";
    } else if (pathname === "/play") {
      document.title = "Choose a Creator | CREATOR ARCADE";
    } else if (pathname === "/play/carterpcs") {
      document.title = "CarterPCs Challenge | CREATOR ARCADE";
    } else if (pathname === "/play/kayjayohpcs" || pathname === "/play/kayjahopc") {
      document.title = "KayJayOhPCs Challenge | CREATOR ARCADE";
    } else if (pathname === "/support") {
      document.title = "Workstation Support | CREATOR ARCADE";
    } else if (pathname === "/hire") {
      document.title = "Hire | CREATOR ARCADE";
    }
  }, [pathname]);

  function renderRoute() {
    if (pathname === "/") {
      return <HomeView />;
    }
    if (pathname === "/play") {
      return <PlaySelectView />;
    }
    if (pathname === "/play/carterpcs") {
      return <CreatorGame creator={creatorProfiles.carterpcs} />;
    }
    if (pathname === "/play/kayjayohpcs" || pathname === "/play/kayjahopc") {
      return <CreatorGame creator={creatorProfiles.kayjayohpcs} />;
    }
    if (pathname === "/support") {
      return <SupportView />;
    }
    if (pathname === "/hire") {
      return <HireView />;
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
      {renderRoute()}
      <SiteFooter onOpenBrief={() => setBriefOpen(true)} />
      <ResearchBriefModal
        open={briefOpen}
        onClose={() => setBriefOpen(false)}
      />
    </div>
  );
}
