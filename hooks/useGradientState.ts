"use client"

import { useState, useCallback } from "react"
import type { Gradient, GradientStop } from "@/types/gradient"
import { GradientGenerator } from "@/lib/gradient/GradientGenerator"
import { useLocalStorage } from "./useLocalStorage"

interface UseGradientStateOptions {
  storageKey?: string
}

export function useGradientState(options: UseGradientStateOptions = {}) {
  const { storageKey = "color-palette-generator-gradients" } = options

  // Generate a unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 9)
  }, [])

  // Load saved gradients from local storage
  const [savedGradients, setSavedGradients] = useLocalStorage<Gradient[]>(storageKey, [])

  // State for gradients
  const [gradients, setGradients] = useState<Gradient[]>(savedGradients || [])

  // State for active gradient
  const [activeGradient, setActiveGradient] = useState<Gradient>(GradientGenerator.createGradient(generateId()))

  // Save gradients to local storage when they change
  const saveGradients = useCallback(
    (updatedGradients: Gradient[]) => {
      setGradients(updatedGradients)
      setSavedGradients(updatedGradients)
    },
    [setSavedGradients],
  )

  // Add a gradient to the collection
  const addGradient = useCallback(() => {
    const updatedGradients = [...gradients, activeGradient]
    saveGradients(updatedGradients)

    // Create a new active gradient
    setActiveGradient(GradientGenerator.createGradient(generateId()))

    return activeGradient.id
  }, [gradients, activeGradient, saveGradients, generateId])

  // Delete a gradient
  const deleteGradient = useCallback(
    (id: string) => {
      const updatedGradients = gradients.filter((gradient) => gradient.id !== id)
      saveGradients(updatedGradients)
      return true
    },
    [gradients, saveGradients],
  )

  // Update active gradient
  const updateActiveGradient = useCallback((updates: Partial<Gradient>) => {
    setActiveGradient((prev) => ({ ...prev, ...updates }))
  }, [])

  // Add a stop to the active gradient
  const addGradientStop = useCallback((color: string, position: number) => {
    const stopId = `stop-${Date.now()}`
    setActiveGradient((prev) => ({
      ...prev,
      stops: [...prev.stops, { id: stopId, color, position }],
    }))
    return stopId
  }, [])

  // Remove a stop from the active gradient
  const removeGradientStop = useCallback(
    (stopId: string) => {
      if (activeGradient.stops.length <= 2) {
        return false // Don't remove if only 2 stops remain
      }

      setActiveGradient((prev) => ({
        ...prev,
        stops: prev.stops.filter((stop) => stop.id !== stopId),
      }))

      return true
    },
    [activeGradient.stops.length],
  )

  // Update a stop in the active gradient
  const updateGradientStop = useCallback((stopId: string, updates: Partial<GradientStop>) => {
    setActiveGradient((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) => (stop.id === stopId ? { ...stop, ...updates } : stop)),
    }))
  }, [])

  // Get CSS for the active gradient
  const getActiveGradientCSS = useCallback(() => {
    return GradientGenerator.generateCssString(activeGradient)
  }, [activeGradient])

  return {
    gradients,
    activeGradient,
    setActiveGradient,
    updateActiveGradient,
    addGradient,
    deleteGradient,
    addGradientStop,
    removeGradientStop,
    updateGradientStop,
    getActiveGradientCSS,
  }
}
