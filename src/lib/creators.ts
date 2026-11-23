export type CreatorSlug = "carterpcs" | "kayjayohpcs";

export type PixelLookConfig = {
  skin: string;
  skinShadow: string;
  cheekTint: string;
  hair: string;
  hairHighlight: string;
  browColor: string;
  eyeColor: string;
  lipColor: string;
  hairStyle: "carter" | "kayjay";
  beard: boolean;
  beardColor: string;
  glasses: boolean;
  glassesFrame: string;
  glassesLens: string;
  hoodieMain: string;
  hoodieShade: string;
  hoodieAccent: string;
  pants: string;
  shoes: string;
  shoeAccent: string;
};

export type WorldZonePalette = {
  skyTop: string;
  skyBand: string;
  farProp: string;
  midProp: string;
  deskSurface: string;
  deskEdge: string;
  traceLine: string;
  obstacleMain: string;
  obstacleShade: string;
  ledAccent: string;
  starAlpha: number;
};

export type CreatorWorldConfig = {
  worldName: string;
  deskSubtitle: string;
  propNames: readonly string[];
  zones: readonly [WorldZonePalette, WorldZonePalette, WorldZonePalette];
};

export type CreatorProfile = {
  slug: CreatorSlug;
  name: string;
  handle: string;
  platform: "TikTok";
  profileUrl: string;
  youtubeUrl: string;
  contextUrl: string;
  businessEmail: string;
  category: string;
  initial: string;
  label: string;
  tagline: string;
  modeTitle: string;
  modeDescription: string;
  description: string;
  variant: "orange" | "lime";
  accentHex: string;
  avatarSrc?: string;
  pixelLook: PixelLookConfig;
  world: CreatorWorldConfig;
};

export const creatorProfiles: Record<CreatorSlug, CreatorProfile> = {
  carterpcs: {
    slug: "carterpcs",
    name: "CarterPCs",
    handle: "@carterpcs",
    platform: "TikTok",
    profileUrl: "https://www.tiktok.com/@carterpcs",
    youtubeUrl: "https://www.youtube.com/@CarterPCs",
    contextUrl:
      "https://www.microcenter.com/site/mc-news/article/miami-influencer-schedule.aspx?storeID=065",
    businessEmail: "Carterpcs@rakugomedia.com",
    category: "EVERYDAY TECH AND BUILDS",
    initial: "C",
    label: "CREATOR EDITION 01",
    tagline: "Desk clear. Boost clocks up. Dodge the bottlenecks.",
    modeTitle: "Tech Quickfire",
    modeDescription:
      "Fast hardware calls on storage, memory, cooling, and everyday PC troubleshooting.",
    description:
      "Sprint across Carter's dual monitor desk setup past loose RAM sticks, PSU bricks, and case fans.",
    variant: "orange",
    accentHex: "#ed643d",
    avatarSrc: undefined,
    pixelLook: {
      skin: "#f3c7a4",
      skinShadow: "#d9a27b",
      cheekTint: "#e89f86",
      hair: "#5b3b26",
      hairHighlight: "#7d5439",
      browColor: "#3e2718",
      eyeColor: "#365c7d",
      lipColor: "#c47964",
      hairStyle: "carter",
      beard: false,
      beardColor: "#3b271a",
      glasses: false,
      glassesFrame: "#151914",
      glassesLens: "#7ab8d9",
      hoodieMain: "#232823",
      hoodieShade: "#151914",
      hoodieAccent: "#ed643d",
      pants: "#2c3540",
      shoes: "#f2efe7",
      shoeAccent: "#ed643d",
    },
    world: {
      worldName: "THE EVERYDAY DESK",
      deskSubtitle: "Dual monitors, boom mic, smart glasses stand",
      propNames: ["DUAL MONITORS", "SMART GLASSES STAND", "BOOM ARM MIC", "APP DOCK SCREEN"],
      zones: [
        {
          skyTop: "#f2efe7",
          skyBand: "#e2ded2",
          farProp: "#c8c3b4",
          midProp: "#aba696",
          deskSurface: "#151914",
          deskEdge: "#ed643d",
          traceLine: "#ed643d",
          obstacleMain: "#293029",
          obstacleShade: "#151914",
          ledAccent: "#ed643d",
          starAlpha: 0,
        },
        {
          skyTop: "#362028",
          skyBand: "#7d372b",
          farProp: "#5c2826",
          midProp: "#421c1e",
          deskSurface: "#171114",
          deskEdge: "#f59e6c",
          traceLine: "#ed643d",
          obstacleMain: "#f2efe7",
          obstacleShade: "#171114",
          ledAccent: "#ffb885",
          starAlpha: 0.35,
        },
        {
          skyTop: "#0c100d",
          skyBand: "#172019",
          farProp: "#1e2920",
          midProp: "#28362a",
          deskSurface: "#090c09",
          deskEdge: "#ed643d",
          traceLine: "#d9ff70",
          obstacleMain: "#d8dfd2",
          obstacleShade: "#090c09",
          ledAccent: "#ed643d",
          starAlpha: 1,
        },
      ],
    },
  },
  kayjayohpcs: {
    slug: "kayjayohpcs",
    name: "KayJayOhPCs",
    handle: "@kayjayohpcs",
    platform: "TikTok",
    profileUrl: "https://www.tiktok.com/@kayjayohpcs",
    youtubeUrl: "https://www.youtube.com/@Kayjayohpcs",
    contextUrl:
      "https://www.microcenter.com/site/mc-news/article/miami-influencer-schedule.aspx?storeID=065",
    businessEmail: "kayjayohpcs@gmail.com",
    category: "CUSTOM BUILDS AND LABS",
    initial: "K",
    label: "CREATOR EDITION 02",
    tagline: "Build inside the impossible. Keep the thermals clean.",
    modeTitle: "Odd Build Lab",
    modeDescription:
      "Solve the clearance, airflow, radiator fit, and power calls behind unconventional PC builds.",
    description:
      "Run KayJay's custom build bench past the car tire PC enclosure, 360mm radiators, and hefty GPUs.",
    variant: "lime",
    accentHex: "#d9ff70",
    avatarSrc: undefined,
    pixelLook: {
      skin: "#d89e74",
      skinShadow: "#b87e56",
      cheekTint: "#c68564",
      hair: "#1a1614",
      hairHighlight: "#3a322d",
      browColor: "#151210",
      eyeColor: "#3b2c22",
      lipColor: "#9c624b",
      hairStyle: "kayjay",
      beard: true,
      beardColor: "#1a1614",
      glasses: false,
      glassesFrame: "#151914",
      glassesLens: "#a4e8c2",
      hoodieMain: "#1c241e",
      hoodieShade: "#111612",
      hoodieAccent: "#d9ff70",
      pants: "#252b27",
      shoes: "#151914",
      shoeAccent: "#d9ff70",
    },
    world: {
      worldName: "THE ODD BUILD LAB",
      deskSubtitle: "Car tire PC rig, 360mm radiator stack, loop reservoir",
      propNames: ["CAR TIRE PC RIG", "360MM RADIATOR", "LOOP RESERVOIR", "PARTS TEST BENCH"],
      zones: [
        {
          skyTop: "#e9e6dc",
          skyBand: "#dad6c8",
          farProp: "#bfbba9",
          midProp: "#9e9a89",
          deskSurface: "#151914",
          deskEdge: "#d9ff70",
          traceLine: "#d9ff70",
          obstacleMain: "#293029",
          obstacleShade: "#151914",
          ledAccent: "#d9ff70",
          starAlpha: 0,
        },
        {
          skyTop: "#242c1e",
          skyBand: "#44542e",
          farProp: "#313d22",
          midProp: "#222b18",
          deskSurface: "#111610",
          deskEdge: "#d9ff70",
          traceLine: "#ed643d",
          obstacleMain: "#f2efe7",
          obstacleShade: "#111610",
          ledAccent: "#d9ff70",
          starAlpha: 0.4,
        },
        {
          skyTop: "#070b08",
          skyBand: "#111c14",
          farProp: "#17281c",
          midProp: "#203827",
          deskSurface: "#060907",
          deskEdge: "#d9ff70",
          traceLine: "#d9ff70",
          obstacleMain: "#dce3d5",
          obstacleShade: "#060907",
          ledAccent: "#d9ff70",
          starAlpha: 1,
        },
      ],
    },
  },
};

export const creatorRoster: readonly CreatorProfile[] = [
  creatorProfiles.carterpcs,
  creatorProfiles.kayjayohpcs,
];
