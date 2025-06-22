"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronDown, Trash2, Plus, RotateCcw } from "lucide-react"

interface ColorStop {
  color: string
  offset: number
  id: string
}

interface GradientEditorProps {
  onChange: (gradient: string, stops: ColorStop[]) => void
  initialGradient?: string
  initialStops?: ColorStop[]
  className?: string
}

export function InteractiveGradientEditor({
  onChange,
  initialGradient = "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
  initialStops = [
    { color: "#3b82f6", offset: 0, id: "stop-1" },
    { color: "#8b5cf6", offset: 100, id: "stop-2" },
  ],
  className,
}: GradientEditorProps) {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear")
  const [angle, setAngle] = useState(90)
  const [stops, setStops] = useState<ColorStop[]>(initialStops)
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showAngleControl, setShowAngleControl] = useState(false)

  const gradientBarRef = useRef<HTMLDivElement>(null)
  const angleControlRef = useRef<HTMLDivElement>(null)

  // Find the active stop
  const activeStop = stops.find((stop) => stop.id === activeStopId)

  // Generate the gradient string
  const generateGradientString = () => {
    const sortedStops = [...stops].sort((a, b) => a.offset - b.offset)
    const stopsString = sortedStops.map((stop) => `${stop.color} ${stop.offset}%`).join(", ")

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stopsString})`
    } else {
      return `radial-gradient(circle, ${stopsString})`
    }
  }

  // Update the gradient when stops or type changes
  useEffect(() => {
    const gradientString = generateGradientString()
    onChange(gradientString, stops)
  }, [stops, gradientType, angle])

  // Handle click on the gradient bar to add a new stop
  const handleGradientBarClick = (e: React.MouseEvent) => {
    if (isDragging) return

    const rect = gradientBarRef.current?.getBoundingClientRect()
    if (!rect) return

    const offsetPercentage = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))

    // Get color at this position by interpolating between existing stops
    const sortedStops = [...stops].sort((a, b) => a.offset - b.offset)
    let newColor = "#ffffff"

    // Find the stops before and after the click position
    const beforeStop = [...sortedStops].reverse().find((stop) => stop.offset <= offsetPercentage)
    const afterStop = sortedStops.find((stop) => stop.offset >= offsetPercentage)

    if (beforeStop && afterStop && beforeStop.id !== afterStop.id) {
      // Interpolate color between the two stops
      const ratio = (offsetPercentage - beforeStop.offset) / (afterStop.offset - beforeStop.offset)

      // Simple RGB interpolation (could be improved with proper color space conversion)
      const beforeRgb = hexToRgb(beforeStop.color)
      const afterRgb = hexToRgb(afterStop.color)

      if (beforeRgb && afterRgb) {
        const r = Math.round(beforeRgb.r + ratio * (afterRgb.r - beforeRgb.r))
        const g = Math.round(beforeRgb.g + ratio * (afterRgb.g - beforeRgb.g))
        const b = Math.round(beforeRgb.b + ratio * (afterRgb.b - beforeRgb.b))

        newColor = rgbToHex(r, g, b)
      }
    } else if (beforeStop) {
      newColor = beforeStop.color
    } else if (afterStop) {
      newColor = afterStop.color
    }

    const newStop = {
      color: newColor,
      offset: offsetPercentage,
      id: `stop-${Date.now()}`,
    }

    setStops([...stops, newStop])
    setActiveStopId(newStop.id)
  }

  // Handle mouse down on a stop
  const handleStopMouseDown = (e: React.MouseEvent, stopId: string) => {
    e.stopPropagation()
    setActiveStopId(stopId)
    setIsDragging(true)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gradientBarRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetPercentage = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))

      setStops((prevStops) =>
        prevStops.map((stop) => (stop.id === stopId ? { ...stop, offset: offsetPercentage } : stop)),
      )
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Handle touch events for mobile
  const handleStopTouchStart = (e: React.TouchEvent, stopId: string) => {
    e.stopPropagation()
    setActiveStopId(stopId)
    setIsDragging(true)

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = gradientBarRef.current?.getBoundingClientRect()
      if (!rect || !touch) return

      const offsetPercentage = Math.min(100, Math.max(0, ((touch.clientX - rect.left) / rect.width) * 100))

      setStops((prevStops) =>
        prevStops.map((stop) => (stop.id === stopId ? { ...stop, offset: offsetPercentage } : stop)),
      )
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  // Handle angle control interaction
  const handleAngleControlMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const rect = angleControlRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left - centerX
      const y = e.clientY - rect.top - centerY

      // Calculate angle in degrees
      let angle = Math.atan2(y, x) * (180 / Math.PI)
      // Convert to 0-360 range
      angle = (angle + 360) % 360

      setAngle(Math.round(angle))
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Initial calculation
    handleMouseMove(e.nativeEvent)
  }

  // Handle touch events for angle control
  const handleAngleControlTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const rect = angleControlRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return

      const x = touch.clientX - rect.left - centerX
      const y = touch.clientY - rect.top - centerY

      // Calculate angle in degrees
      let angle = Math.atan2(y, x) * (180 / Math.PI)
      // Convert to 0-360 range
      angle = (angle + 360) % 360

      setAngle(Math.round(angle))
    }

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    // Initial calculation
    const touch = e.touches[0]
    if (touch) {
      const x = touch.clientX - rect.left - centerX
      const y = touch.clientY - rect.top - centerY

      let angle = Math.atan2(y, x) * (180 / Math.PI)
      angle = (angle + 360) % 360

      setAngle(Math.round(angle))
    }
  }

  // Add a new stop
  const addStop = () => {
    // Find a good position for the new stop
    const sortedStops = [...stops].sort((a, b) => a.offset - b.offset)
    let maxGap = { start: 0, end: 100, size: 100 }

    for (let i = 0; i < sortedStops.length - 1; i++) {
      const gap = sortedStops[i + 1].offset - sortedStops[i].offset
      if (gap > maxGap.size) {
        maxGap = {
          start: sortedStops[i].offset,
          end: sortedStops[i + 1].offset,
          size: gap,
        }
      }
    }

    const newOffset = maxGap.start + maxGap.size / 2

    // Interpolate color
    const beforeStop = sortedStops.find((stop) => stop.offset === maxGap.start)
    const afterStop = sortedStops.find((stop) => stop.offset === maxGap.end)

    let newColor = "#ffffff"

    if (beforeStop && afterStop) {
      // Interpolate color between the two stops
      const ratio = 0.5 // Middle of the gap

      const beforeRgb = hexToRgb(beforeStop.color)
      const afterRgb = hexToRgb(afterStop.color)

      if (beforeRgb && afterRgb) {
        const r = Math.round(beforeRgb.r + ratio * (afterRgb.r - beforeRgb.r))
        const g = Math.round(beforeRgb.g + ratio * (afterRgb.g - beforeRgb.g))
        const b = Math.round(beforeRgb.b + ratio * (afterRgb.b - beforeRgb.b))

        newColor = rgbToHex(r, g, b)
      }
    } else if (beforeStop) {
      newColor = beforeStop.color
    } else if (afterStop) {
      newColor = afterStop.color
    }

    const newStop = {
      color: newColor,
      offset: newOffset,
      id: `stop-${Date.now()}`,
    }

    setStops([...stops, newStop])
    setActiveStopId(newStop.id)
  }

  // Remove a stop
  const removeStop = (id: string) => {
    if (stops.length <= 2) return // Keep at least 2 stops

    setStops(stops.filter((stop) => stop.id !== id))

    if (activeStopId === id) {
      setActiveStopId(null)
    }
  }

  // Update stop color
  const updateStopColor = (color: string) => {
    if (!activeStopId) return

    setStops(stops.map((stop) => (stop.id === activeStopId ? { ...stop, color } : stop)))
  }

  // Helper functions for color conversion
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant={gradientType === "linear" ? "default" : "outline"}
            size="sm"
            onClick={() => setGradientType("linear")}
          >
            Linear
          </Button>
          <Button
            variant={gradientType === "radial" ? "default" : "outline"}
            size="sm"
            onClick={() => setGradientType("radial")}
          >
            Radial
          </Button>
        </div>

        {gradientType === "linear" && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowAngleControl(!showAngleControl)}>
              Angle: {angle}° <ChevronDown className="ml-1 h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setAngle(90)} title="Reset angle to 90°">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={addStop} disabled={stops.length >= 10}>
          <Plus className="mr-1 h-4 w-4" /> Add Stop
        </Button>
      </div>

      {showAngleControl && gradientType === "linear" && (
        <div
          ref={angleControlRef}
          className="relative w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer"
          onMouseDown={handleAngleControlMouseDown}
          onTouchStart={handleAngleControlTouchStart}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div
            className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-gray-500 origin-left"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className="absolute right-0 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2"></div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div
          ref={gradientBarRef}
          className="h-12 w-full rounded-md cursor-pointer relative"
          style={{ background: generateGradientString() }}
          onClick={handleGradientBarClick}
        >
          {stops.map((stop) => (
            <div
              key={stop.id}
              className={cn(
                "absolute top-0 bottom-0 w-4 h-4 -ml-2 rounded-full border-2 border-white dark:border-gray-800 shadow-md transform -translate-y-1/2 cursor-move",
                activeStopId === stop.id ? "ring-2 ring-primary" : "",
              )}
              style={{
                left: `${stop.offset}%`,
                top: "50%",
                backgroundColor: stop.color,
              }}
              onMouseDown={(e) => handleStopMouseDown(e, stop.id)}
              onTouchStart={(e) => handleStopTouchStart(e, stop.id)}
              onClick={(e) => e.stopPropagation()}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {activeStop && (
            <>
              <div className="flex-1 min-w-[200px]">
                <Label>Color</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: activeStop.color }} />
                        {activeStop.color}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <HexColorPicker color={activeStop.color} onChange={updateStopColor} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Label>Position: {Math.round(activeStop.offset)}%</Label>
                <Slider
                  className="mt-2"
                  min={0}
                  max={100}
                  step={1}
                  value={[activeStop.offset]}
                  onValueChange={(value) => {
                    setStops(stops.map((stop) => (stop.id === activeStop.id ? { ...stop, offset: value[0] } : stop)))
                  }}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeStop(activeStop.id)}
                  disabled={stops.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
