import { useState } from 'react'
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'
import { RefreshCw, Copy, Trash2, Download, Atom } from 'lucide-react'

type GeneratorType = 'uuid' | 'number' | 'color' | 'string' | 'name'

function App() {
  const [activeTab, setActiveTab] = useState<GeneratorType>('uuid')
  const [results, setResults] = useState<string[]>([])
  const [count, setCount] = useState(5)

  // UUID settings
  const [uuidVersion, setUuidVersion] = useState<'v4' | 'v7'>('v4')

  // Number settings
  const [minNum, setMinNum] = useState(1)
  const [maxNum, setMaxNum] = useState(100)
  const [allowDecimals, setAllowDecimals] = useState(false)

  // String settings
  const [stringLength, setStringLength] = useState(12)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(false)

  const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage', 'River']
  const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

  const generateUUID = () => {
    const newResults = Array.from({ length: count }, () =>
      uuidVersion === 'v4'? uuidv4() : uuidv7()
    )
    setResults(newResults)
  }

  const generateNumber = () => {
    const newResults = Array.from({ length: count }, () => {
      const num = Math.random() * (maxNum - minNum) + minNum
      return allowDecimals? num.toFixed(2) : Math.floor(num).toString()
    })
    setResults(newResults)
  }

  const generateColor = () => {
    const newResults = Array.from({ length: count }, () => {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      return hex
    })
    setResults(newResults)
  }

  const generateString = () => {
    const chars = [
      'abcdefghijklmnopqrstuvwxyz',
      useUppercase? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      useNumbers? '0123456789' : '',
      useSymbols? '!@#$%^&*()_+-=[]{}|;:,.<>?' : ''
    ].join('')

    const newResults = Array.from({ length: count }, () => {
      return Array.from({ length: stringLength }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    })
    setResults(newResults)
  }

  const generateName = () => {
    const newResults = Array.from({ length: count }, () => {
      const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
      const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
      return `${first} ${last}`
    })
    setResults(newResults)
  }

  const generate = () => {
    switch (activeTab) {
      case 'uuid': generateUUID(); break
      case 'number': generateNumber(); break
      case 'color': generateColor(); break
      case 'string': generateString(); break
      case 'name': generateName(); break
    }
  }

  const copyItem = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(results.join('\n'))
  }

  const downloadTxt = () => {
    const blob = new Blob([results.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `radium-${activeTab}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <h1><Atom size={24} /> Radium Generator</h1>
      <p className="subtitle">Generate random UUIDs, numbers, colors, strings, and names</p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'uuid'? 'active' : ''}`}
          onClick={() => setActiveTab('uuid')}
        >
          UUID
        </button>
        <button
          className={`tab ${activeTab === 'number'? 'active' : ''}`}
          onClick={() => setActiveTab('number')}
        >
          Number
        </button>
        <button
          className={`tab ${activeTab === 'color'? 'active' : ''}`}
          onClick={() => setActiveTab('color')}
        >
          Color
        </button>
        <button
          className={`tab ${activeTab === 'string'? 'active' : ''}`}
          onClick={() => setActiveTab('string')}
        >
          String
        </button>
        <button
          className={`tab ${activeTab === 'name'? 'active' : ''}`}
          onClick={() => setActiveTab('name')}
        >
          Name
        </button>
      </div>

      <div className="generator">
        <div className="input-row">
          <div className="input-group">
            <label>Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          {activeTab === 'uuid' && (
            <div className="input-group">
              <label>Version</label>
              <select value={uuidVersion} onChange={(e) => setUuidVersion(e.target.value as any)}>
                <option value="v4">v4 - Random</option>
                <option value="v7">v7 - Timestamp</option>
              </select>
            </div>
          )}

          {activeTab === 'number' && (
            <>
              <div className="input-group">
                <label>Min</label>
                <input
                  type="number"
                  value={minNum}
                  onChange={(e) => setMinNum(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>Max</label>
                <input
                  type="number"
                  value={maxNum}
                  onChange={(e) => setMaxNum(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={allowDecimals}
                    onChange={(e) => setAllowDecimals(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Decimals
                </label>
              </div>
            </>
          )}

          {activeTab === 'string' && (
            <>
              <div className="input-group">
                <label>Length</label>
                <input
                  type="number"
                  min="1"
                  max="128"
                  value={stringLength}
                  onChange={(e) => setStringLength(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={useUppercase}
                    onChange={(e) => setUseUppercase(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  A-Z
                </label>
              </div>
              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  0-9
                </label>
              </div>
              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Symbols
                </label>
              </div>
            </>
          )}
        </div>

        <div className="btn-group">
          <button onClick={generate}>
            <RefreshCw size={16} />
            Generate
          </button>
          <button className="btn-secondary" onClick={copyAll} disabled={results.length === 0}>
            <Copy size={16} />
            Copy All
          </button>
          <button className="btn-secondary" onClick={downloadTxt} disabled={results.length === 0}>
            <Download size={16} />
            Download
          </button>
          <button className="btn-secondary" onClick={() => setResults([])} disabled={results.length === 0}>
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      <div className="output">
        {results.length === 0? (
          <div style={{ color: '#737373', textAlign: 'center', padding: '2rem' }}>
            Click Generate to create random data
          </div>
        ) : (
          results.map((item, i) => (
            <div key={i} className="output-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {activeTab === 'color' && (
                  <div className="color-swatch" style={{ backgroundColor: item }} />
                )}
                <span className="output-text">{item}</span>
              </div>
              <button className="btn-icon" onClick={() => copyItem(item)}>
                <Copy size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
