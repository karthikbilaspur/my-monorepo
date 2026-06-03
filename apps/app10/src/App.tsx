import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react'

interface ImageData {
  file: File
  url: string
  size: number
}

function App() {
  const [original, setOriginal] = useState<ImageData | null>(null)
  const [compressed, setCompressed] = useState<ImageData | null>(null)
  const [quality, setQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [format, setFormat] = useState<'jpeg' | 'webp' | 'png'>('jpeg')
  const [compressing, setCompressing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const url = URL.createObjectURL(file)
    setOriginal({ file, url, size: file.size })
    setCompressed(null)
    await compressImage(file)
  }

  const compressImage = async (file: File) => {
    setCompressing(true)
    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality,
        fileType: format === 'jpeg'? 'image/jpeg' : format === 'png'? 'image/png' : 'image/webp'
      }

      const compressedFile = await imageCompression(file, options)
      const url = URL.createObjectURL(compressedFile)
      setCompressed({ file: compressedFile, url, size: compressedFile.size })
    } catch (error) {
      console.error('Compression failed:', error)
      alert('Compression failed. Try a different image.')
    }
    setCompressing(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const savings = original && compressed
  ? Math.round(((original.size - compressed.size) / original.size) * 100)
    : 0

  const downloadCompressed = () => {
    if (!compressed) return
    const a = document.createElement('a')
    a.href = compressed.url
    a.download = `compressed-${compressed.file.name}`
    a.click()
  }

  const clearAll = () => {
    setOriginal(null)
    setCompressed(null)
  }

  return (
    <div className="container">
      <h1>Image Compressor</h1>

      {!original && (
        <div
          className={`drop-zone ${dragging? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <ImageIcon size={48} style={{ margin: '0 auto', color: '#737373' }} />
          <p style={{ marginTop: '1rem', color: '#fafafa', fontWeight: 600 }}>
            Drop image here or click to upload
          </p>
          <p>PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{ display: 'none' }}
      />

      {original && (
        <>
          <div className="settings">
            <div className="setting-group">
              <label>Quality: <span className="value-display">{Math.round(quality * 100)}%</span></label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>Max Width: <span className="value-display">{maxWidth}px</span></label>
              <input
                type="range"
                min="480"
                max="3840"
                step="160"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
              />
            </div>

            <div className="setting-group">
              <label>Output Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value as any)}>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>

          {compressing && <div className="progress">Compressing...</div>}

          <div className="compare-grid">
            <div className="image-panel">
              <div className="panel-header">
                <span>Original</span>
                <span className="badge">{formatBytes(original.size)}</span>
              </div>
              <div className="image-wrapper">
                <img src={original.url} alt="Original" />
              </div>
              <div className="stats">
                <div className="stat">
                  <span>Size</span>
                  <span className="stat-value">{formatBytes(original.size)}</span>
                </div>
              </div>
            </div>

            <div className="image-panel">
              <div className="panel-header">
                <span>Compressed</span>
                <span className="badge">
                  {compressed? formatBytes(compressed.size) : '-'}
                </span>
              </div>
              <div className="image-wrapper">
                {compressed? (
                  <img src={compressed.url} alt="Compressed" />
                ) : (
                  <span style={{ color: '#737373' }}>Compressing...</span>
                )}
              </div>
              {compressed && (
                <div className="stats">
                  <div className="stat">
                    <span>Size</span>
                    <span className="stat-value">{formatBytes(compressed.size)}</span>
                  </div>
                  <div className="stat">
                    <span>Saved</span>
                    <span className="stat-value savings">{savings}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="btn-group">
            <button onClick={() => original && compressImage(original.file)} disabled={compressing}>
              <Upload size={16} />
              Recompress
            </button>
            <button className="btn-secondary" onClick={downloadCompressed} disabled={!compressed}>
              <Download size={16} />
              Download
            </button>
            <button className="btn-secondary" onClick={clearAll}>
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