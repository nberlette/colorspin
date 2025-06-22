"use client"

import type { ColorSet } from "@/types/color"
import type { Gradient } from "@/types/gradient"
import type { ExportFormat, ExportFormatOption } from "@/types/export"
import * as dprint from "@dprint/formatter";

export type FmtExtension = "ts" | "css" | "json" | "toml" | "html" | "yaml";

export class ExportFormatter {
  static readonly fmt: Record<FmtExtension, dprint.Formatter> = {
    ts: null!,
    css: null!,
    json: null!,
    toml: null!,
    html: null!,
    yaml: null!,
  };

  /**
   * Available export formats
   */
  static readonly formats: ExportFormatOption[] = [
    { id: "css", name: "CSS Variables", description: "CSS custom properties", fileExtension: "css" },
    { id: "scss", name: "SCSS Variables", description: "Sass variables", fileExtension: "scss" },
    { id: "less", name: "Less Variables", description: "Less variables", fileExtension: "less" },
    { id: "tailwind", name: "Tailwind Config", description: "Tailwind CSS configuration", fileExtension: "js" },
    { id: "unocss", name: "UnoCSS Theme", description: "UnoCSS theme configuration", fileExtension: "js" },
    { id: "windicss", name: "WindiCSS Theme", description: "WindiCSS theme configuration", fileExtension: "js" },
    { id: "styled", name: "Styled Components", description: "Styled Components theme", fileExtension: "js" },
    { id: "mui", name: "Material UI Theme", description: "Material UI theme", fileExtension: "js" },
    { id: "chakra", name: "Chakra UI Theme", description: "Chakra UI theme", fileExtension: "js" },
    { id: "json", name: "JSON", description: "JSON format", fileExtension: "json" },
  ]

  /**
   * Generate export code based on format
   */
  static generateCode(format: ExportFormat, colorSets: ColorSet[], gradients: Gradient[] = []): string {
    const fileText = this.render(format, colorSets, gradients);
    const filePath = `file.${format}`;
    const overrideConfig = { deno: true };
    const request = { filePath, fileText, overrideConfig };
    switch (format) {
      case "css":
      case "scss":
      case "less":
      case "sass":
        return this.fmt.css?.formatText(request) ?? fileText;
      case "json":
      case "jsonc":
        return this.fmt.json?.formatText(request) ?? fileText;
      case "mui":
      case "chakra":
      case "styled":
      case "unocss": 
      case "tailwind":
      case "windicss":
        return this.fmt.ts?.formatText(request) ?? fileText;
      case "svelte":
      case "astro":
      case "vue": 
      case "jsx":
      case "tsx":
        return this.fmt.html?.formatText(request) ?? fileText;
      case "toml":
        return this.fmt.toml?.formatText(request) ?? fileText;
      case "yaml":
      case "yml":
        return this.fmt.yaml?.formatText(request) ?? fileText;
      default:
        throw new TypeError("Unknown format: " + format);
    }
  } 

  static render(format: ExportFormat, colorSets: ColorSet[], gradients: Gradient[] = []): string {
    switch (format) {
      case "css":
        return this.generateCssVariables(colorSets, gradients)
      case "scss":
        return this.generateSassVariables(colorSets, gradients)
      case "less":
        return this.generateLessVariables(colorSets, gradients)
      case "tailwind":
        return this.generateTailwindConfig(colorSets, gradients)
      case "unocss":
        return this.generateUnocssTheme(colorSets, gradients)
      case "windicss":
        return this.generateWindiCssTheme(colorSets, gradients)
      case "styled":
        return this.generateStyledComponentsTheme(colorSets, gradients)
      case "mui":
        return this.generateMaterialUITheme(colorSets, gradients)
      case "chakra":
        return this.generateChakraUITheme(colorSets, gradients)
      case "json":
        return this.generateJson(colorSets, gradients)
      default:
        return this.generateCssVariables(colorSets, gradients)
    }
  }

  /**
   * Generate CSS Variables
   */
  static generateCssVariables(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let css = `:root {\n`

    colorSets.forEach((colorSet) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      colorSet.shades.forEach(({ shade, hex }) => {
        css += `  --color-${safeName}-${shade}: ${hex};\n`
      })
    })

    // Add gradients if any
    if (gradients.length > 0) {
      css += `\n  /* Gradients */\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient-${index + 1}`
        if (gradient.type === "linear") {
          css += `  --${safeName}: linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")});\n`
        } else {
          css += `  --${safeName}: radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")});\n`
        }
      })
    }

    css += `}\n`
    return css
  }

  /**
   * Generate Sass Variables
   */
  static generateSassVariables(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let scss = ""

    colorSets.forEach((colorSet) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      colorSet.shades.forEach(({ shade, hex }) => {
        scss += `$color-${safeName}-${shade}: ${hex};\n`
      })
      scss += "\n"
    })

    // Add gradients if any
    if (gradients.length > 0) {
      scss += `// Gradients\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient-${index + 1}`
        if (gradient.type === "linear") {
          scss += `$${safeName}: linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")});\n`
        } else {
          scss += `$${safeName}: radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")});\n`
        }
      })
    }

    return scss
  }

  /**
   * Generate Less Variables
   */
  static generateLessVariables(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let less = ""

    colorSets.forEach((colorSet) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      colorSet.shades.forEach(({ shade, hex }) => {
        less += `@color-${safeName}-${shade}: ${hex};\n`
      })
      less += "\n"
    })

    // Add gradients if any
    if (gradients.length > 0) {
      less += `// Gradients\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient-${index + 1}`
        if (gradient.type === "linear") {
          less += `@${safeName}: linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")});\n`
        } else {
          less += `@${safeName}: radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")});\n`
        }
      })
    }

    return less
  }

  /**
   * Generate Tailwind Config
   */
  static generateTailwindConfig(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let config = `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n`

    colorSets.forEach((colorSet, index) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      config += `        '${safeName}': {\n`
      colorSet.shades.forEach(({ shade, hex }) => {
        config += `          '${shade}': '${hex}',\n`
      })
      config += `        }${index < colorSets.length - 1 ? "," : ""}\n`
    })

    config += `      },\n`

    // Add gradients as background utilities
    if (gradients.length > 0) {
      config += `      backgroundImage: {\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient-${index + 1}`
        if (gradient.type === "linear") {
          config += `        '${safeName}': 'linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        } else {
          config += `        '${safeName}': 'radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        }
      })
      config += `      },\n`
    }

    config += `    },\n  },\n};\n`
    return config
  }

  /**
   * Generate UnoCSS Theme
   */
  static generateUnocssTheme(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let config = `// UnoCSS theme configuration\nexport default {\n  theme: {\n    colors: {\n`

    colorSets.forEach((colorSet, index) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      config += `      '${safeName}': {\n`
      colorSet.shades.forEach(({ shade, hex }) => {
        config += `        '${shade}': '${hex}',\n`
      })
      config += `      }${index < colorSets.length - 1 ? "," : ""}\n`
    })

    config += `    },\n`

    // Add gradients
    if (gradients.length > 0) {
      config += `    backgroundImage: {\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient-${index + 1}`
        if (gradient.type === "linear") {
          config += `      '${safeName}': 'linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        } else {
          config += `      '${safeName}': 'radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        }
      })
      config += `    },\n`
    }

    config += `  },\n};\n`
    return config
  }

  /**
   * Generate WindiCSS Theme
   */
  static generateWindiCssTheme(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let config = `// WindiCSS theme configuration\nexport default {\n  theme: {\n    extend: {\n      colors: {\n`

    colorSets.forEach((colorSet, index) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      config += `        '${safeName}': {\n`
      colorSet.shades.forEach(({ shade, hex }) => {
        config += `          '${shade}': '${hex}',\n`
      })
      config += `        }${index < colorSets.length - 1 ? "," : ""}\n`
    })

    config += `      },\n`

    // Add gradients
    if (gradients.length > 0) {
      config += `      backgroundImage: {\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient-${index + 1}`
        if (gradient.type === "linear") {
          config += `        '${safeName}': 'linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        } else {
          config += `        '${safeName}': 'radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        }
      })
      config += `      },\n`
    }

    config += `    },\n  },\n};\n`
    return config
  }

  /**
   * Generate Styled Components Theme
   */
  static generateStyledComponentsTheme(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let theme = `// Styled Components theme\nexport const theme = {\n  colors: {\n`

    colorSets.forEach((colorSet, index) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      theme += `    ${safeName}: {\n`
      colorSet.shades.forEach(({ shade, hex }) => {
        theme += `      ${shade}: '${hex}',\n`
      })
      theme += `    }${index < colorSets.length - 1 ? "," : ""}\n`
    })

    theme += `  },\n`

    // Add gradients
    if (gradients.length > 0) {
      theme += `  gradients: {\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient${index + 1}`
        if (gradient.type === "linear") {
          theme += `    ${safeName}: 'linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        } else {
          theme += `    ${safeName}: 'radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        }
      })
      theme += `  },\n`
    }

    theme += `};\n`
    return theme
  }

  /**
   * Generate Material UI Theme
   */
  static generateMaterialUITheme(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let theme = `// Material UI theme colors\nimport { createTheme } from '@mui/material/styles';\n\nconst theme = createTheme({\n  palette: {\n`

    colorSets.forEach((colorSet, index) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      theme += `    ${safeName}: {\n`

      // Find main, light, and dark shades
      const shade500 = colorSet.shades.find((s) => s.shade === 500)
      const shade300 = colorSet.shades.find((s) => s.shade === 300)
      const shade700 = colorSet.shades.find((s) => s.shade === 700)

      if (shade500) {
        theme += `      main: '${shade500.hex}',\n`
      }

      if (shade300) {
        theme += `      light: '${shade300.hex}',\n`
      }

      if (shade700) {
        theme += `      dark: '${shade700.hex}',\n`
      }

      // Add all other shades
      colorSet.shades.forEach(({ shade, hex }) => {
        if (![300, 500, 700].includes(shade)) {
          theme += `      ${shade}: '${hex}',\n`
        }
      })

      theme += `    }${index < colorSets.length - 1 ? "," : ""}\n`
    })

    theme += `  },\n`

    // Add gradients as custom styles
    if (gradients.length > 0) {
      theme += `  customGradients: {\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient${index + 1}`
        if (gradient.type === "linear") {
          theme += `    ${safeName}: 'linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        } else {
          theme += `    ${safeName}: 'radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        }
      })
      theme += `  },\n`
    }

    theme += `});\n\nexport default theme;\n`
    return theme
  }

  /**
   * Generate Chakra UI Theme
   */
  static generateChakraUITheme(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    let theme = `// Chakra UI theme colors\nexport const colors = {\n`

    colorSets.forEach((colorSet, index) => {
      const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
      theme += `  ${safeName}: {\n`
      colorSet.shades.forEach(({ shade, hex }) => {
        theme += `    ${shade}: '${hex}',\n`
      })
      theme += `  }${index < colorSets.length - 1 ? "," : ""}\n`
    })

    theme += `};\n\n`

    // Add gradients as custom styles
    if (gradients.length > 0) {
      theme += `// Custom gradients for Chakra UI\nexport const gradients = {\n`
      gradients.forEach((gradient, index) => {
        const safeName = gradient.name.toLowerCase().replace(/\s+/g, "-") || `gradient${index + 1}`
        if (gradient.type === "linear") {
          theme += `  ${safeName}: 'linear-gradient(${gradient.angle}deg, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        } else {
          theme += `  ${safeName}: 'radial-gradient(circle, ${gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})'${index < gradients.length - 1 ? "," : ""}\n`
        }
      })
      theme += `};\n\n`
    }

    theme += `// Example of extending the Chakra theme\nexport const extendTheme = {\n  colors,\n  gradients,\n};\n`
    return theme
  }

  /**
   * Generate JSON
   */
  static generateJson(colorSets: ColorSet[], gradients: Gradient[] = []): string {
    const jsonData = {
      colors: colorSets.reduce(
        (acc, colorSet) => {
          const safeName = colorSet.name.toLowerCase().replace(/\s+/g, "-")
          acc[safeName] = colorSet.shades.reduce(
            (shadeAcc, { shade, hex }) => {
              shadeAcc[shade] = hex
              return shadeAcc
            },
            {} as Record<number, string>,
          )
          return acc
        },
        {} as Record<string, Record<number, string>>,
      ),
      gradients: gradients.map((gradient) => ({
        id: gradient.id,
        name: gradient.name,
        type: gradient.type,
        angle: gradient.angle,
        stops: gradient.stops.map((stop) => ({
          color: stop.color,
          position: stop.position,
          id: stop.id,
        })),
      })),
    }

    return JSON.stringify(jsonData, null, 2)
  }
}

const getPlugin = async (p: string) => await dprint.createStreaming(await globalThis.fetch(`https://hungry-coyote-29.deno.dev/${p}.wasm`));

ExportFormatter.fmt.ts = await getPlugin("typescript-0.94.0");
ExportFormatter.fmt.css = await getPlugin("g-plane/malva-v0.11.2");
ExportFormatter.fmt.json = await getPlugin("json-0.20.0");
ExportFormatter.fmt.toml = await getPlugin("toml-0.7.0");
