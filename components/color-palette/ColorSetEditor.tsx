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
import { motion } from "framer-motion"

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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="space-y-4 border p-4 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={randomizeColor} className="text-xs" disabled={isRandomizing}>
                <RefreshCw className={`h-3 w-3 mr-1 ${isRandomizing ? "animate-spin" : ""}`} />
                Randomize
              </Button>
            </motion.div>
            <motion.div
              className="w-8 h-8 rounded"
              style={{ backgroundColor: colorSet.baseColor }}
              animate={{ backgroundColor: colorSet.baseColor }}
              transition={{ duration: 0.3 }}
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
          <motion.div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: colorSet.baseColor }}
            animate={{ backgroundColor: colorSet.baseColor }}
            transition={{ duration: 0.3 }}
          />
          <motion.input
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
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div
          className="space-y-2"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex justify-between">
            <label className="text-sm font-medium">Vibrancy</label>
            <motion.span
              className="text-sm text-gray-500"
              animate={{
                x: vibrancy === 50 ? [0, 5, -5, 5, -5, 0] : 0,
                transition: { duration: vibrancy === 50 ? 0.5 : 0 },
              }}
            >
              {vibrancy}%
            </motion.span>
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
        </motion.div>

        <motion.div
          className="space-y-2"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex justify-between">
            <label className="text-sm font-medium">Hue Shift</label>
            <motion.span
              className="text-sm text-gray-500"
              animate={{
                x: hueShift === 0 ? [0, 5, -5, 5, -5, 0] : 0,
                transition: { duration: hueShift === 0 ? 0.5 : 0 },
              }}
            >
              {hueShift}°
            </motion.span>
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
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
