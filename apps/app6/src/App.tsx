import { useState, useRef } from 'react'
import { ArrowRightLeft, Copy, Trash2, Upload, Image as ImageIcon } from 'lucide-react'

type Mode = 'text' | 'image'

function App() {
  const [mode, setMode] = useState<Mode>('text')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const encodeText = () => {
    try {
      setError('')
      setOutput(btoa(unescape(encodeURIComponent(input))))
    } catch (e: any) {
      setError('Failed to encode: ' + e.message)
    }
  }

  const decodeText = () => {
    try {
      setError('')
      setOutput(decodeURIComponent(escape(atob(input))))
    } catch (e: any) {
      setError('Invalid Base64 string')
      setOutput('')
    }
  }

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      setOutput(result)
      setInput(file.name)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }

  const decodeImage = () => {
    try {
      setError('')
      if (!input.startsWith('data:image/')) {
        setError('Invalid image data URL')
        return
      }
      setImagePreview(input)
      setOutput('Image decoded successfully')
    } catch (e: any) {
      setError('Failed to decode image')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput(input)
    setError('')
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setImagePreview('')
  }

  return (
    <div className="container">
      <h1>Base64 Encoder/Decoder</h1>

      <div className="tabs">
        <button
          className={`tab ${mode === 'text'? 'active' : ''}`}
          onClick={() => { setMode('text'); clearAll() }}
        >
          Text
        </button>
        <button
          className={`tab ${mode === 'image'? 'active' : ''}`}
          onClick={() => { setMode('image'); clearAll() }}
        >
          Image
        </button>
      </div>

      {mode === 'text'? (
        <>
          <div className="grid">
            <div className="panel">
              <div className="panel-header">
                <span>Input</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or base64 to decode..."
              />
            </div>

            <div className="panel">
              <div className="panel-header">
                <span>Output</span>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="btn-group">
            <button onClick={encodeText} disabled={!input}>
              Encode →
            </button>
            <button onClick={decodeText} disabled={!input}>
              ← Decode
            </button>
            <button className="btn-secondary" onClick={swap} disabled={!input &&!output}>
              <ArrowRightLeft size={16} />
              Swap
            </button>
            <button className="btn-secondary" onClick={copyOutput} disabled={!output}>
              <Copy size={16} />
              {copied? 'Copied!' : 'Copy'}
            </button>
            <button className="btn-secondary" onClick={clearAll} disabled={!input &&!output}>
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid">
            <div className="panel">
              <div className="panel-header">
                <span>Upload Image / Paste Base64</span>
              </div>
              <div
                className={`drop-zone ${dragging? 'dragging' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <ImageIcon size={32} style={{ margin: '0 auto 0.5rem' }} />
                <div>Drop image here or click to upload</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Or paste base64 data URL here..."
                style={{ minHeight: '150px', marginTop: '1rem' }}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>

            <div className="panel">
              <div className="panel-header">
                <span>Base64 Output</span>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Base64 string will appear here..."
              />
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="btn-group">
            <button onClick={decodeImage} disabled={!input}>
              Decode Image
            </button>
            <button className="btn-secondary" onClick={copyOutput} disabled={!output}>
              <Copy size={16} />
              {copied? 'Copied!' : 'Copy Base64'}
            </button>
            <button className="btn-secondary" onClick={clearAll} disabled={!input &&!output}>
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App