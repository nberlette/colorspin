export type ExportFormat =
  | "css"
  | "scss"
  | "less"
  | "tailwind"
  | "unocss"
  | "windicss"
  | "styled"
  | "mui"
  | "chakra"
  | "json"

export interface ExportFormatOption {
  id: ExportFormat
  name: string
  description: string
  fileExtension: string
}
