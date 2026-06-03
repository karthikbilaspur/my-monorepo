import { useState, useEffect } from 'react'
import { Copy, RefreshCw } from 'lucide-react'

function App() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    let charset = ''
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (!charset) return setPassword('Select at least 1 option')
    
    let newPassword = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length]
    }
    setPassword(newPassword)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStrength = () => {
    let score = 0
    if (length >= 12) score++
    if (length >= 16) score++
    if (includeUpper && includeLower) score++
    if (includeNumbers) score++
    if (includeSymbols) score++
    
    if (score <= 2) return 'weak'
    if (score <= 4) return 'medium'
    return 'strong'
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols])

  return (
    <div className="container">
      <h1>Password Generator</h1>
      
      <div className="password-box">
        {password}
      </div>
      <div className={`strength ${getStrength()}`}></div>

      <button className="copy-btn" onClick={copyToClipboard}>
        <Copy size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        {copied ? 'Copied!' : 'Copy Password'}
      </button>

      <div className="controls">
        <div className="control-row">
          <label>Length: {length}</label>
          <input 
            type="range" 
            min="4" 
            max="64" 
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <div className="control-row">
          <label>Uppercase A-Z</label>
          <input 
            type="checkbox" 
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
          />
        </div>

        <div className="control-row">
          <label>Lowercase a-z</label>
          <input 
            type="checkbox" 
            checked={includeLower}
            onChange={(e) => setIncludeLower(e.target.checked)}
          />
        </div>

        <div className="control-row">
          <label>Numbers 0-9</label>
          <input 
            type="checkbox" 
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
        </div>

        <div className="control-row">
          <label>Symbols !@#$</label>
          <input 
            type="checkbox" 
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
        </div>

        <button onClick={generatePassword}>
          <RefreshCw size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Regenerate
        </button>
      </div>
    </div>
  )
}

export default App