"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import type { ColorSet } from "@/types/color"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface ColorShadeDisplayProps {
  colorSet?: ColorSet
}

export function ColorShadeDisplay({ colorSet }: ColorShadeDisplayProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const { toast } = useToast()

  // If no color set is provided, return null
  if (!colorSet || !colorSet.shades || colorSet.shades.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg">
        <p className="text-muted-foreground">No color shades available</p>
      </div>
    )
  }

  // Copy hex value to clipboard
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast({
      title: "Copied to clipboard",
      description: `${hex} has been copied to your clipboard.`,
      duration: 1000,
    })

    // Reset copied state after 1 second
    setTimeout(() => {
      setCopiedHex(null)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Color Shades</h3>

      <motion.div
        className="h-24 rounded-lg overflow-hidden flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        {colorSet.shades.map(({ shade, hex }, index) => (
          <motion.div
            key={shade}
            className="flex-1"
            style={{ backgroundColor: hex }}
            title={`${shade}: ${hex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          />
        ))}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {colorSet.shades.map(({ shade, hex, hue, saturation, lightness }, index) => (
          <motion.div
            key={shade}
            className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            whileHover={{ scale: 1.01, x: 5 }}
          >
            <motion.div
              className="w-10 h-10 rounded mr-4"
              style={{ backgroundColor: hex }}
              animate={{ backgroundColor: hex }}
              transition={{ duration: 0.3 }}
            />
            <div className="font-bold text-lg w-10">{shade}</div>
            <motion.div
              className="font-mono text-sm cursor-pointer flex items-center gap-1"
              onClick={() => copyToClipboard(hex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {hex}
              {copiedHex === hex ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check className="h-3 w-3 text-green-500" />
                </motion.div>
              ) : (
                <Copy className="h-3 w-3 opacity-50" />
              )}
            </motion.div>
            <div className="ml-auto grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500">H {hue}</div>
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black dark:bg-primary"
                    style={{ width: `${(hue / 360) * 100}%` }}
                    animate={{ width: `${(hue / 360) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500">S {saturation}</div>
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black dark:bg-primary"
                    style={{ width: `${saturation}%` }}
                    animate={{ width: `${saturation}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-500">L {lightness}</div>
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black dark:bg-primary"
                    style={{ width: `${lightness}%` }}
                    animate={{ width: `${lightness}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
