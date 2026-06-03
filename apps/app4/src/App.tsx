import { useState } from 'react'
import { RefreshCw, Download, Copy, Lock, Unlock, Shuffle } from 'lucide-react'

type Color = {
  hex: string
  locked: boolean
  copied: boolean
}

function App() {
  const [colors, setColors] = useState<Color[]>(generatePalette(5))
  const [mode, setMode] = useState<'random' | 'monochromatic' | 'analogous' | 'complementary'>('random')
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'json'>('css')

  function randomHex(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  }

  function hexToHSL(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max!== min) {
      const d = max - min
      s = l > 0.5? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  function HSLToHex(h: number, s: number, l: number): string {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0')
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
  }

  function generatePalette(count: number): Color[] {
    return Array.from({ length: count }, () => ({
      hex: randomHex(),
      locked: false,
      copied: false
    }))
  }

  function generateModePalette() {
    setColors(prev => {
      const baseColor = prev.find(c => c.locked)?.hex || randomHex()
      const hsl = hexToHSL(baseColor)
      const newColors = prev.map(c => {
        if (c.locked) return c
        let newHex = randomHex()
        
        if (mode === 'monochromatic') {
          const newL = Math.random() * 80 + 10
          newHex = HSLToHex(hsl.h, hsl.s, newL)
        } else if (mode === 'analogous') {
          const newH = (hsl.h + (Math.random() - 0.5) * 60 + 360) % 360
          newHex = HSLToHex(newH, hsl.s, hsl.l)
        } else if (mode === 'complementary') {
          const newH = (hsl.h + 180) % 360
          newHex = HSLToHex(newH, hsl.s, hsl.l)
        }
        
        return { hex: newHex, locked: false, copied: false }
      })
      return newColors
    })
  }

  function toggleLock(index: number) {
    setColors(prev => prev.map((c, i) => i === index? { ...c, locked:!c.locked } : c))
  }

  function copyColor(hex: string, index: number) {
    navigator.clipboard.writeText(hex)
    setColors(prev => prev.map((c, i) => i === index? { ...c, copied: true } : c))
    setTimeout(() => {
      setColors(prev => prev.map((c, i) => i === index? { ...c, copied: false } : c))
    }, 1500)
  }

  function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  function getExport() {
    if (exportFormat === 'css') {
      return colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')
    } else if (exportFormat === 'tailwind') {
      const obj = colors.reduce((acc, c, i) => {
        acc[`color${i + 1}`] = c.hex
        return acc
      }, {} as Record<string, string>)
      return JSON.stringify({ colors: obj }, null, 2)
    } else {
      return JSON.stringify(colors.map(c => c.hex), null, 2)
    }
  }

  function exportPalette() {
    const content = getExport()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `palette-${Date.now()}.${exportFormat === 'json'? 'json' : 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <h1>Color Palette Generator</h1>

      <div className="controls">
        <button onClick={generateModePalette}>
          <Shuffle size={16} />
          Generate
        </button>
        <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
          <option value="random">Random</option>
          <option value="monochromatic">Monochromatic</option>
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
        </select>
        <button className="btn-secondary" onClick={exportPalette}>
          <Download size={16} />
          Export
        </button>
        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as any)}>
          <option value="css">CSS Variables</option>
          <option value="tailwind">Tailwind Config</option>
          <option value="json">JSON Array</option>
        </select>
      </div>

      <div className="palette">
        {colors.map((color, i) => (
          <div
            key={i}
            className="color-card"
            style={{ backgroundColor: color.hex }}
            onClick={() => copyColor(color.hex, i)}
          >
            <button 
              className="lock-btn" 
              onClick={(e) => { e.stopPropagation(); toggleLock(i) }}
            >
              {color.locked? <Lock size={14} /> : <Unlock size={14} />}
            </button>
            {color.copied && <div className="copied-badge">Copied!</div>}
            <div className="color-info">
              <span>{color.hex.toUpperCase()}</span>
              <span>{hexToRgb(color.hex)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="export-box">{getExport()}</div>
    </div>
  )
}

export default App