"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { ColorSet } from "@/types/color"
import { ColorManipulator } from "@/lib/color/ColorManipulator"
import { useLocalStorage } from "./useLocalStorage"

interface UseColorSetsOptions {
  defaultBaseColor?: string
  defaultVibrancy?: number
  defaultHueShift?: number
  storageKey?: string
}

export function useColorSets(options: UseColorSetsOptions = {}) {
  const {
    defaultBaseColor = "#15437F",
    defaultVibrancy = 50,
    defaultHueShift = 0,
    storageKey = "color-palette-generator-sets",
  } = options

  // Generate a unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 9)
  }, [])

  // Load saved color sets from local storage or create default
  const [savedColorSets, setSavedColorSets] = useLocalStorage<ColorSet[]>(storageKey, [])

  // State for color sets
  const [colorSets, setColorSets] = useState<ColorSet[]>([])
  const [activeColorSetId, setActiveColorSetId] = useState<string>("")

  // Use a ref to track initialization
  const isInitialized = useRef(false)

  // Initialize with saved or default color sets
  useEffect(() => {
    if (isInitialized.current) return

    if (savedColorSets && savedColorSets.length > 0) {
      // Generate shades for each color set
      const setsWithShades = savedColorSets.map((set) => ({
        ...set,
        shades: ColorManipulator.generateShades(set.baseColor, {
          vibrancy: set.vibrancy,
          hueShift: set.hueShift,
        }),
      }))
      setColorSets(setsWithShades)
      setActiveColorSetId(savedColorSets[0].id)
    } else {
      const defaultId = generateId()
      const defaultSet: ColorSet = {
        id: defaultId,
        name: "Primary",
        baseColor: defaultBaseColor,
        vibrancy: defaultVibrancy,
        hueShift: defaultHueShift,
        shades: ColorManipulator.generateShades(defaultBaseColor, {
          vibrancy: defaultVibrancy,
          hueShift: defaultHueShift,
        }),
      }
      setColorSets([defaultSet])
      setActiveColorSetId(defaultId)
    }

    isInitialized.current = true
  }, [savedColorSets, defaultBaseColor, defaultVibrancy, defaultHueShift, generateId])

  // Save color sets to local storage when they change, but skip the initial render
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }

    if (colorSets.length > 0) {
      setSavedColorSets(colorSets)
    }
  }, [colorSets, setSavedColorSets])

  // Add a new color set
  const addColorSet = useCallback(
    (baseColor?: string) => {
      const newId = generateId()
      // Make sure baseColor is a string or generate a new random color
      const newColor = typeof baseColor === "string" ? baseColor : ColorManipulator.generateRandomColor()
      const newSet: ColorSet = {
        id: newId,
        name: `Color ${colorSets.length + 1}`,
        baseColor: newColor,
        vibrancy: defaultVibrancy,
        hueShift: defaultHueShift,
        shades: ColorManipulator.generateShades(newColor, {
          vibrancy: defaultVibrancy,
          hueShift: defaultHueShift,
        }),
      }
      setColorSets((prev) => [...prev, newSet])
      setActiveColorSetId(newId)
      return newId
    },
    [colorSets.length, defaultVibrancy, defaultHueShift, generateId],
  )

  // Update a color set
  const updateColorSet = useCallback((updatedSet: ColorSet) => {
    // Generate new shades based on the updated color set properties
    const updatedSetWithShades = {
      ...updatedSet,
      shades: ColorManipulator.generateShades(updatedSet.baseColor, {
        vibrancy: updatedSet.vibrancy,
        hueShift: updatedSet.hueShift,
      }),
    }

    setColorSets((prev) => prev.map((set) => (set.id === updatedSetWithShades.id ? updatedSetWithShades : set)))
  }, [])

  // Delete a color set
  const deleteColorSet = useCallback(
    (id: string) => {
      if (colorSets.length <= 1) {
        return false // Don't delete the last set
      }

      setColorSets((prev) => prev.filter((set) => set.id !== id))

      // If the active set was deleted, set the first available set as active
      if (id === activeColorSetId) {
        setActiveColorSetId((prev) => {
          const remainingSets = colorSets.filter((set) => set.id !== id)
          return remainingSets.length > 0 ? remainingSets[0].id : ""
        })
      }

      return true
    },
    [colorSets, activeColorSetId],
  )

  // Get the active color set
  const activeColorSet = colorSets.find((set) => set.id === activeColorSetId) || colorSets[0]

  return {
    colorSets,
    activeColorSetId,
    activeColorSet,
    setActiveColorSetId,
    addColorSet,
    updateColorSet,
    deleteColorSet,
  }
}
