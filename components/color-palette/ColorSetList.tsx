"use client"

import { Plus, Trash2 } from "lucide-react"
import type { ColorSet } from "@/types/color"

interface ColorSetListProps {
  colorSets: ColorSet[]
  activeColorSetId: string
  onSelectColorSet: (id: string) => void
  onAddColorSet: () => void
  onDeleteColorSet: (id: string) => void
}

export function ColorSetList({
  colorSets,
  activeColorSetId,
  onSelectColorSet,
  onAddColorSet,
  onDeleteColorSet,
}: ColorSetListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {colorSets.map((set) => (
        <button
          key={set.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] ${
            set.id === activeColorSetId
              ? "border-primary bg-primary/10"
              : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          onClick={() => onSelectColorSet(set.id)}
        >
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: set.baseColor }} />
          <span>{set.name}</span>
          {colorSets.length > 1 && (
            <button
              className="ml-1 text-gray-500 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteColorSet(set.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </button>
      ))}

      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all"
        onClick={onAddColorSet}
      >
        <Plus className="h-4 w-4" />
        <span>Add Color</span>
      </button>
    </div>
  )
}
