import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Download, Copy, Trash2, Eye, Edit3, Upload } from 'lucide-react'

const DEFAULT_MD = `# Welcome to Markdown Editor

Type on the left, see preview on the right.

## Features

- **Live preview** with GitHub Flavored Markdown
- **Syntax highlighting** for code blocks
- **Tables**, lists, blockquotes
- Export to \`.md\` file

### Code Example

\`\`\`tsx
function Hello() {
  return <h1>Hello World</h1>
}
\`\`\`

### Table

| Feature | Status |
| --- | --- |
| Bold | ✅ |
| Italic | ✅ |
| Links | ✅ |

> This is a blockquote

[Link to GitHub](https://github.com)

- [x] Build editor
- [ ] Add more themes
`

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('markdown-content')
    if (saved) setMarkdown(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('markdown-content', markdown)
  }, [markdown])

  const downloadMD = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setMarkdown(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  const clearAll = () => {
    if (confirm('Clear all content?')) setMarkdown('')
  }

  return (
    <div className="container">
      <div className="toolbar">
        <h1>Markdown Editor</h1>
        <div className="toolbar-actions">
          <button className="toggle-view" onClick={() => setShowPreview(!showPreview)}>
            {showPreview? <><Edit3 size={16} /> Edit</> : <><Eye size={16} /> Preview</>}
          </button>
          <label>
            <button type="button">
              <Upload size={16} />
              Upload
            </button>
            <input type="file" accept=".md,.markdown,.txt" onChange={uploadFile} style={{ display: 'none' }} />
          </label>
          <button onClick={copyMarkdown}>
            <Copy size={16} />
            {copied? 'Copied!' : 'Copy'}
          </button>
          <button onClick={downloadMD}>
            <Download size={16} />
            Download
          </button>
          <button onClick={clearAll}>
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      <div className={`editor-wrapper ${showPreview? 'show-preview' : ''}`}>
        <div className="pane editor">
          <div className="pane-header">Markdown</div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Start typing..."
            spellCheck={false}
          />
        </div>

        <div className="pane preview">
          <div className="pane-header">Preview</div>
          <div className="preview-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children,...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return!inline && match? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App