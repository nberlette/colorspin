"use client"

import { ColorPaletteGenerator } from "@/components/color-palette/ColorPaletteGenerator"
import { ColorPaletteProvider } from "@/context/ColorPaletteContext"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <ColorPaletteProvider>
        <ColorPaletteGenerator />
      </ColorPaletteProvider>
    </main>
  )
}
