"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import type { ColorSet } from "@/types/color"
import { useToast } from "@/components/ui/use-toast"

interface ColorShadeDisplayProps {
  colorSet?: ColorSet
}

export function ColorShadeDisplay({ colorSet }: ColorShadeDisplayProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const { toast } = useToast()

  if (!colorSet || !colorSet.shades || colorSet.shades.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg">
        <p className="text-muted-foreground">No color shades available</p>
      </div>
    )
  }

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast({
      title: "Copied to clipboard",
      description: `${hex} has been copied to your clipboard.`,
      duration: 1000,
    })

    setTimeout(() => {
      setCopiedHex(null)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Color Shades</h3>

      <div className="h-24 rounded-lg overflow-hidden flex animate-in fade-in slide-in-from-bottom-4 duration-300 hover:shadow-lg transition-shadow">
        {colorSet.shades.map(({ shade, hex }, index) => (
          <div
            key={shade}
            className="flex-1 animate-in fade-in duration-300"
            style={{
              backgroundColor: hex,
              animationDelay: `${index * 50}ms`,
            }}
            title={`${shade}: ${hex}`}
          />
        ))}
      </div>

      <div className="space-y-2 animate-in fade-in duration-500">
        {colorSet.shades.map(({ shade, hex, hue, saturation, lightness }, index) => (
          <div
            key={shade}
            className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 animate-in fade-in slide-in-from-right-4 hover:scale-[1.01] hover:translate-x-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-10 h-10 rounded mr-4 transition-colors duration-300" style={{ backgroundColor: hex }} />
            <div className="font-bold text-lg w-10">{shade}</div>
            <div
              className="font-mono text-sm cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform"
              onClick={() => copyToClipboard(hex)}
            >
              {hex}
              {copiedHex === hex ? (
                <div className="animate-in zoom-in duration-200">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
              ) : (
                <Copy className="h-3 w-3 opacity-50" />
              )}
            </div>
            <div className="ml-auto grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500">H {hue}</div>
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-primary transition-all duration-300"
                    style={{ width: `${(hue / 360) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500">S {saturation}</div>
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-primary transition-all duration-300"
                    style={{ width: `${saturation}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500">L {lightness}</div>
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-primary transition-all duration-300"
                    style={{ width: `${lightness}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
