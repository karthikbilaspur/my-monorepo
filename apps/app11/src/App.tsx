import { useState, useRef } from 'react'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcryptjs'
import { Copy, Trash2, Upload, RefreshCw } from 'lucide-react'

type Mode = 'text' | 'file'

interface HashResult {
  name: string
  value: string
}

function App() {
  const [mode, setMode] = useState<Mode>('text')
  const [input, setInput] = useState('Hello World')
  const [file, setFile] = useState<File | null>(null)
  const [hashes, setHashes] = useState<HashResult[]>([])
  const [bcryptRounds, setBcryptRounds] = useState(10)
  const [hashing, setHashing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateHashes = async () => {
    setHashing(true)
    const text = mode === 'text'? input : await readFileAsText(file!)

    const results: HashResult[] = [
      { name: 'MD5', value: CryptoJS.MD5(text).toString() },
      { name: 'SHA1', value: CryptoJS.SHA1(text).toString() },
      { name: 'SHA256', value: CryptoJS.SHA256(text).toString() },
      { name: 'SHA512', value: CryptoJS.SHA512(text).toString() },
      { name: 'SHA3', value: CryptoJS.SHA3(text).toString() },
      { name: 'RIPEMD160', value: CryptoJS.RIPEMD160(text).toString() },
    ]

    // Bcrypt is async and expensive
    const bcryptHash = await bcrypt.hash(text, bcryptRounds)
    results.push({ name: `Bcrypt (${bcryptRounds} rounds)`, value: bcryptHash })

    setHashes(results)
    setHashing(false)
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const handleFile = (f: File) => {
    setFile(f)
    setHashes([])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const copyHash = async (value: string) => {
    await navigator.clipboard.writeText(value)
  }

  const copyAll = async () => {
    const text = hashes.map(h => `${h.name}: ${h.value}`).join('\n')
    await navigator.clipboard.writeText(text)
  }

  const clearAll = () => {
    setInput('')
    setFile(null)
    setHashes([])
  }

  return (
    <div className="container">
      <h1>Hash Generator</h1>
      <p className="subtitle">MD5, SHA1, SHA256, SHA512, SHA3, RIPEMD160, Bcrypt</p>

      <div className="tabs">
        <button
          className={`tab ${mode === 'text'? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          Text
        </button>
        <button
          className={`tab ${mode === 'file'? 'active' : ''}`}
          onClick={() => setMode('file')}
        >
          File
        </button>
      </div>

      {mode === 'text'? (
        <div className="input-area">
          <label>Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
          />
        </div>
      ) : (
        <div className="input-area">
          <label>Upload File</label>
          <div
            className={`file-drop ${dragging? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <Upload size={32} style={{ margin: '0 auto', color: '#737373' }} />
            <p style={{ marginTop: '0.5rem', color: '#fafafa' }}>
              {file? file.name : 'Drop file here or click to upload'}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
          {file && (
            <div className="file-info">
              <span>{file.name}</span>
              <span>{(file.size / 1024).toFixed(2)} KB</span>
            </div>
          )}
        </div>
      )}

      <div className="bcrypt-options">
        <label>Bcrypt Rounds:</label>
        <input
          type="number"
          min="4"
          max="15"
          value={bcryptRounds}
          onChange={(e) => setBcryptRounds(Number(e.target.value))}
        />
        <span style={{ fontSize: '0.75rem', color: '#737373' }}>Higher = slower but more secure</span>
      </div>

      <div className="btn-group">
        <button onClick={generateHashes} disabled={hashing || (mode === 'text'?!input :!file)}>
          <RefreshCw size={16} />
          {hashing? 'Hashing...' : 'Generate Hashes'}
        </button>
        <button className="btn-secondary" onClick={copyAll} disabled={hashes.length === 0}>
          <Copy size={16} />
          Copy All
        </button>
        <button className="btn-secondary" onClick={clearAll} disabled={!input &&!file && hashes.length === 0}>
          <Trash2 size={16} />
          Clear
        </button>
      </div>

      {hashes.length > 0 && (
        <div className="results">
          {hashes.map((hash, i) => (
            <div key={i} className="hash-item">
              <div className="hash-header">
                <span className="hash-name">{hash.name}</span>
                <button className="btn-icon" onClick={() => copyHash(hash.value)}>
                  <Copy size={14} />
                </button>
              </div>
              <div className="hash-value">{hash.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App