import type { RGB, HSL } from "@/types/color"

export class ColorConverter {
  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex: string): RGB {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return { r, g, b }
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(rgb: RGB): string {
    const toHex = (x: number) => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase()
  }

  /**
   * Convert hex color to HSL
   */
  static hexToHsl(hex: string): HSL {
    const { r, g, b } = this.hexToRgb(hex)

    // Convert RGB to [0, 1] range
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    // Find min and max values
    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)

    // Calculate lightness
    let l = (max + min) / 2

    let h = 0
    let s = 0

    if (max !== min) {
      // Calculate saturation
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)

      // Calculate hue
      if (max === rNorm) {
        h = (gNorm - bNorm) / (max - min) + (gNorm < bNorm ? 6 : 0)
      } else if (max === gNorm) {
        h = (bNorm - rNorm) / (max - min) + 2
      } else {
        h = (rNorm - gNorm) / (max - min) + 4
      }
      h /= 6
    }

    // Convert to degrees, percentage, percentage
    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return { h, s, l }
  }

  /**
   * Convert HSL to hex
   */
  static hslToHex(hsl: HSL): string {
    const { h, s, l } = hsl
    const hNorm = h / 360
    const sNorm = s / 100
    const lNorm = l / 100

    let r, g, b

    if (sNorm === 0) {
      r = g = b = lNorm
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
      const p = 2 * lNorm - q

      r = hue2rgb(p, q, hNorm + 1 / 3)
      g = hue2rgb(p, q, hNorm)
      b = hue2rgb(p, q, hNorm - 1 / 3)
    }

    return this.rgbToHex({
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    })
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(rgb: RGB): HSL {
    // Convert RGB to [0, 1] range
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    // Find min and max values
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    // Calculate lightness
    let l = (max + min) / 2

    let h = 0
    let s = 0

    if (max !== min) {
      // Calculate saturation
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)

      // Calculate hue
      if (max === r) {
        h = (g - b) / (max - min) + (g < b ? 6 : 0)
      } else if (max === g) {
        h = (b - r) / (max - min) + 2
      } else {
        h = (r - g) / (max - min) + 4
      }
      h /= 6
    }

    // Convert to degrees, percentage, percentage
    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return { h, s, l }
  }

  /**
   * Convert HSL to RGB
   */
  static hslToRgb(hsl: HSL): RGB {
    const { h, s, l } = hsl
    const hNorm = h / 360
    const sNorm = s / 100
    const lNorm = l / 100

    let r, g, b

    if (sNorm === 0) {
      r = g = b = lNorm
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
      const p = 2 * lNorm - q

      r = hue2rgb(p, q, hNorm + 1 / 3)
      g = hue2rgb(p, q, hNorm)
      b = hue2rgb(p, q, hNorm - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }
}
