import { useState } from 'react'
import { Copy, Download, Upload, Trash2, Minimize2, Maximize2 } from 'lucide-react'

function App() {
  const [input, setInput] = useState('{"name":"John","age":30,"city":"NYC","hobbies":["coding","coffee"]}')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  const formatJSON = (minify = false) => {
    setError('')
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = minify
       ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indent)
      setOutput(formatted)
    } catch (e: any) {
      setError(e.message)
      setOutput('')
    }
  }

  const validateJSON = () => {
    try {
      JSON.parse(input)
      setError('')
      return true
    } catch (e: any) {
      setError(e.message)
      return false
    }
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJSON = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formatted-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setInput(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const isValid =!error && input.trim()!== ''

  return (
    <div className="container">
      <h1>JSON Formatter</h1>

      <div className="editor-grid">
        <div className="panel">
          <div className="panel-header">
            <span>Input</span>
            {input && (
              <span className={`status ${isValid? 'valid' : 'invalid'}`}>
                {isValid? 'Valid JSON' : 'Invalid JSON'}
              </span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className={error? 'error' : ''}
          />
          {error && <div className="error-text">{error}</div>}
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>Output</span>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      <div className="btn-group">
        <button onClick={() => formatJSON(false)} disabled={!input}>
          <Maximize2 size={16} />
          Format
        </button>
        <button className="btn-secondary" onClick={() => formatJSON(true)} disabled={!input}>
          <Minimize2 size={16} />
          Minify
        </button>
        <button className="btn-secondary" onClick={validateJSON} disabled={!input}>
          Validate
        </button>
        <button className="btn-secondary" onClick={copyOutput} disabled={!output}>
          <Copy size={16} />
          {copied? 'Copied!' : 'Copy'}
        </button>
        <button className="btn-secondary" onClick={downloadJSON} disabled={!output}>
          <Download size={16} />
          Download
        </button>
        <label>
          <button className="btn-secondary" type="button">
            <Upload size={16} />
            Upload
          </button>
          <input type="file" accept=".json" onChange={uploadFile} style={{ display: 'none' }} />
        </label>
        <button className="btn-secondary" onClick={clearAll} disabled={!input &&!output}>
          <Trash2 size={16} />
          Clear
        </button>
      </div>
    </div>
  )
}

export default App