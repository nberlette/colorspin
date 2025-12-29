# 🎨 ColorSpin

> A powerful, interactive color palette generator for designers and developers. Create beautiful, accessible color systems with just a few clicks.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://colorspin.vercel.app)
[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

---

## ✨ Features

### 🎨 **Intelligent Color Generation**
- **10-shade palettes** automatically generated from a single base color
- Smart lightness distribution from 50 (lightest) to 900 (darkest)
- Real-time preview as you adjust parameters

### 🔧 **Advanced Controls**
- **Vibrancy slider**: Adjust color saturation intensity (0-100%)
- **Hue shift**: Rotate colors around the color wheel (-180° to +180°)
- **Interactive hex color picker** with live preview
- **Randomize button**: Generate inspiring color combinations instantly

### 🎭 **Multi-Palette Management**
- Create and manage **multiple color sets** in one workspace
- Name each color set for easy organization
- Quick switching between palettes
- Delete individual sets (with safety guard for last palette)

### 🌈 **Color Harmony Explorer**
Discover professional color schemes based on color theory:
- **Complementary**: Colors opposite on the wheel
- **Analogous**: Adjacent harmonious colors
- **Triadic**: Three evenly-spaced colors
- **Tetradic**: Four colors in complementary pairs
- **Split Complementary**: Base + two near-complement colors
- **Monochromatic**: Shades of a single hue

### 🎨 **Gradient Generator**
- Create **linear** and **radial** gradients
- Add/remove color stops dynamically
- Adjust stop positions with visual sliders
- Control gradient angle (linear) or center (radial)
- Export to CSS with one click

### ♿ **Accessibility Tools**
- **WCAG contrast ratio checker** for all shade combinations
- Automatic AA/AAA level compliance indicators
- Pass/fail status for text readability
- Ensures your designs are accessible to everyone

### 📋 **Export Options**
- Copy individual hex values with one click
- Export complete palette as:
  - **CSS custom properties** (CSS variables)
  - **Tailwind config** (drop-in configuration)
  - **JSON** (for programmatic use)
  - **Gradient CSS** (ready-to-use code)

### 🌓 **Dark Mode Support**
- Toggle between light and dark themes
- Theme preference persisted across sessions
- Optimized contrast for both modes

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/nberlette/colorspin.git
cd colorspin

# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Run the development server
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action! 🎉

---

## 🎯 Usage

### Creating Your First Palette

1. **Pick a base color** using the hex color picker or enter a hex value
2. **Adjust vibrancy** to control color saturation
3. **Apply hue shift** to explore color variations
4. **Click any shade** to copy its hex value to clipboard

### Exploring Color Harmonies

1. Navigate to the **"Harmonies"** tab
2. Browse color theory-based combinations
3. Click any harmony color to set it as your base color
4. Watch the palette regenerate instantly

### Building Gradients

1. Switch to the **"Gradients"** tab
2. Add color stops with the **"Add Stop"** button
3. Adjust stop positions and colors
4. Choose gradient type (linear/radial)
5. Set angle for linear gradients
6. Click **"Copy CSS"** to use in your project

### Checking Accessibility

1. Open the **"Contrast"** tab
2. Review contrast ratios for all shade pairs
3. Check WCAG AA/AAA compliance indicators
4. Ensure text meets accessibility standards

---

## 🏗️ Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[react-colorful](https://github.com/omgovich/react-colorful)** - Color picker
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons

---

## 📁 Project Structure

```
colorspin/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── color-palette-generator.tsx  # Main component (1600+ lines)
│   └── ui/                      # Shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
├── hooks/
│   └── use-toast.tsx            # Toast notification hook
├── styles/                       # Additional styles
├── public/                       # Static assets
└── tailwind.config.js           # Tailwind configuration
```

---

## 🎨 Color Science

ColorSpin uses **HSL (Hue, Saturation, Lightness)** color space for intelligent palette generation:

- **Hue** (0-360°): Position on the color wheel
- **Saturation** (0-100%): Color intensity/vibrancy
- **Lightness** (0-100%): Brightness of the color

This approach ensures:
- ✅ Consistent lightness progression across shades
- ✅ Natural-looking color variations
- ✅ Better control over color relationships
- ✅ Accessible contrast ratios

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Acknowledgments

- Inspired by tools like [Coolors](https://coolors.co/) and [Color Hunt](https://colorhunt.co/)
- Built with amazing open-source libraries
- Color theory principles from traditional design education

---

## 🔗 Links

- **Live Demo**: [colorspin.vercel.app](https://colorspin.vercel.app)
- **Repository**: [github.com/nberlette/colorspin](https://github.com/nberlette/colorspin)
- **Issues**: [Report a bug or request a feature](https://github.com/nberlette/colorspin/issues)

---

<div align="center">

**Made with ❤️ by [Nicholas Berlette](https://github.com/nberlette)**

*If you find this useful, please consider giving it a ⭐️!*

</div>