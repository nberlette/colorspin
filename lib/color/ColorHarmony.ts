import { ColorConverter } from "./ColorConverter"
import type { ColorHarmony } from "@/types/color"

export class ColorHarmonyGenerator {
  /**
   * Generate complementary color
   */
  static complementary(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)
    const complementHue = (hsl.h + 180) % 360

    return [baseColor, ColorConverter.hslToHex({ ...hsl, h: complementHue })]
  }

  /**
   * Generate analogous colors
   */
  static analogous(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h - 30 + 360) % 360 }),
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 30) % 360 }),
    ]
  }

  /**
   * Generate triadic colors
   */
  static triadic(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 240) % 360 }),
    ]
  }

  /**
   * Generate tetradic (rectangular) colors
   */
  static tetradic(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }),
    ]
  }

  /**
   * Generate split complementary colors
   */
  static splitComplementary(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 150) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 210) % 360 }),
    ]
  }

  /**
   * Generate square colors
   */
  static square(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }),
    ]
  }

  /**
   * Generate compound colors
   */
  static compound(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 30) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 180) % 360, l: Math.max(hsl.l - 10, 10) }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 210) % 360 }),
    ]
  }

  /**
   * Generate monochromatic colors
   */
  static monochromatic(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      ColorConverter.hslToHex({ ...hsl, l: Math.max(hsl.l - 30, 10) }),
      baseColor,
      ColorConverter.hslToHex({ ...hsl, s: Math.max(hsl.s - 20, 10) }),
      ColorConverter.hslToHex({ ...hsl, l: Math.min(hsl.l + 30, 90) }),
    ]
  }

  /**
   * Generate shades of a color
   */
  static shades(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      ColorConverter.hslToHex({ ...hsl, l: 80 }),
      ColorConverter.hslToHex({ ...hsl, l: 60 }),
      ColorConverter.hslToHex({ ...hsl, l: 40 }),
      ColorConverter.hslToHex({ ...hsl, l: 20 }),
    ]
  }

  /**
   * Generate custom harmony with golden ratio spacing
   */
  static custom(baseColor: string): string[] {
    const hsl = ColorConverter.hexToHsl(baseColor)

    return [
      baseColor,
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 38) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 76) % 360 }),
      ColorConverter.hslToHex({ ...hsl, h: (hsl.h + 114) % 360 }),
    ]
  }

  /**
   * Get all color harmonies for a base color
   */
  static getAllHarmonies(baseColor: string): ColorHarmony[] {
    return [
      {
        name: "Complementary",
        description: "Colors opposite each other on the color wheel",
        colors: this.complementary(baseColor),
        type: "complementary",
      },
      {
        name: "Analogous",
        description: "Colors adjacent to each other on the color wheel",
        colors: this.analogous(baseColor),
        type: "analogous",
      },
      {
        name: "Triadic",
        description: "Three colors evenly spaced on the color wheel",
        colors: this.triadic(baseColor),
        type: "triadic",
      },
      {
        name: "Split Complementary",
        description: "A color and two colors adjacent to its complement",
        colors: this.splitComplementary(baseColor),
        type: "splitComplementary",
      },
      {
        name: "Tetradic",
        description: "Four colors arranged in two complementary pairs",
        colors: this.tetradic(baseColor),
        type: "tetradic",
      },
      {
        name: "Square",
        description: "Four colors evenly spaced around the color wheel",
        colors: this.square(baseColor),
        type: "square",
      },
      {
        name: "Compound",
        description: "A mix of complementary and analogous colors",
        colors: this.compound(baseColor),
        type: "compound",
      },
      {
        name: "Monochromatic",
        description: "Different shades and tints of the same color",
        colors: this.monochromatic(baseColor),
        type: "monochromatic",
      },
      {
        name: "Shades",
        description: "Variations of lightness of the same color",
        colors: this.shades(baseColor),
        type: "shades",
      },
      {
        name: "Custom",
        description: "Custom harmony with golden ratio spacing",
        colors: this.custom(baseColor),
        type: "custom",
      },
    ]
  }
}
