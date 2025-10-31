"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColorSetList } from "./ColorSetList"
import { ColorSetEditor } from "./ColorSetEditor"
import { ColorShadeDisplay } from "./ColorShadeDisplay"
import { GradientEditor } from "@/components/gradient/GradientEditor"
import { VisionSimulator } from "@/components/accessibility/VisionSimulator"
import { ExportPanel } from "@/components/export/ExportPanel"
import { useColorPalette } from "@/context/ColorPaletteContext"

export function ColorPaletteGenerator() {
  const [activeTab, setActiveTab] = useState("colors")
  const {
    state,
    activeColorSet,
    setActiveColorSet,
    addColorSet,
    updateColorSet,
    deleteColorSet,
    activeGradient,
    setActiveGradient,
    addGradient,
    updateGradient,
    deleteGradient,
    addGradientStop,
    updateGradientStop,
    removeGradientStop,
    getGradientCSS,
  } = useColorPalette()

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Color Palette Generator</h1>
        <p className="text-muted-foreground">
          Create, customize, and export beautiful color palettes for your projects.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex border-b w-full">
          <button
            className={`px-4 py-2 ${activeTab === "colors" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveTab("colors")}
          >
            Colors
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "gradients" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveTab("gradients")}
          >
            Gradients
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "accessibility" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveTab("accessibility")}
          >
            Accessibility
          </button>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <ExportPanel colorSets={state.colorSets} gradients={state.gradients} />

          <Button onClick={() => addColorSet()} size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Color
          </Button>
        </div>
      </div>

      {activeTab === "colors" && (
        <div className="space-y-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ColorSetList
                colorSets={state.colorSets}
                activeColorSetId={state.activeColorSetId}
                onSelectColorSet={setActiveColorSet}
                onAddColorSet={addColorSet}
                onDeleteColorSet={deleteColorSet}
              />
            </div>
            <div className="md:col-span-3 space-y-6">
              {activeColorSet && (
                <>
                  <ColorSetEditor colorSet={activeColorSet} onChange={updateColorSet} />
                  <ColorShadeDisplay colorSet={activeColorSet} />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "gradients" && activeGradient && (
        <div className="mt-4">
          <GradientEditor
            colorShades={activeColorSet?.shades || []}
            gradients={state.gradients}
            activeGradient={activeGradient}
            onUpdateGradient={updateGradient}
            onAddGradient={addGradient}
            onDeleteGradient={deleteGradient}
            onAddStop={(color, position) => addGradientStop(activeGradient.id, color, position)}
            onUpdateStop={(stopId, updates) => updateGradientStop(activeGradient.id, stopId, updates)}
            onRemoveStop={(stopId) => removeGradientStop(activeGradient.id, stopId)}
            getGradientCSS={() => getGradientCSS(activeGradient)}
          />
        </div>
      )}

      {activeTab === "accessibility" && activeColorSet && (
        <div className="mt-4">
          <VisionSimulator colorShades={activeColorSet.shades} />
        </div>
      )}
    </div>
  )
}
