"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { applyColorVisionDeficiency } from "@/lib/color-vision-deficiency"

type VisionType =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "protanomaly"
  | "deuteranomaly"
  | "tritanomaly"
  | "achromatopsia"
  | "achromatomaly"
  | "lowContrast"
  | "blurredVision"

interface ColorVisionSimulatorProps {
  colors: string[]
  className?: string
}

export function ColorVisionSimulator({ colors, className }: ColorVisionSimulatorProps) {
  const [visionType, setVisionType] = useState<VisionType>("normal")
  const [simulatedColors, setSimulatedColors] = useState<string[]>(colors)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const visionTypes: { id: VisionType; name: string; description: string }[] = [
    { id: "normal", name: "Normal Vision", description: "No color vision deficiency" },
    { id: "protanopia", name: "Protanopia", description: "Red-blind (1% of males)" },
    { id: "deuteranopia", name: "Deuteranopia", description: "Green-blind (1% of males)" },
    { id: "tritanopia", name: "Tritanopia", description: "Blue-blind (rare)" },
    { id: "protanomaly", name: "Protanomaly", description: "Red-weak (1% of males)" },
    { id: "deuteranomaly", name: "Deuteranomaly", description: "Green-weak (5% of males)" },
    { id: "tritanomaly", name: "Tritanomaly", description: "Blue-weak (rare)" },
    { id: "achromatopsia", name: "Achromatopsia", description: "Complete color blindness" },
    { id: "achromatomaly", name: "Achromatomaly", description: "Partial color blindness" },
    { id: "lowContrast", name: "Low Contrast", description: "Reduced contrast sensitivity" },
    { id: "blurredVision", name: "Blurred Vision", description: "Reduced visual acuity" },
  ]

  useEffect(() => {
    if (visionType === "normal") {
      setSimulatedColors(colors)
      return
    }

    // Apply the selected vision deficiency simulation to each color
    const newSimulatedColors = colors.map((color) => applyColorVisionDeficiency(color, visionType))

    setSimulatedColors(newSimulatedColors)
  }, [colors, visionType])

  useEffect(() => {
    // Render the color palette on canvas for special effects like blur
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const colorWidth = width / simulatedColors.length

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw color blocks
    simulatedColors.forEach((color, index) => {
      ctx.fillStyle = color
      ctx.fillRect(index * colorWidth, 0, colorWidth, height)
    })

    // Apply special effects
    if (visionType === "blurredVision") {
      // Apply blur effect
      ctx.filter = "blur(4px)"
      ctx.drawImage(canvas, 0, 0)
      ctx.filter = "none"
    } else if (visionType === "lowContrast") {
      // Apply low contrast effect
      ctx.fillStyle = "rgba(128, 128, 128, 0.5)"
      ctx.globalCompositeOperation = "overlay"
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"
    }
  }, [simulatedColors, visionType])

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <Label>Vision Simulation</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {visionTypes.map((type) => (
            <Button
              key={type.id}
              variant={visionType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setVisionType(type.id)}
              title={type.description}
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Simulated Color Palette</Label>
        <div className="relative h-16 w-full rounded-md overflow-hidden">
          <canvas ref={canvasRef} width={500} height={100} className="absolute inset-0 w-full h-full" />

          {/* Fallback for canvas */}
          <div className="absolute inset-0 flex">
            {simulatedColors.map((color, index) => (
              <div key={index} className="flex-1 h-full" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          This simulation helps you understand how your color palette might appear to people with different types of
          color vision deficiencies. Approximately 8% of men and 0.5% of women have some form of color vision
          deficiency.
        </p>
      </div>
    </div>
  )
}
