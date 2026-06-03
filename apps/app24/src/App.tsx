import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download, Link } from 'lucide-react'

function App() {
  const [text, setText] = useState('https://github.com')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = async () => {
    if (!canvasRef.current || !text) return
    
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: errorLevel
      })
    } catch (err) {
      console.error('Failed to generate QR:', err)
    }
  }

  const downloadQR = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qrcode-${Date.now()}.png`
    a.click()
  }

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob(async (blob) => {
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
      }
    })
  }

  useEffect(() => {
    generateQR()
  }, [text, size, fgColor, bgColor, errorLevel])

  return (
    <div className="container">
      <h1>QR Code Generator</h1>
      
      <div className="input-group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL or text to encode..."
        />
      </div>

      <div className="controls">
        <div className="control">
          <label>Size: {size}px</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>

        <div className="control">
          <label>Error Correction</label>
          <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as any)}>
            <option value="L">Low 7%</option>
            <option value="M">Medium 15%</option>
            <option value="Q">Quartile 25%</option>
            <option value="H">High 30%</option>
          </select>
        </div>

        <div className="control">
          <label>QR Color</label>
          <input 
            type="color" 
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
          />
        </div>

        <div className="control">
          <label>Background</label>
          <input 
            type="color" 
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
      </div>

      <div className="qr-wrapper">
        <canvas ref={canvasRef} />
      </div>

      <div className="btn-group">
        <button onClick={downloadQR} disabled={!text}>
          <Download size={16} />
          Download PNG
        </button>
        <button className="secondary" onClick={copyToClipboard} disabled={!text}>
          <Link size={16} />
          Copy Image
        </button>
      </div>
    </div>
  )
}

export default App