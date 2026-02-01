"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { ColorSet } from "@/types/color"
import type { Gradient, GradientStop } from "@/types/gradient"
import { ColorManipulator } from "@/lib/color/ColorManipulator"
import { GradientGenerator } from "@/lib/gradient/GradientGenerator"

// Define the state shape
interface ColorPaletteState {
  colorSets: ColorSet[]
  activeColorSetId: string
  gradients: Gradient[]
  activeGradientId: string
}

// Define action types
type Action =
  | { type: "INITIALIZE"; payload: { colorSets: ColorSet[]; gradients: Gradient[] } }
  | { type: "SET_ACTIVE_COLOR_SET"; payload: string }
  | { type: "ADD_COLOR_SET"; payload: ColorSet }
  | { type: "UPDATE_COLOR_SET"; payload: ColorSet }
  | { type: "DELETE_COLOR_SET"; payload: string }
  | { type: "SET_ACTIVE_GRADIENT"; payload: string }
  | { type: "ADD_GRADIENT"; payload: Gradient }
  | { type: "UPDATE_GRADIENT"; payload: Gradient }
  | { type: "DELETE_GRADIENT"; payload: string }
  | { type: "ADD_GRADIENT_STOP"; payload: { gradientId: string; stop: GradientStop } }
  | { type: "UPDATE_GRADIENT_STOP"; payload: { gradientId: string; stopId: string; updates: Partial<GradientStop> } }
  | { type: "REMOVE_GRADIENT_STOP"; payload: { gradientId: string; stopId: string } }

// Define the context shape
interface ColorPaletteContextType {
  state: ColorPaletteState
  dispatch: React.Dispatch<Action>
  activeColorSet: ColorSet | undefined
  activeGradient: Gradient | undefined
  setActiveColorSet: (id: string) => void
  addColorSet: (baseColor?: string) => string
  updateColorSet: (updatedSet: ColorSet) => void
  deleteColorSet: (id: string) => boolean
  setActiveGradient: (id: string) => void
  addGradient: () => string
  updateGradient: (updatedGradient: Gradient) => void
  deleteGradient: (id: string) => boolean
  addGradientStop: (gradientId: string, color: string, position: number) => string
  updateGradientStop: (gradientId: string, stopId: string, updates: Partial<GradientStop>) => void
  removeGradientStop: (gradientId: string, stopId: string) => boolean
  getGradientCSS: (gradient: Gradient) => string
}

// Create the context
const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined)

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// Initial state
const initialState: ColorPaletteState = {
  colorSets: [],
  activeColorSetId: "",
  gradients: [],
  activeGradientId: "",
}

// Reducer function
function reducer(state: ColorPaletteState, action: Action): ColorPaletteState {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        colorSets: action.payload.colorSets,
        activeColorSetId: action.payload.colorSets.length > 0 ? action.payload.colorSets[0].id : "",
        gradients: action.payload.gradients,
        activeGradientId: action.payload.gradients.length > 0 ? action.payload.gradients[0].id : "",
      }

    case "SET_ACTIVE_COLOR_SET":
      return {
        ...state,
        activeColorSetId: action.payload,
      }

    case "ADD_COLOR_SET":
      return {
        ...state,
        colorSets: [...state.colorSets, action.payload],
        activeColorSetId: action.payload.id,
      }

    case "UPDATE_COLOR_SET":
      return {
        ...state,
        colorSets: state.colorSets.map((set) => (set.id === action.payload.id ? action.payload : set)),
      }

    case "DELETE_COLOR_SET":
      if (state.colorSets.length <= 1) {
        return state // Don't delete the last set
      }

      const remainingColorSets = state.colorSets.filter((set) => set.id !== action.payload)
      return {
        ...state,
        colorSets: remainingColorSets,
        activeColorSetId:
          state.activeColorSetId === action.payload && remainingColorSets.length > 0
            ? remainingColorSets[0].id
            : state.activeColorSetId,
      }

    case "SET_ACTIVE_GRADIENT":
      return {
        ...state,
        activeGradientId: action.payload,
      }

    case "ADD_GRADIENT":
      return {
        ...state,
        gradients: [...state.gradients, action.payload],
        activeGradientId: action.payload.id,
      }

    case "UPDATE_GRADIENT":
      return {
        ...state,
        gradients: state.gradients.map((gradient) => (gradient.id === action.payload.id ? action.payload : gradient)),
      }

    case "DELETE_GRADIENT":
      if (state.gradients.length <= 1) {
        return state // Don't delete the last gradient
      }

      const remainingGradients = state.gradients.filter((gradient) => gradient.id !== action.payload)
      return {
        ...state,
        gradients: remainingGradients,
        activeGradientId:
          state.activeGradientId === action.payload && remainingGradients.length > 0
            ? remainingGradients[0].id
            : state.activeGradientId,
      }

    case "ADD_GRADIENT_STOP":
      return {
        ...state,
        gradients: state.gradients.map((gradient) => {
          if (gradient.id === action.payload.gradientId) {
            return {
              ...gradient,
              stops: [...gradient.stops, action.payload.stop],
            }
          }
          return gradient
        }),
      }

    case "UPDATE_GRADIENT_STOP":
      return {
        ...state,
        gradients: state.gradients.map((gradient) => {
          if (gradient.id === action.payload.gradientId) {
            return {
              ...gradient,
              stops: gradient.stops.map((stop) =>
                stop.id === action.payload.stopId ? { ...stop, ...action.payload.updates } : stop,
              ),
            }
          }
          return gradient
        }),
      }

    case "REMOVE_GRADIENT_STOP":
      return {
        ...state,
        gradients: state.gradients.map((gradient) => {
          if (gradient.id === action.payload.gradientId) {
            // Don't remove if only 2 stops remain
            if (gradient.stops.length <= 2) {
              return gradient
            }
            return {
              ...gradient,
              stops: gradient.stops.filter((stop) => stop.id !== action.payload.stopId),
            }
          }
          return gradient
        }),
      }

    default:
      return state
  }
}

// Provider component
interface ColorPaletteProviderProps {
  children: ReactNode
}

export function ColorPaletteProvider({ children }: ColorPaletteProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load color sets
      const savedColorSets = localStorage.getItem("color-palette-generator-sets")
      let colorSets: ColorSet[] = []

      if (savedColorSets) {
        colorSets = JSON.parse(savedColorSets)
        // Generate shades for each color set
        colorSets = colorSets.map((set) => ({
          ...set,
          shades: ColorManipulator.generateShades(set.baseColor, {
            vibrancy: set.vibrancy,
            hueShift: set.hueShift,
          }),
        }))
      } else {
        // Create a default color set
        const defaultId = generateId()
        const defaultSet: ColorSet = {
          id: defaultId,
          name: "Primary",
          baseColor: "#15437F",
          vibrancy: 50,
          hueShift: 0,
          shades: ColorManipulator.generateShades("#15437F", {
            vibrancy: 50,
            hueShift: 0,
          }),
        }
        colorSets = [defaultSet]
      }

      // Load gradients
      const savedGradients = localStorage.getItem("color-palette-generator-gradients")
      let gradients: Gradient[] = []

      if (savedGradients) {
        gradients = JSON.parse(savedGradients)
      } else {
        // Create a default gradient
        const defaultGradient = GradientGenerator.createGradient(generateId())
        gradients = [defaultGradient]
      }

      // Initialize state
      dispatch({ type: "INITIALIZE", payload: { colorSets, gradients } })
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      // Create default data if loading fails
      const defaultColorSetId = generateId()
      const defaultColorSet: ColorSet = {
        id: defaultColorSetId,
        name: "Primary",
        baseColor: "#15437F",
        vibrancy: 50,
        hueShift: 0,
        shades: ColorManipulator.generateShades("#15437F", {
          vibrancy: 50,
          hueShift: 0,
        }),
      }

      const defaultGradient = GradientGenerator.createGradient(generateId())

      dispatch({
        type: "INITIALIZE",
        payload: { colorSets: [defaultColorSet], gradients: [defaultGradient] },
      })
    }
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.colorSets.length > 0) {
      // Save color sets without shades to reduce storage size
      const colorSetsToSave = state.colorSets.map(({ shades, ...rest }) => rest)
      localStorage.setItem("color-palette-generator-sets", JSON.stringify(colorSetsToSave))
    }

    if (state.gradients.length > 0) {
      localStorage.setItem("color-palette-generator-gradients", JSON.stringify(state.gradients))
    }
  }, [state.colorSets, state.gradients])

  // Get active color set
  const activeColorSet = state.colorSets.find((set) => set.id === state.activeColorSetId)

  // Get active gradient
  const activeGradient = state.gradients.find((gradient) => gradient.id === state.activeGradientId)

  // Helper functions
  const setActiveColorSet = (id: string) => {
    dispatch({ type: "SET_ACTIVE_COLOR_SET", payload: id })
  }

  const addColorSet = (baseColor?: string) => {
    const newId = generateId()
    const newColor = typeof baseColor === "string" ? baseColor : ColorManipulator.generateRandomColor()
    const newSet: ColorSet = {
      id: newId,
      name: `Color ${state.colorSets.length + 1}`,
      baseColor: newColor,
      vibrancy: 50,
      hueShift: 0,
      shades: ColorManipulator.generateShades(newColor, {
        vibrancy: 50,
        hueShift: 0,
      }),
    }
    dispatch({ type: "ADD_COLOR_SET", payload: newSet })
    return newId
  }

  const updateColorSet = (updatedSet: ColorSet) => {
    // Generate new shades based on the updated color set properties
    const updatedSetWithShades = {
      ...updatedSet,
      shades: ColorManipulator.generateShades(updatedSet.baseColor, {
        vibrancy: updatedSet.vibrancy,
        hueShift: updatedSet.hueShift,
      }),
    }
    dispatch({ type: "UPDATE_COLOR_SET", payload: updatedSetWithShades })
  }

  const deleteColorSet = (id: string) => {
    if (state.colorSets.length <= 1) {
      return false // Don't delete the last set
    }
    dispatch({ type: "DELETE_COLOR_SET", payload: id })
    return true
  }

  const setActiveGradient = (id: string) => {
    dispatch({ type: "SET_ACTIVE_GRADIENT", payload: id })
  }

  const addGradient = () => {
    const newGradient = GradientGenerator.createGradient(generateId())
    dispatch({ type: "ADD_GRADIENT", payload: newGradient })
    return newGradient.id
  }

  const updateGradient = (updatedGradient: Gradient) => {
    dispatch({ type: "UPDATE_GRADIENT", payload: updatedGradient })
  }

  const deleteGradient = (id: string) => {
    if (state.gradients.length <= 1) {
      return false // Don't delete the last gradient
    }
    dispatch({ type: "DELETE_GRADIENT", payload: id })
    return true
  }

  const addGradientStop = (gradientId: string, color: string, position: number) => {
    const stopId = `stop-${Date.now()}`
    const newStop: GradientStop = { id: stopId, color, position }
    dispatch({ type: "ADD_GRADIENT_STOP", payload: { gradientId, stop: newStop } })
    return stopId
  }

  const updateGradientStop = (gradientId: string, stopId: string, updates: Partial<GradientStop>) => {
    dispatch({ type: "UPDATE_GRADIENT_STOP", payload: { gradientId, stopId, updates } })
  }

  const removeGradientStop = (gradientId: string, stopId: string) => {
    const gradient = state.gradients.find((g) => g.id === gradientId)
    if (!gradient || gradient.stops.length <= 2) {
      return false // Don't remove if only 2 stops remain
    }
    dispatch({ type: "REMOVE_GRADIENT_STOP", payload: { gradientId, stopId } })
    return true
  }

  const getGradientCSS = (gradient: Gradient) => {
    return GradientGenerator.generateCssString(gradient)
  }

  const value = {
    state,
    dispatch,
    activeColorSet,
    activeGradient,
    setActiveColorSet,
    addColorSet,
    updateColorSet,
    deleteColorSet,
    setActiveGradient,
    addGradient,
    updateGradient,
    deleteGradient,
    addGradientStop,
    updateGradientStop,
    removeGradientStop,
    getGradientCSS,
  }

  return <ColorPaletteContext.Provider value={value}>{children}</ColorPaletteContext.Provider>
}

// Custom hook to use the context
export function useColorPalette() {
  const context = useContext(ColorPaletteContext)
  if (context === undefined) {
    throw new Error("useColorPalette must be used within a ColorPaletteProvider")
  }
  return context
}
