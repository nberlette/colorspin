import { ColorManipulator } from "../color/ColorManipulator"
import type { ColorShade, ContrastScore } from "@/types/color"

export class ContrastCalculator {
  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    return ColorManipulator.getContrastRatio(color1, color2)
  }

  /**
   * Get WCAG level for a contrast ratio
   */
  static getContrastLevel(ratio: number): { level: string; pass: boolean } {
    if (ratio >= 7) {
      return { level: "AAA", pass: true }
    } else if (ratio >= 4.5) {
      return { level: "AA", pass: true }
    } else if (ratio >= 3) {
      return { level: "AA Large", pass: true }
    } else {
      return { level: "Fail", pass: false }
    }
  }

  /**
   * Calculate accessibility scores for all shade combinations
   */
  static calculatePaletteAccessibility(colorShades: ColorShade[]): ContrastScore[] {
    // Skip some shades to avoid too many combinations
    const testShades = [50, 100, 200, 500, 700, 900]
    const results: ContrastScore[] = []

    // Test all combinations of shades against each other
    for (let i = 0; i < testShades.length; i++) {
      for (let j = i + 1; j < testShades.length; j++) {
        const bgShade = colorShades.find((s) => s.shade === testShades[i])
        const fgShade = colorShades.find((s) => s.shade === testShades[j])

        if (bgShade && fgShade) {
          const ratio = this.getContrastRatio(bgShade.hex, fgShade.hex)
          const { level, pass } = this.getContrastLevel(ratio)

          results.push({
            background: bgShade,
            foreground: fgShade,
            ratio,
            level,
            pass,
          })
        }
      }
    }

    // Sort by contrast ratio (highest first)
    return results.sort((a, b) => b.ratio - a.ratio)
  }

  /**
   * Get passing combinations
   */
  static getPassingCombinations(scores: ContrastScore[]): ContrastScore[] {
    return scores.filter((score) => score.pass)
  }

  /**
   * Get failing combinations
   */
  static getFailingCombinations(scores: ContrastScore[]): ContrastScore[] {
    return scores.filter((score) => !score.pass)
  }
}
