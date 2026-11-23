import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

export type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

export function navigateTo(href: string): void {
  if (typeof window === "undefined") return;
  const targetUrl = new URL(href, window.location.origin);
  if (
    targetUrl.pathname !== window.location.pathname ||
    targetUrl.search !== window.location.search
  ) {
    window.history.pushState({}, "", targetUrl.pathname + targetUrl.search + targetUrl.hash);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }
}

export function AppLink({ href, onClick, children, ...rest }: AppLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      rest.target === "_blank" ||
      href.startsWith("http") ||
      href.startsWith("mailto:")
    ) {
      return;
    }
    event.preventDefault();
    navigateTo(href);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
