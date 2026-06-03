import { useState, useMemo } from 'react'
import { Copy, Trash2, BookOpen } from 'lucide-react'

type Flag = 'g' | 'i' | 'm' | 's' | 'u' | 'y'

interface Match {
  match: string
  index: number
  groups: string[]
}

const PRESETS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
  { name: 'Phone US', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})' },
  { name: 'Date YYYY-MM-DD', pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])' },
]

function App() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [testString, setTestString] = useState('Contact us at hello@example.com or support@test.org\nInvalid: not-an-email')
  const [flags, setFlags] = useState<Set<Flag>>(new Set(['g']))
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const toggleFlag = (flag: Flag) => {
    const newFlags = new Set(flags)
    if (newFlags.has(flag)) {
      newFlags.delete(flag)
    } else {
      newFlags.add(flag)
    }
    setFlags(newFlags)
  }

  const { regex, matches, highlightedText } = useMemo(() => {
    setError('')
    if (!pattern) return { regex: null, matches: [], highlightedText: testString }

    try {
      const regex = new RegExp(pattern, Array.from(flags).join(''))
      const matches: Match[] = []
      let match
      const re = new RegExp(regex.source, regex.flags.includes('g')? regex.flags : regex.flags + 'g')

      while ((match = re.exec(testString))!== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        })
        if (!regex.flags.includes('g')) break
      }

      let highlighted = testString
      let offset = 0
      matches.forEach(m => {
        const before = highlighted.slice(0, m.index + offset)
        const matched = highlighted.slice(m.index + offset, m.index + offset + m.match.length)
        const after = highlighted.slice(m.index + offset + m.match.length)
        const marked = `<mark>${matched}</mark>`
        highlighted = before + marked + after
        offset += marked.length - m.match.length
      })

      return { regex, matches, highlightedText: highlighted }
    } catch (e: any) {
      setError(e.message)
      return { regex: null, matches: [], highlightedText: testString }
    }
  }, [pattern, testString, flags])

  const applyPreset = (presetPattern: string) => {
    setPattern(presetPattern)
  }

  const copyRegex = async () => {
    await navigator.clipboard.writeText(`/${pattern}/${Array.from(flags).join('')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setPattern('')
    setTestString('')
    setError('')
  }

  return (
    <div className="container">
      <h1>Regex Tester</h1>

      <div className="presets">
        {PRESETS.map(p => (
          <button key={p.name} className="preset-btn" onClick={() => applyPreset(p.pattern)}>
            <BookOpen size={14} />
            {p.name}
          </button>
        ))}
      </div>

      <div className="input-group">
        <div className="label-row">
          <label>Regular Expression</label>
          <div className="flags">
            {(['g', 'i', 'm', 's', 'u', 'y'] as Flag[]).map(f => (
              <button
                key={f}
                className={`flag-btn ${flags.has(f)? 'active' : ''}`}
                onClick={() => toggleFlag(f)}
                title={{
                  g: 'Global - find all matches',
                  i: 'Case insensitive',
                  m: 'Multiline - ^$ match line starts/ends',
                  s: 'Dot matches newline',
                  u: 'Unicode',
                  y: 'Sticky'
                }[f]}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className={`regex-input ${error? 'error' : ''}`}>
          <span>/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
          />
          <span>/{Array.from(flags).join('')}</span>
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>

      <div className="input-group">
        <label>Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against..."
        />
      </div>

      <div className="results">
        <div className="results-header">
          <label>Results</label>
          <div className="match-count none">
            {matches.length} {matches.length === 1? 'match' : 'matches'}
          </div>
        </div>

        <div
          className="highlighted-text"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />

        {matches.length > 0 && (
          <div className="match-list">
            {matches.map((m, i) => (
              <div key={i} className="match-item">
                <div className="match-item-header">Match {i + 1} at index {m.index}</div>
                <div>{m.match}</div>
                {m.groups.length > 0 && (
                  <div className="groups">
                    {m.groups.map((g, j) => (
                      <div key={j} className="group-item">Group {j + 1}: {g || '(empty)'}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="btn-group">
        <button onClick={copyRegex}>
          <Copy size={16} />
          {copied? 'Copied!' : 'Copy Regex'}
        </button>
        <button className="btn-secondary" onClick={clearAll}>
          <Trash2 size={16} />
          Clear
        </button>
      </div>
    </div>
  )
}

export default App