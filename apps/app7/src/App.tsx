import { useState } from 'react'
import { Copy, RefreshCw, Download } from 'lucide-react'

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
  'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
  'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis',
  'unde', 'omnis', 'iste', 'natus', 'error', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab',
  'illo', 'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae',
  'dicta', 'explicabo', 'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas',
  'aspernatur', 'aut', 'odit', 'fugit', 'consequuntur', 'magni', 'dolores',
  'eos', 'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem'
]

type Unit = 'paragraphs' | 'sentences' | 'words'

function App() {
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState<Unit>('paragraphs')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const randomWord = (): string => {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
  }

  const generateSentence = (): string => {
    const length = Math.floor(Math.random() * 10) + 8
    const words = Array.from({ length }, randomWord)
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
  }

  const generateParagraph = (): string => {
    const length = Math.floor(Math.random() * 3) + 4
    return Array.from({ length }, generateSentence).join(' ')
  }

  const generate = () => {
    let result = ''

    if (unit === 'words') {
      const words = Array.from({ length: count }, randomWord)
      if (startWithLorem) {
        words[0] = 'lorem'
        if (count > 1) words[1] = 'ipsum'
        if (count > 2) words[2] = 'dolor'
      }
      result = words.join(' ')
    } else if (unit === 'sentences') {
      const sentences = Array.from({ length: count }, generateSentence)
      if (startWithLorem) {
        sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + sentences[0].split(' ').slice(6).join(' ')
      }
      result = sentences.join(' ')
    } else {
      const paragraphs = Array.from({ length: count }, generateParagraph)
      if (startWithLorem) {
        paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0].split(' ').slice(8).join(' ')
      }
      result = paragraphs.join('\n\n')
    }

    setOutput(result)
  }

  const copyText = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadText = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lorem-ipsum-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStats = () => {
    const words = output.split(/\s+/).filter(Boolean).length
    const chars = output.length
    const paragraphs = output.split('\n\n').filter(Boolean).length
    return { words, chars, paragraphs }
  }

  const stats = getStats()

  return (
    <div className="container">
      <h1>Lorem Ipsum Generator</h1>

      <div className="controls">
        <div className="control">
          <label>Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        <div className="control">
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div className="control">
          <label>Options</label>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="lorem"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
            />
            <label htmlFor="lorem">Start with "Lorem ipsum"</label>
          </div>
        </div>
      </div>

      <div className="btn-group" style={{ marginBottom: '1rem' }}>
        <button onClick={generate}>
          <RefreshCw size={16} />
          Generate
        </button>
        <button className="btn-secondary" onClick={copyText} disabled={!output}>
          <Copy size={16} />
          {copied? 'Copied!' : 'Copy'}
        </button>
        <button className="btn-secondary" onClick={downloadText} disabled={!output}>
          <Download size={16} />
          Download
        </button>
      </div>

      {output && (
        <div className="stats">
          <span>{stats.words} words</span>
          <span>{stats.chars} characters</span>
          <span>{stats.paragraphs} paragraphs</span>
        </div>
      )}

      <div className="output">
        {output? output.split('\n\n').map((p, i) => <p key={i}>{p}</p>) : (
          <span style={{ color: '#a3a3a3' }}>Click "Generate" to create lorem ipsum text...</span>
        )}
      </div>
    </div>
  )
}

export default App