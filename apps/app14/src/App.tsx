import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'

type Snippet = {
  id: string
  title: string
  language: string
  code: string
  tags: string[]
  createdAt: number
}

function App() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [tags, setTags] = useState('')

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snipbin')
    if (saved) setSnippets(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('snipbin', JSON.stringify(snippets))
  }, [snippets])

  const addSnippet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title ||!code) return

    const newSnippet: Snippet = {
      id: nanoid(),
      title,
      language,
      code,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: Date.now()
    }
    setSnippets([newSnippet,...snippets])
    setTitle('')
    setCode('')
    setTags('')
  }

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id!== id))
  }

  const filtered = snippets.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    s.language.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <header>
        <h1>SnipBin</h1>
        <input
          type="search"
          placeholder="Search snippets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>

      <main>
        <form onSubmit={addSnippet} className="snippet-form">
          <h2>Add New Snippet</h2>
          <input
            placeholder="Snippet title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="css">CSS</option>
            <option value="bash">Bash</option>
          </select>
          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={6}
            required
          />
          <input
            placeholder="Tags: react, hook, util"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <button type="submit">Save Snippet</button>
        </form>

        <div className="snippets">
          {filtered.length === 0 && <p className="empty">No snippets yet. Add one!</p>}
          {filtered.map(s => (
            <div key={s.id} className="snippet-card">
              <div className="snippet-header">
                <h3>{s.title}</h3>
                <span className="badge">{s.language}</span>
                <button onClick={() => deleteSnippet(s.id)} className="delete">×</button>
              </div>
              <pre><code>{s.code}</code></pre>
              <div className="tags">
                {s.tags.map(t => <span key={t} className="tag">#{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App