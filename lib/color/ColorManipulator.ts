import { ColorConverter } from "./ColorConverter"
import type { ColorShade } from "@/types/color"

interface ShadeOptions {
  vibrancy: number
  hueShift: number
}

export class ColorManipulator {
  /**
   * Format and validate hex value
   */
  static formatHexValue(value: string | unknown, fallback = "#000000"): string {
    // Handle non-string inputs
    if (typeof value !== "string") {
      return fallback
    }

    // Remove any non-hex characters
    let hex = value.replace(/[^0-9A-Fa-f]/g, "")

    // If empty, return the fallback color
    if (!hex) return fallback

    // Handle shorthand hex (e.g., "F00" -> "FF0000")
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
    }

    // Complete incomplete hex values
    if (hex.length < 6) {
      // Pad with zeros or repeat the pattern
      if (hex.length === 1) {
        // Single character - repeat it (e.g., "F" -> "FFFFFF")
        hex = hex.repeat(6)
      } else if (hex.length === 2) {
        // Two characters - treat as RR and repeat (e.g., "FF" -> "FFFF00")
        hex = hex + hex + "00"
      } else if (hex.length === 4) {
        // Four characters - treat as RRGG and add default blue (e.g., "FFFF" -> "FFFF00")
        hex = hex + "00"
      } else if (hex.length === 5) {
        // Five characters - add one more from the pattern
        hex = hex + hex.charAt(0)
      }
    } else if (hex.length > 6) {
      // Truncate if too long
      hex = hex.substring(0, 6)
    }

    return "#" + hex.toUpperCase()
  }

  /**
   * Lighten a color by a percentage
   */
  static lighten(color: string, amount: number): string {
    const hsl = ColorConverter.hexToHsl(color)
    const newL = Math.min(100, hsl.l + amount)
    return ColorConverter.hslToHex({ ...hsl, l: newL })
  }

  /**
   * Darken a color by a percentage
   */
  static darken(color: string, amount: number): string {
    const hsl = ColorConverter.hexToHsl(color)
    const newL = Math.max(0, hsl.l - amount)
    return ColorConverter.hslToHex({ ...hsl, l: newL })
  }

  /**
   * Saturate a color by a percentage
   */
  static saturate(color: string, amount: number): string {
    const hsl = ColorConverter.hexToHsl(color)
    const newS = Math.min(100, hsl.s + amount)
    return ColorConverter.hslToHex({ ...hsl, s: newS })
  }

  /**
   * Desaturate a color by a percentage
   */
  static desaturate(color: string, amount: number): string {
    const hsl = ColorConverter.hexToHsl(color)
    const newS = Math.max(0, hsl.s - amount)
    return ColorConverter.hslToHex({ ...hsl, s: newS })
  }

  /**
   * Adjust the hue of a color by degrees
   */
  static adjustHue(color: string, degrees: number): string {
    const hsl = ColorConverter.hexToHsl(color)
    const newH = (hsl.h + degrees + 360) % 360
    return ColorConverter.hslToHex({ ...hsl, h: newH })
  }

  /**
   * Generate a random color
   */
  static generateRandomColor(): string {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 20 + Math.random() * 80 // 20-100%
    const lightness = 20 + Math.random() * 60 // 20-80%
    return ColorConverter.hslToHex({ h: hue, s: saturation, l: lightness })
  }

  /**
   * Generate color shades from a base color
   */
  static generateShades(baseColor: string, options: ShadeOptions): ColorShade[] {
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    const hsl = ColorConverter.hexToHsl(baseColor)
    const { vibrancy, hueShift } = options

    // Apply hue shift
    const adjustedHue = (hsl.h + hueShift + 360) % 360

    // Apply vibrancy (affects saturation)
    // Cap vibrancy to prevent issues with extreme values
    const cappedVibrancy = Math.min(vibrancy, 85) // Cap at 85% to prevent oversaturation
    const saturationMultiplier = cappedVibrancy / 50 // 0-85 range to 0-1.7 multiplier

    return shades.map((shade) => {
      // Fixed lightness values to ensure proper gradient
      // These values ensure 50 is always lightest and 900 is always darkest
      const lightnessMap: Record<number, number> = {
        50: 96, // Lightest
        100: 90,
        200: 80,
        300: 70,
        400: 60,
        500: 50,
        600: 40,
        700: 30,
        800: 20,
        900: 10, // Darkest
      }

      const targetLightness = lightnessMap[shade]

      // Calculate saturation with a more controlled approach
      // Lighter shades get less saturation, darker shades get more
      let adjustedSaturation: number

      if (shade <= 100) {
        // Very light shades (50, 100) get significantly reduced saturation
        adjustedSaturation = hsl.s * saturationMultiplier * (0.3 + shade / 500)
      } else if (shade < 500) {
        // Medium-light shades get moderately reduced saturation
        adjustedSaturation = hsl.s * saturationMultiplier * (0.6 + shade / 1000)
      } else if (shade < 800) {
        // Medium-dark shades get slightly increased saturation
        adjustedSaturation = hsl.s * saturationMultiplier * (0.9 + (shade - 500) / 2000)
      } else {
        // Very dark shades (800, 900) get reduced saturation to prevent muddiness
        adjustedSaturation = hsl.s * saturationMultiplier * 0.95
      }

      // Cap saturation to prevent oversaturation
      adjustedSaturation = Math.min(adjustedSaturation, 100)

      // Generate the hex color
      const hex = ColorConverter.hslToHex({
        h: adjustedHue,
        s: adjustedSaturation,
        l: targetLightness,
      })

      return {
        shade,
        hex,
        hue: adjustedHue,
        saturation: Math.round(adjustedSaturation),
        lightness: targetLightness,
      }
    })
  }

  /**
   * Calculate relative luminance of a color (for WCAG contrast calculations)
   */
  static getLuminance(color: string): number {
    const rgb = ColorConverter.hexToRgb(color)

    // Convert RGB to [0, 1] range
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    // Calculate luminance
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  }

  /**
   * Calculate contrast ratio between two colors (WCAG)
   */
  static getContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1)
    const luminance2 = this.getLuminance(color2)

    const lighter = Math.max(luminance1, luminance2)
    const darker = Math.min(luminance1, luminance2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Blend two colors together
   */
  static blend(color1: string, color2: string, ratio: number): string {
    const rgb1 = ColorConverter.hexToRgb(color1)
    const rgb2 = ColorConverter.hexToRgb(color2)

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio)
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio)
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)

    return ColorConverter.rgbToHex({ r, g, b })
  }
}
