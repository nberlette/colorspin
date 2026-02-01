"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import type { ColorSet } from "@/types/color"
import { ColorManipulator } from "@/lib/color/ColorManipulator"

interface ColorSetEditorProps {
  colorSet: ColorSet
  onChange: (updatedSet: ColorSet) => void
}

export function ColorSetEditor({ colorSet, onChange }: ColorSetEditorProps) {
  const [inputValue, setInputValue] = useState(colorSet.baseColor)
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [vibrancy, setVibrancy] = useState(colorSet.vibrancy)
  const [hueShift, setHueShift] = useState(colorSet.hueShift)

  // Update local state when colorSet changes
  useEffect(() => {
    setInputValue(colorSet.baseColor)
    setVibrancy(colorSet.vibrancy)
    setHueShift(colorSet.hueShift)
  }, [colorSet])

  const handleBaseColorChange = (color: string) => {
    onChange({
      ...colorSet,
      baseColor: color,
    })
  }

  const handleVibrancyChange = (value: number[]) => {
    const newVibrancy = value[0]
    setVibrancy(newVibrancy)
  }

  const handleVibrancyCommit = () => {
    onChange({
      ...colorSet,
      vibrancy,
    })
  }

  const handleHueShiftChange = (value: number[]) => {
    const newHueShift = value[0]
    setHueShift(newHueShift)
  }

  const handleHueShiftCommit = () => {
    onChange({
      ...colorSet,
      hueShift,
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...colorSet,
      name: e.target.value,
    })
  }

  const handleInputBlur = () => {
    // Validate and format hex value
    const formattedHex = ColorManipulator.formatHexValue(inputValue, colorSet.baseColor)
    setInputValue(formattedHex)
    handleBaseColorChange(formattedHex)
  }

  const randomizeColor = () => {
    // Set randomizing state for animation
    setIsRandomizing(true)

    // Generate a random color
    const newColor = ColorManipulator.generateRandomColor()
    setInputValue(newColor)
    handleBaseColorChange(newColor)

    // Reset randomizing state after animation
    setTimeout(() => {
      setIsRandomizing(false)
    }, 500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-4 border p-4 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Base Color</h3>
            <Input
              value={colorSet.name}
              onChange={handleNameChange}
              className="h-7 w-32 text-sm"
              placeholder="Color name"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="hover:scale-105 active:scale-95 transition-transform">
              <Button
                variant="outline"
                size="sm"
                onClick={randomizeColor}
                className="text-xs bg-transparent"
                disabled={isRandomizing}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRandomizing ? "animate-spin" : ""}`} />
                Randomize
              </Button>
            </div>
            <div
              className="w-8 h-8 rounded transition-colors duration-300"
              style={{ backgroundColor: colorSet.baseColor }}
            />
          </div>
        </div>

        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
          <HexColorPicker
            color={colorSet.baseColor}
            onChange={handleBaseColorChange}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded transition-colors duration-300"
            style={{ backgroundColor: colorSet.baseColor }}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              // Always update the input value as the user types
              setInputValue(e.target.value)
            }}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              // When the user presses Enter, update the color
              if (e.key === "Enter") {
                handleInputBlur()
                e.currentTarget.blur()
              }
            }}
            className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="#RRGGBB"
          />
        </div>
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
        <div className="space-y-2 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Vibrancy</label>
            <span className="text-sm text-gray-500">{vibrancy}%</span>
          </div>
          <Slider
            value={[vibrancy]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVibrancyChange}
            onValueCommit={handleVibrancyCommit}
            className="transition-all duration-150 ease-out"
          />
        </div>

        <div className="space-y-2 hover:scale-[1.01] transition-transform">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Hue Shift</label>
            <span className="text-sm text-gray-500">{hueShift}°</span>
          </div>
          <Slider
            value={[hueShift]}
            min={-180}
            max={180}
            step={1}
            onValueChange={handleHueShiftChange}
            onValueCommit={handleHueShiftCommit}
            className="transition-all duration-150 ease-out"
          />
        </div>
      </div>
    </div>
  )
}
