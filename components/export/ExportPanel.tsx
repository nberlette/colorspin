"use client"

import { useState, useEffect } from "react"
import { Copy, Download, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ColorSet } from "@/types/color"
import type { Gradient } from "@/types/gradient"
import type { ExportFormat } from "@/types/export"
import { ExportFormatter } from "@/lib/export/ExportFormatter"
import { useToast } from "@/components/ui/use-toast"

interface ExportPanelProps {
  colorSets: ColorSet[]
  gradients: Gradient[]
}

export function ExportPanel({ colorSets, gradients }: ExportPanelProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css")
  const [exportCode, setExportCode] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"format" | "preview">("format")

  // Available export formats
  const exportFormats = ExportFormatter.formats

  // Update export code when format changes or when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      try {
        const code = ExportFormatter.generateCode(exportFormat, colorSets, gradients)
        setExportCode(code)
      } catch (error) {
        console.error("Error generating export code:", error)
        setExportCode("// Error generating export code")
        toast({
          title: "Export Error",
          description: "There was an error generating the export code. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [exportFormat, colorSets, gradients, isDialogOpen, toast])

  // Copy export code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportCode)
    toast({
      title: "Copied to clipboard",
      description: "Export code has been copied to your clipboard",
      duration: 1500,
    })
  }

  // Download export code as a file
  const handleDownloadCode = () => {
    const format = exportFormats.find((f) => f.id === exportFormat)
    if (!format) return

    const blob = new Blob([exportCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `color-palette.${format.fileExtension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: `The ${format.name} file has been downloaded.`,
      duration: 1500,
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Palette</DialogTitle>
          <DialogDescription>Export your color palette in various formats for use in your projects.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === "format" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("format")}
            >
              Format
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "preview" ? "border-b-2 border-primary font-medium" : ""}`}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </button>
          </div>

          {activeTab === "format" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="export-format">Select Format</Label>
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {exportFormats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        <div className="flex flex-col">
                          <span>{format.name}</span>
                          <span className="text-xs text-muted-foreground">{format.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-code">Code Preview</Label>
                <Textarea
                  id="export-code"
                  value={exportCode}
                  readOnly
                  className="font-mono text-sm h-64 overflow-auto"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDownloadCode} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleCopyCode} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
