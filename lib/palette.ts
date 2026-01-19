import fs from "node:fs";
import path from "node:path";

export type Variant = "dark" | "light";
export type Contrast = "hard" | "medium" | "soft";
export type Palette2Group = "default" | "accents" | "greys" | "statusline";

export type Palette1Rows = {
  hard: { rows: string[][] };
  medium: { rows: string[][] };
  soft: { rows: string[][] };
};

export type Palette2Groups = {
  default: string[];
  accents: string[];
  greys: string[];
  statusline: string[];
};

export type VariantPalette = {
  palette1: Palette1Rows;
  palette2: Palette2Groups;
};

export type EverforestPalette = {
  dark: VariantPalette;
  light: VariantPalette;
};

const HEX_SWATCH_RE = /!\[#([0-9A-Fa-f]{6})\]/g;

let cachedPalette: EverforestPalette | null = null;

function emptyVariantPalette(): VariantPalette {
  return {
    palette1: {
      hard: { rows: [] },
      medium: { rows: [] },
      soft: { rows: [] },
    },
    palette2: {
      default: [],
      accents: [],
      greys: [],
      statusline: [],
    },
  };
}

function normalizeHex(hex: string): string {
  return `#${hex.toUpperCase()}`;
}

function extractHexes(line: string): string[] {
  const hexes: string[] = [];
  for (const match of line.matchAll(HEX_SWATCH_RE)) {
    hexes.push(normalizeHex(match[1]));
  }
  return hexes;
}

function resolvePalettePath(): string {
  const inProjectRoot = path.resolve(process.cwd(), "palette.md");
  if (fs.existsSync(inProjectRoot)) return inProjectRoot;

  const legacyParent = path.resolve(process.cwd(), "..", "palette.md");
  return legacyParent;
}

export function getEverforestPalette(): EverforestPalette {
  if (cachedPalette) return cachedPalette;

  const palettePath = resolvePalettePath();
  if (!fs.existsSync(palettePath)) {
    const attempted = [
      path.resolve(process.cwd(), "palette.md"),
      path.resolve(process.cwd(), "..", "palette.md"),
    ];
    throw new Error(`palette.md not found. Tried: ${attempted.join(", ")}`);
  }

  const content = fs.readFileSync(palettePath, "utf8");
  const lines = content.split(/\r?\n/);

  const palette: EverforestPalette = {
    dark: emptyVariantPalette(),
    light: emptyVariantPalette(),
  };

  let currentVariant: Variant | null = null;
  let currentSection: "palette1" | "palette2" | null = null;
  let currentContrast: Contrast | null = null;
  let currentPalette2Group: Palette2Group | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("## Highlights")) break;

    if (line.startsWith("### Dark")) {
      currentVariant = "dark";
      currentSection = null;
      currentContrast = null;
      currentPalette2Group = null;
      continue;
    }

    if (line.startsWith("### Light")) {
      currentVariant = "light";
      currentSection = null;
      currentContrast = null;
      currentPalette2Group = null;
      continue;
    }

    if (line.startsWith("#### Background Colors (palette1)")) {
      currentSection = "palette1";
      currentContrast = null;
      currentPalette2Group = null;
      continue;
    }

    if (line.startsWith("#### Foreground Colors (palette2)")) {
      currentSection = "palette2";
      currentContrast = null;
      currentPalette2Group = null;
      continue;
    }

    const subMatch = line.match(/^<sub>([^<]+)<\/sub>$/i);
    if (subMatch && currentVariant && currentSection === "palette1") {
      const value = subMatch[1].toLowerCase();
      if (value === "hard" || value === "medium" || value === "soft") {
        currentContrast = value;
      }
      continue;
    }

    if (subMatch && currentVariant && currentSection === "palette2") {
      const value = subMatch[1].toLowerCase();
      if (
        value === "default" ||
        value === "accents" ||
        value === "greys" ||
        value === "statusline"
      ) {
        currentPalette2Group = value;
      }
      continue;
    }

    if (!currentVariant || !currentSection) continue;
    if (!line.includes("![#")) continue;

    const hexes = extractHexes(line);
    if (hexes.length === 0) continue;

    if (currentSection === "palette1") {
      if (!currentContrast) continue;
      palette[currentVariant].palette1[currentContrast].rows.push(hexes);
      continue;
    }

    if (currentSection === "palette2") {
      if (!currentPalette2Group) continue;
      palette[currentVariant].palette2[currentPalette2Group].push(...hexes);
      continue;
    }
  }

  cachedPalette = palette;
  return palette;
}
