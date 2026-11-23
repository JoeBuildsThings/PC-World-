export const siteConfig = {
  name: "CREATOR ARCADE",
  description:
    "An independent fan made PC creator arcade with playable desk runner and bench quiz editions.",
  disclaimer:
    "CREATOR ARCADE is an independent fan made project. It is not affiliated with, sponsored by, or endorsed by any featured creator, their partners, or Lenovo.",
  shortDisclaimer:
    "Independent fan project, not affiliated with any featured creator.",
  githubUrl: "https://github.com/JoeBuildsThings/carter-exe",
  githubProfileUrl: "https://github.com/JoeBuildsThings",
  linkedinUrl: "https://www.linkedin.com/in/joseph-ayomide-adebiyi-5bb66844b/",
  tiktokUrl: "https://www.tiktok.com/@joebuildsthings",
  tiktokHandle: "@joebuildsthings",
  tiktokName: "JoeCodes",
  email: "adebiyijosephayomide@gmail.com",
} as const;

export const navigationItems = [
  { label: "Creators", href: "/play" },
  { label: "Laptop support", href: "/support" },
  { label: "Hire", href: "/hire" },
] as const;

export type ResearchCreatorEntry = {
  slug: "carterpcs" | "kayjayohpcs";
  name: string;
  handle: string;
  realNamePublic: string;
  contentFormats: readonly string[];
  toneAndDelivery: string;
  visualBrandingAndLook: string;
  recurringBits: readonly string[];
  worldTranslation: string;
  citations: readonly { label: string; url: string }[];
};

export const researchBrief: {
  title: string;
  summary: string;
  creators: readonly ResearchCreatorEntry[];
  uiCritique: readonly { issue: string; fix: string }[];
  tenBulletPlan: readonly string[];
} = {
  title: "Creator Research Brief, UI Critique, and Studio Plan",
  summary:
    "Public channel analysis for CarterPCs and KayJayOhPCs using only publicly known facts and neutral Announcer commentary.",
  creators: [
    {
      slug: "carterpcs",
      name: "CarterPCs",
      handle: "@carterpcs",
      realNamePublic: "Carter",
      contentFormats: [
        "Fast paced short form tech commentary and everyday PC setup advice on TikTok and YouTube Shorts.",
        "Community desktop app dock reviews, viewer PC setup roasts, and practical hardware troubleshooting.",
        "First person POV smart glasses tests and casual stories filmed at his desk or in his car.",
      ],
      toneAndDelivery:
        "Conversational, self aware, and relaxed. Talks to the audience like a friend rather than reading a spec sheet.",
      visualBrandingAndLook:
        "Signature dark framed smart glasses, textured medium brown hair (famous for his long hair era before the big haircut), clean shaven face, and a dark charcoal hoodie paired with warm terracotta orange accents.",
      recurringBits: [
        "Hair lore transitions from the long hair era to the short haircut.",
        "Everyday testing and first person recording with Meta Ray Ban smart glasses.",
        "Roasting chaotic viewer desktop app docks and questionable bottlenecked PC builds.",
      ],
      worldTranslation:
        "Warm orange studio world featuring his dual monitor desk setup, boom arm condenser microphone, smart glasses resting on a stand, and an app dock window on screen.",
      citations: [
        {
          label: "CarterPCs TikTok Profile",
          url: "https://www.tiktok.com/@carterpcs",
        },
        {
          label: "CarterPCs Public Link Hub",
          url: "https://link.me/carterpcs_",
        },
        {
          label: "Micro Center Creator Feature",
          url: "https://www.microcenter.com/site/mc-news/article/miami-influencer-schedule.aspx?storeID=065",
        },
      ],
    },
    {
      slug: "kayjayohpcs",
      name: "KayJayOhPCs",
      handle: "@kayjayohpcs",
      realNamePublic: "Keith Over",
      contentFormats: [
        "Custom PC build challenges, unconventional hardware enclosures, and high energy tech shorts.",
        "Viewer build inspections diagnosing airflow mistakes, radiator clearance problems, and power delivery mismatches.",
        "Retail hardware runs at Micro Center and deep dives into enthusiast peripherals.",
      ],
      toneAndDelivery:
        "High energy, hands on builder enthusiasm mixed with sharp diagnostic eyes for hardware clearances and thermal paths.",
      visualBrandingAndLook:
        "Styled dark hair, signature trimmed beard, dark framed glasses, and a dark workshop hoodie accented with high contrast acid lime.",
      recurringBits: [
        "Building a working gaming PC inside a real car tire enclosure.",
        "Treating Micro Center trips like a theme park run for PC builders.",
        "Spotting hidden clearance, standoff, and airflow flaws in viewer submitted builds.",
      ],
      worldTranslation:
        "Acid lime odd build workshop featuring the car tire PC enclosure on a test bench riser, a 360mm triple fan radiator assembly, a custom loop reservoir, and parts bins.",
      citations: [
        {
          label: "KayJayOhPCs TikTok Profile",
          url: "https://www.tiktok.com/@kayjayohpcs",
        },
        {
          label: "KayJayOhPCs YouTube Channel",
          url: "https://www.youtube.com/@Kayjayohpcs",
        },
        {
          label: "Micro Center Miami Creator Schedule",
          url: "https://www.microcenter.com/site/mc-news/article/miami-influencer-schedule.aspx?storeID=065",
        },
      ],
    },
  ],
  uiCritique: [
    {
      issue: "Flat dark boxes and tiny monospace text clustered every section of the play page.",
      fix: "Enforce one hero moment per screen, an 8pt spacing scale, and at most two type sizes per section.",
    },
    {
      issue: "Character selection used static letter monograms with no visual personality.",
      fix: "Render live 24x32 animated pixel avatars with idle breathing and blinking frames inside each creator world preview.",
    },
    {
      issue: "Both creators shared the exact same generic runner backdrop and identical player head.",
      fix: "Build distinct creator color worlds and custom desk background props (Carter desk setup vs KayJay car tire PC bench).",
    },
    {
      issue: "Game over screen crowded three equal buttons together without a visual trophy to share.",
      fix: "Render a shareable canvas score card with the pixel avatar, distance, and accent color, paired with one primary action (Run again) and one humble secondary action (Laptop support).",
    },
  ],
  tenBulletPlan: [
    "01. Preserve the editorial paper and ink landing page aesthetic while removing all dashes and banned technical terms from user facing copy.",
    "02. Define strict CSS variable tokens on an 8pt spatial grid with zero CSS gradients, zero glassmorphism, and zero emojis.",
    "03. Build an original 24x32 pixel sprite renderer supporting idle, blink, 6 frame run cycle, jump, and hit states plus an optional avatarSrc override.",
    "04. Craft CarterPCs avatar with dark framed glasses, medium brown hair, clean shaven face, and warm orange hoodie trim.",
    "05. Craft KayJayOhPCs avatar with styled dark hair, trimmed beard, glasses, and acid lime workshop hoodie accents.",
    "06. Redesign the Character Select screen with live idle avatar animations, personal best badges, and 48px minimum thumb zone triggers.",
    "07. Give each creator a distinct runner desk world: Carter gets dual monitors, boom mic, and smart glasses stand; KayJay gets the car tire PC, 360mm radiator, and custom loop reservoir.",
    "08. Keep 60fps runner mechanics (tap to hop, hold for height, input buffering, RAM/PSU/GPU/fan obstacles, day to sunset to RGB night shifts, near miss bonus, neutral Announcer ticker, auto pause).",
    "09. Build a canvas generated shareable score card image on Game Over with one primary action (Run again) and one humble secondary action (Laptop support), keeping Bench Quiz as a bonus mode.",
    "10. Verify AA contrast, keyboard and screen reader semantics, reduced motion support, unit tests, and Playwright verification at 360px mobile and 1440px desktop viewports.",
  ],
};

const BANNED_TERMS = [
  "phone",
  "phones",
  "smartphone",
  "termux",
  "javascript",
  "typescript",
  "python",
  "kotlin",
  "java",
  "golang",
  "rust",
  "c++",
] as const;

export function findCopyViolations(text: string): string[] {
  const issues: string[] = [];
  if (/[-–—]/.test(text)) {
    issues.push("Contains forbidden dash character");
  }
  const lower = text.toLowerCase();
  for (const term of BANNED_TERMS) {
    const escaped = term.replace(/[+]/g, "\\+");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      issues.push(`Contains forbidden term: ${term}`);
    }
  }
  return issues;
}
