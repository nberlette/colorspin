"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ColorHarmony } from "@/types/color"
import { ColorHarmonyGenerator } from "@/lib/color/ColorHarmony"
import { useToast } from "@/components/ui/use-toast"

interface HarmonyPatternsProps {
  baseColor: string
  onAddColorSet: (color: string) => void
}

export function HarmonyPatterns({ baseColor, onAddColorSet }: HarmonyPatternsProps) {
  const { toast } = useToast()
  const harmonies = ColorHarmonyGenerator.getAllHarmonies(baseColor)

  const handleAddColor = (color: string) => {
    onAddColorSet(color)
    toast({
      title: "Color Added",
      description: `New color set created with base color: ${color}`,
      duration: 1500,
    })
  }

  const handleAddAllColors = (harmony: ColorHarmony) => {
    harmony.colors.forEach((color) => {
      if (color !== baseColor) {
        onAddColorSet(color)
      }
    })

    toast({
      title: "Harmony Added",
      description: `Added ${harmony.name} colors to your palette`,
      duration: 1500,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {harmonies.map((harmony, index) => (
        <div
          key={harmony.name}
          className="border rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 hover:-translate-y-1 hover:shadow-xl transition-all"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="p-4">
            <h3 className="font-bold text-lg">{harmony.name}</h3>
            <p className="text-sm text-gray-500">{harmony.description}</p>
          </div>

          <div className="flex h-16">
            {harmony.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="flex-1 relative group" style={{ backgroundColor: color }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <Button variant="secondary" size="sm" className="text-xs" onClick={() => handleAddColor(color)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
            <div className="flex gap-2">
              {harmony.colors.map((color, colorIndex) => (
                <div key={colorIndex} className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono">{color}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-transparent"
              onClick={() => handleAddAllColors(harmony)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add All
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
