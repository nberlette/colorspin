"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ColorShade } from "@/types/color"
import { VisionDeficiencySimulator } from "@/lib/accessibility/VisionDeficiency"

interface VisionSimulatorProps {
  colorShades: ColorShade[]
}

export function VisionSimulator({ colorShades }: VisionSimulatorProps) {
  const [activeDeficiencyId, setActiveDeficiencyId] = useState<string>("normal")

  // Get all available deficiencies
  const deficiencies = VisionDeficiencySimulator.deficiencies

  // Apply simulation to all colors in the shade
  const simulatedColorShades = colorShades.map((shade) => ({
    ...shade,
    hex: VisionDeficiencySimulator.simulateDeficiency(shade.hex, activeDeficiencyId),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Vision Deficiency Simulation</CardTitle>
        <CardDescription>
          See how your palette appears to people with different types of color vision deficiencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {deficiencies.map((deficiency) => (
              <Button
                key={deficiency.id}
                variant={activeDeficiencyId === deficiency.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDeficiencyId(deficiency.id)}
                className={
                  deficiency.id === "blurred-vision" && activeDeficiencyId === "blurred-vision" ? "blur-sm" : ""
                }
              >
                {deficiency.name}
              </Button>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">
              {deficiencies.find((d) => d.id === activeDeficiencyId)?.name || "Normal Vision"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {deficiencies.find((d) => d.id === activeDeficiencyId)?.description || "No color vision deficiency"}
            </p>

            <div className={`space-y-4 ${activeDeficiencyId === "blurred-vision" ? "blur-sm" : ""}`}>
              <div className="flex h-16 rounded-lg overflow-hidden">
                {simulatedColorShades.map(({ shade, hex }) => (
                  <div key={shade} className="flex-1" style={{ backgroundColor: hex }} title={`${shade}: ${hex}`} />
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {simulatedColorShades.map(({ shade, hex }) => (
                  <div key={shade} className="flex flex-col items-center p-2 border rounded">
                    <div className="w-12 h-12 rounded mb-2" style={{ backgroundColor: hex }} />
                    <div className="text-xs font-medium">{shade}</div>
                    <div className="text-xs font-mono">{hex}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Text Sample</h4>
                  <div className="space-y-2">
                    {[900, 800, 700, 600, 500].map((shade) => {
                      const bgColor = simulatedColorShades.find((s) => s.shade === 50)?.hex || "#FFFFFF"
                      const textColor = simulatedColorShades.find((s) => s.shade === shade)?.hex || "#000000"
                      return (
                        <div key={shade} className="p-2 rounded" style={{ backgroundColor: bgColor, color: textColor }}>
                          <p className="text-sm">Text with {shade} on 50 background</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="border rounded-lg p-3">
                  <h4 className="text-sm font-medium mb-2">Button Sample</h4>
                  <div className="space-y-2">
                    {[500, 600, 700, 800, 900].map((shade) => {
                      const bgColor = simulatedColorShades.find((s) => s.shade === shade)?.hex || "#000000"
                      const textColor = simulatedColorShades.find((s) => s.shade === 50)?.hex || "#FFFFFF"
                      return (
                        <div
                          key={shade}
                          className="p-2 rounded text-center"
                          style={{ backgroundColor: bgColor, color: textColor }}
                        >
                          <p className="text-sm">Button with {shade} background</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
