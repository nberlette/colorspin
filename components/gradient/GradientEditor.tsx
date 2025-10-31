"use client"

import type React from "react"

import { useState, useRef } from "react"
import { HexColorPicker } from "react-colorful"
import { Copy, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { ColorShade } from "@/types/color"
import type { Gradient, GradientStop } from "@/types/gradient"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface GradientEditorProps {
  colorShades: ColorShade[]
  gradients: Gradient[]
  activeGradient: Gradient
  onUpdateGradient: (updates: Partial<Gradient>) => void
  onAddGradient: () => void
  onDeleteGradient: (id: string) => void
  onAddStop: (color: string, position: number) => string
  onRemoveStop: (stopId: string) => boolean
  onUpdateStop: (stopId: string, updates: Partial<GradientStop>) => void
  getGradientCSS: () => string
}

function generateGradientName(gradient: Gradient): string {
  if (gradient.stops.length === 0) return "Empty Gradient"

  // Sort stops by position
  const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position)

  // Get color names (simplified - just use hex for now)
  const colorNames = sortedStops.map((stop) => stop.color)

  // Create descriptive name based on number of stops
  if (colorNames.length === 2) {
    return `${colorNames[0]} to ${colorNames[1]}`
  } else if (colorNames.length === 3) {
    return `${colorNames[0]} to ${colorNames[2]}, via ${colorNames[1]}`
  } else {
    return `${colorNames[0]} to ${colorNames[colorNames.length - 1]} (${colorNames.length} stops)`
  }
}

export function GradientEditor({
  colorShades,
  gradients,
  activeGradient,
  onUpdateGradient,
  onAddGradient,
  onDeleteGradient,
  onAddStop,
  onRemoveStop,
  onUpdateStop,
  getGradientCSS,
}: GradientEditorProps) {
  const { toast } = useToast()
  const [isDraggingStop, setIsDraggingStop] = useState(false)
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const gradientPreviewRef = useRef<HTMLDivElement>(null)

  const [isNamingDialogOpen, setIsNamingDialogOpen] = useState(false)
  const [gradientName, setGradientName] = useState("")

  // Find the active stop
  const activeStop = activeGradient.stops.find((stop) => stop.id === activeStopId)

  // Handle gradient stop dragging
  const handleStopMouseDown = (e: React.MouseEvent, stopId: string) => {
    e.preventDefault()
    setIsDraggingStop(true)
    setActiveStopId(stopId)

    const handleMouseMove = (e: MouseEvent) => {
      if (!gradientPreviewRef.current) return

      const rect = gradientPreviewRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width

      // Calculate position as percentage (clamped between 0-100)
      const position = Math.max(0, Math.min(100, (x / width) * 100))

      onUpdateStop(stopId, { position })
    }

    const handleMouseUp = () => {
      setIsDraggingStop(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Handle gradient bar click to add a new stop
  const handleGradientBarClick = (e: React.MouseEvent) => {
    if (isDraggingStop || !gradientPreviewRef.current) return

    const rect = gradientPreviewRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    // Calculate position as percentage
    const position = Math.max(0, Math.min(100, (x / width) * 100))

    const newColor = colorShades && colorShades.length > 4 ? colorShades[4].hex : "#808080"

    const newStopId = onAddStop(newColor, position)
    setActiveStopId(newStopId)
  }

  // Handle angle adjustment for linear gradients
  const handleAngleAdjustment = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeGradient.type !== "linear" || !gradientPreviewRef.current) return

    const rect = gradientPreviewRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate angle based on mouse position relative to center
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY
    const angle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360

    onUpdateGradient({ angle })
  }

  // Copy gradient CSS to clipboard
  const copyGradientCSS = () => {
    const css = getGradientCSS()
    navigator.clipboard.writeText(css)
    toast({
      title: "Copied to clipboard",
      description: "Gradient CSS has been copied to your clipboard",
      duration: 1500,
    })
  }

  const handleSaveGradient = () => {
    // Generate default name
    const defaultName = generateGradientName(activeGradient)
    setGradientName(defaultName)
    setIsNamingDialogOpen(true)
  }

  const confirmSaveGradient = () => {
    // Update gradient name before saving
    onUpdateGradient({ name: gradientName })
    onAddGradient()
    setIsNamingDialogOpen(false)

    toast({
      title: "Gradient Saved",
      description: `"${gradientName}" has been added to your collection`,
      duration: 1500,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gradient Generator</CardTitle>
          <CardDescription>Create beautiful gradients from your palette colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <Select
              value={activeGradient.type}
              onValueChange={(value: "linear" | "radial") => onUpdateGradient({ type: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
              </SelectContent>
            </Select>

            {activeGradient.type === "linear" && (
              <div className="flex items-center gap-2">
                <Label htmlFor="angle" className="text-sm">
                  Angle:
                </Label>
                <Input
                  id="angle"
                  type="number"
                  min="0"
                  max="360"
                  value={activeGradient.angle}
                  onChange={(e) => onUpdateGradient({ angle: Number.parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
                <span className="text-sm">degrees</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newColor = colorShades && colorShades.length > 1 ? colorShades[1].hex : "#FFFFFF"
                onAddStop(newColor, 50)
              }}
              className="ml-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Stop
            </Button>
          </div>

          {/* Interactive gradient preview */}
          <div
            ref={gradientPreviewRef}
            className="h-32 rounded-lg mb-4 relative cursor-pointer"
            style={{ background: getGradientCSS() }}
            onClick={activeGradient.type === "linear" ? handleAngleAdjustment : handleGradientBarClick}
          >
            {/* Gradient stops */}
            {activeGradient.stops.map((stop) => (
              <div
                key={stop.id}
                className={`absolute bottom-0 w-4 h-4 bg-white border border-gray-400 rounded-full -translate-x-1/2 translate-y-1/2 cursor-move hover:scale-125 transition-transform ${
                  stop.id === activeStopId ? "ring-2 ring-primary" : ""
                }`}
                style={{ left: `${stop.position}%`, backgroundColor: stop.color }}
                onMouseDown={(e) => handleStopMouseDown(e, stop.id)}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveStopId(stop.id)
                }}
                title={`${stop.color} at ${stop.position}%`}
              />
            ))}

            {/* Angle indicator for linear gradients */}
            {activeGradient.type === "linear" && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                title={`${activeGradient.angle}°`}
              >
                <div className="relative w-16 h-16">
                  <div
                    className="absolute w-1 h-16 bg-white/50 rounded-full left-1/2 top-0 -translate-x-1/2 origin-bottom"
                    style={{ transform: `rotate(${activeGradient.angle}deg)` }}
                  />
                  <div
                    className="absolute w-4 h-4 bg-white border-2 border-black dark:border-white rounded-full left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotate(0deg) translate(0, 0) rotate(${activeGradient.angle}deg) translate(0, -32px)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Color Stops</h4>
            {activeGradient.stops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: stop.color }} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="font-mono text-xs bg-transparent">
                      {stop.color}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <HexColorPicker color={stop.color} onChange={(color) => onUpdateStop(stop.id, { color })} />
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`position-${stop.id}`} className="text-xs w-16">
                      Position:
                    </Label>
                    <Slider
                      id={`position-${stop.id}`}
                      value={[stop.position]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => onUpdateStop(stop.id, { position: value[0] })}
                    />
                    <span className="text-xs w-8">{Math.round(stop.position)}%</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveStop(stop.id)}
                  className="text-gray-500 hover:text-red-500"
                  disabled={activeGradient.stops.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={copyGradientCSS} variant="secondary" size="sm">
              <Copy className="h-4 w-4 mr-1" />
              Copy CSS
            </Button>
            <Button onClick={handleSaveGradient} variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Save Gradient
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNamingDialogOpen} onOpenChange={setIsNamingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Gradient</DialogTitle>
            <DialogDescription>Give your gradient a memorable name to easily identify it later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gradient-name">Gradient Name</Label>
              <Input
                id="gradient-name"
                value={gradientName}
                onChange={(e) => setGradientName(e.target.value)}
                placeholder="Enter gradient name"
              />
            </div>
            <div className="h-16 rounded-lg" style={{ background: getGradientCSS() }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNamingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSaveGradient} disabled={!gradientName.trim()}>
              Save Gradient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {gradients.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Saved Gradients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradients.map((gradient) => (
              <motion.div
                key={gradient.id}
                className="border rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              >
                <div
                  className="h-24"
                  style={{
                    background:
                      gradient.type === "linear"
                        ? `linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
                        : `radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`,
                  }}
                />
                <div className="p-3 bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium text-sm mb-1 truncate" title={gradient.name}>
                    {gradient.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {gradient.type === "linear" ? (
                        <span>
                          {gradient.angle}° linear, {gradient.stops.length} stops
                        </span>
                      ) : (
                        <span>Radial, {gradient.stops.length} stops</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const css =
                            gradient.type === "linear"
                              ? `linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
                              : `radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`

                          navigator.clipboard.writeText(css)
                          toast({
                            title: "Copied to clipboard",
                            description: "Gradient CSS has been copied",
                            duration: 1500,
                          })
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => onDeleteGradient(gradient.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
