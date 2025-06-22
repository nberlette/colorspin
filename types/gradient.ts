export interface GradientStop {
  color: string
  position: number
  id: string
}

export interface Gradient {
  id: string
  name: string
  type: "linear" | "radial"
  stops: GradientStop[]
  angle: number // for linear gradients (in degrees)
}
