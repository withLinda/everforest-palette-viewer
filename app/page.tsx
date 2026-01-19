import { PaletteViewer } from "@/components/PaletteViewer";
import { getEverforestPalette } from "@/lib/palette";

export default function Home() {
  const palette = getEverforestPalette();
  return <PaletteViewer palette={palette} />;
}
