import type { Gradient, GradientStop } from "@/types/gradient"
import { ColorManipulator } from "../color/ColorManipulator"

export class GradientGenerator {
  /**
   * Generate a CSS string for a gradient
   */
  static generateCssString(gradient: Gradient): string {
    const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position)
    const stopsString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")

    if (gradient.type === "linear") {
      return `linear-gradient(${gradient.angle}deg, ${stopsString})`
    } else {
      return `radial-gradient(circle, ${stopsString})`
    }
  }

  /**
   * Create a new gradient with default stops
   */
  static createGradient(id: string, name = "New Gradient"): Gradient {
    return {
      id,
      name,
      type: "linear",
      stops: [
        { id: `stop-${Date.now()}-1`, color: "#3B82F6", position: 0 },
        { id: `stop-${Date.now()}-2`, color: "#8B5CF6", position: 100 },
      ],
      angle: 90,
    }
  }

  /**
   * Create a gradient from color shades
   */
  static createFromShades(id: string, colors: string[]): Gradient {
    const stops: GradientStop[] = colors.map((color, index) => ({
      id: `stop-${Date.now()}-${index}`,
      color,
      position: (index / (colors.length - 1)) * 100,
    }))

    return {
      id,
      name: "Shade Gradient",
      type: "linear",
      stops,
      angle: 90,
    }
  }

  /**
   * Add a stop to a gradient
   */
  static addStop(gradient: Gradient, color: string, position: number): Gradient {
    const newStop: GradientStop = {
      id: `stop-${Date.now()}`,
      color,
      position,
    }

    return {
      ...gradient,
      stops: [...gradient.stops, newStop],
    }
  }

  /**
   * Remove a stop from a gradient
   */
  static removeStop(gradient: Gradient, stopId: string): Gradient {
    if (gradient.stops.length <= 2) {
      // Don't remove if only 2 stops remain
      return gradient
    }

    return {
      ...gradient,
      stops: gradient.stops.filter((stop) => stop.id !== stopId),
    }
  }

  /**
   * Update a stop in a gradient
   */
  static updateStop(gradient: Gradient, stopId: string, updates: Partial<GradientStop>): Gradient {
    return {
      ...gradient,
      stops: gradient.stops.map((stop) => (stop.id === stopId ? { ...stop, ...updates } : stop)),
    }
  }

  /**
   * Find the color at a specific position in a gradient
   */
  static getColorAtPosition(gradient: Gradient, position: number): string {
    const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position)

    // If position is at or before the first stop, return the first stop's color
    if (position <= sortedStops[0].position) {
      return sortedStops[0].color
    }

    // If position is at or after the last stop, return the last stop's color
    if (position >= sortedStops[sortedStops.length - 1].position) {
      return sortedStops[sortedStops.length - 1].color
    }

    // Find the two stops that the position falls between
    let beforeStop: GradientStop | null = null
    let afterStop: GradientStop | null = null

    for (let i = 0; i < sortedStops.length - 1; i++) {
      if (position >= sortedStops[i].position && position <= sortedStops[i + 1].position) {
        beforeStop = sortedStops[i]
        afterStop = sortedStops[i + 1]
        break
      }
    }

    if (!beforeStop || !afterStop) {
      return "#000000" // Fallback
    }

    // Calculate the ratio between the two stops
    const range = afterStop.position - beforeStop.position
    const ratio = (position - beforeStop.position) / range

    // Interpolate the color
    return ColorManipulator.blend(beforeStop.color, afterStop.color, ratio)
  }
}
