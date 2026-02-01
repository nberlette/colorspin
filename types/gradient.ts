export interface GradientStop {
  color: string
  position: number
  id: string
}

interface CommonGradient {
  id: string;
  name: string;
  stops: GradientStop[];
  shape?: unknown;
  angle?: number;
}

export type RadialGradientShape =
  | "circle"
  | "ellipse"
  | `${number}% ${number}% at ${number}% ${number}%`;

export interface RadialGradient extends CommonGradient {
  type: "radial";
  shape: RadialGradientShape;
}

export interface LinearGradient extends CommonGradient {
  type: "linear";
  angle: number;
}

export type Gradient = LinearGradient | RadialGradient;
