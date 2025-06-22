"use client"

import { Check, AlertCircle } from "lucide-react"
import type { ColorShade } from "@/types/color"
import { ContrastCalculator } from "@/lib/accessibility/ContrastCalculator"
import { motion } from "framer-motion"

interface AccessibilityCheckerProps {
  colorShades: ColorShade[]
}

export function AccessibilityChecker({ colorShades }: AccessibilityCheckerProps) {
  // Calculate accessibility scores
  const accessibilityScores = ContrastCalculator.calculatePaletteAccessibility(colorShades)

  // Get passing and failing combinations
  const passingCombinations = ContrastCalculator.getPassingCombinations(accessibilityScores)
  const failingCombinations = ContrastCalculator.getFailingCombinations(accessibilityScores)

  return (
    <motion.div
      className="border p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Accessibility Pairs</h3>
        <div className="text-xs text-gray-500">
          {passingCombinations.length} passing / {accessibilityScores.length} total
        </div>
      </div>

      <div className="space-y-4">
        {/* Passing combinations */}
        <div>
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center">
            <Check className="h-4 w-4 mr-1" /> Accessible Combinations
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {passingCombinations.length > 0 ? (
              passingCombinations.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded border border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-900/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-l flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: score.background.hex,
                          color: score.foreground.hex,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        A
                      </div>
                      <div
                        className="w-6 h-6 rounded-r flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: score.foreground.hex,
                          color: score.background.hex,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        A
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">{score.background.shade}</span>
                      {" + "}
                      <span className="font-medium">{score.foreground.shade}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{score.ratio.toFixed(2)}:1</span>
                    <div className="px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {score.level}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">No accessible combinations found</div>
            )}
          </div>
        </div>

        {/* Failing combinations */}
        <div>
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" /> Inaccessible Combinations
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {failingCombinations.length > 0 ? (
              failingCombinations.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-l flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: score.background.hex,
                          color: score.foreground.hex,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        A
                      </div>
                      <div
                        className="w-6 h-6 rounded-r flex items-center justify-center text-xs font-medium"
                        style={{
                          backgroundColor: score.foreground.hex,
                          color: score.background.hex,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      >
                        A
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">{score.background.shade}</span>
                      {" + "}
                      <span className="font-medium">{score.foreground.shade}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{score.ratio.toFixed(2)}:1</span>
                    <div className="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {score.level}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 italic">All combinations are accessible!</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
