import { ColorConverter } from "../color/ColorConverter"
import type { ColorVisionDeficiency } from "@/types/color"

export class VisionDeficiencySimulator {
  /**
   * List of available color vision deficiencies
   */
  static deficiencies: ColorVisionDeficiency[] = [
    {
      id: "normal",
      name: "Normal Vision",
      description: "No color vision deficiency",
    },
    {
      id: "protanopia",
      name: "Protanopia",
      description: "Red-blind (absence of red retinal photoreceptors)",
      simulationMatrix: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
    },
    {
      id: "deuteranopia",
      name: "Deuteranopia",
      description: "Green-blind (absence of green retinal photoreceptors)",
      simulationMatrix: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
    },
    {
      id: "tritanopia",
      name: "Tritanopia",
      description: "Blue-blind (absence of blue retinal photoreceptors)",
      simulationMatrix: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
    },
    {
      id: "protanomaly",
      name: "Protanomaly",
      description: "Red-weak (anomalous red retinal photoreceptors)",
      simulationMatrix: [0.817, 0.183, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
    },
    {
      id: "deuteranomaly",
      name: "Deuteranomaly",
      description: "Green-weak (anomalous green retinal photoreceptors)",
      simulationMatrix: [0.8, 0.2, 0, 0.258, 0.742, 0, 0, 0.142, 0.858],
    },
    {
      id: "tritanomaly",
      name: "Tritanomaly",
      description: "Blue-weak (anomalous blue retinal photoreceptors)",
      simulationMatrix: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
    },
    {
      id: "achromatopsia",
      name: "Achromatopsia",
      description: "Complete color blindness (monochromacy)",
      simulationFunction: (r: number, g: number, b: number): [number, number, number] => {
        const avg = r * 0.299 + g * 0.587 + b * 0.114
        return [avg, avg, avg]
      },
    },
    {
      id: "low-contrast",
      name: "Low Contrast",
      description: "Reduced contrast sensitivity",
      simulationFunction: (r: number, g: number, b: number): [number, number, number] => {
        const avg = r * 0.299 + g * 0.587 + b * 0.114
        return [r * 0.7 + avg * 0.3, g * 0.7 + avg * 0.3, b * 0.7 + avg * 0.3]
      },
    },
    {
      id: "blurred-vision",
      name: "Blurred Vision",
      description: "Simulates blurred vision",
      // This is just a placeholder - actual blur would be applied via CSS
    },
  ]

  /**
   * Apply color vision deficiency simulation to a color
   */
  static simulateDeficiency(color: string, deficiencyId: string): string {
    if (deficiencyId === "normal") return color

    const deficiency = this.deficiencies.find((d) => d.id === deficiencyId)
    if (!deficiency) return color

    const rgb = ColorConverter.hexToRgb(color)

    if (deficiency.simulationFunction) {
      const [newR, newG, newB] = deficiency.simulationFunction(rgb.r, rgb.g, rgb.b)
      return ColorConverter.rgbToHex({ r: newR, g: newG, b: newB })
    }

    if (deficiency.simulationMatrix) {
      const m = deficiency.simulationMatrix
      const newR = rgb.r * m[0] + rgb.g * m[1] + rgb.b * m[2]
      const newG = rgb.r * m[3] + rgb.g * m[4] + rgb.b * m[5]
      const newB = rgb.r * m[6] + rgb.g * m[7] + rgb.b * m[8]
      return ColorConverter.rgbToHex({
        r: Math.round(newR),
        g: Math.round(newG),
        b: Math.round(newB),
      })
    }

    return color
  }

  /**
   * Apply simulation to an array of colors
   */
  static simulateColors(colors: string[], deficiencyId: string): string[] {
    return colors.map((color) => this.simulateDeficiency(color, deficiencyId))
  }
}
