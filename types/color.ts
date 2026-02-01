export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface ColorShade {
  shade: number
  hex: string
  hue: number
  saturation: number
  lightness: number
}

export interface ColorSet {
  id: string
  name: string
  baseColor: string
  vibrancy: number
  hueShift: number
  shades: ColorShade[]
}

export type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "tetradic"
  | "splitComplementary"
  | "square"
  | "compound"
  | "monochromatic"
  | "shades"
  | "custom"

export interface ColorHarmony {
  name: string
  description: string
  colors: string[]
  type: HarmonyType
}

export interface ContrastScore {
  background: ColorShade
  foreground: ColorShade
  ratio: number
  level: string
  pass: boolean
}

export interface ColorVisionDeficiency {
  id: string
  name: string
  description: string
  simulationMatrix?: number[]
  simulationFunction?: (r: number, g: number, b: number) => [number, number, number]
}
