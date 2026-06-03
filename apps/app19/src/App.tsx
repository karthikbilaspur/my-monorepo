import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { nanoid } from 'nanoid'
import { PROBLEMS } from './data/problems'
import { runJavaScript } from './utils/codeRunner'
import { Problem, Submission, TestResult } from './types'
import './index.css'

function ProblemCard({ problem, selected, onClick }: {
  problem: Problem
  selected: boolean
  onClick: () => void
}) {
  return (
    <div className={`problem-card ${selected? 'selected' : ''}`} onClick={onClick}>
      <div className="problem-header">
        <span className="problem-title">{problem.title}</span>
        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>
      <div className="problem-tags">
        {problem.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
    </div>
  )
}

function App() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0])
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(selectedProblem.starterCode[language])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description')
  const [showTestAccordion, setShowTestAccordion] = useState(true)

  useEffect(() => {
    setCode(selectedProblem.starterCode[language] || '')
  }, [selectedProblem, language])

  useEffect(() => {
    const saved = localStorage.getItem('codeinterview-submissions')
    if (saved) setSubmissions(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('codeinterview-submissions', JSON.stringify(submissions))
  }, [submissions])

  const runCode = async () => {
    setRunning(true)
    setTestResults([])

    try {
      const results: TestResult[] = []
      for (const tc of selectedProblem.testCases.filter(t =>!t.hidden)) {
        const input = JSON.parse(tc.input)
        try {
          const { result, runtime } = await runJavaScript(code, input)
          const actual = JSON.stringify(result)
          results.push({
            testCaseId: tc.id,
            passed: actual === tc.expected,
            input: tc.input,
            expected: tc.expected,
            actual,
            runtime
          })
        } catch (err: any) {
          results.push({
            testCaseId: tc.id,
            passed: false,
            input: tc.input,
            expected: tc.expected,
            actual: 'Error',
            error: err.message,
            runtime: 0
          })
        }
      }
      setTestResults(results)

      const passed = results.filter(r => r.passed).length
      const submission: Submission = {
        id: nanoid(),
        problemId: selectedProblem.id,
        code,
        language,
        status: passed === results.length? 'Accepted' : 'Wrong Answer',
        runtime: Math.max(...results.map(r => r.runtime)),
        timestamp: Date.now(),
        passedTests: passed,
        totalTests: results.length
      }
      setSubmissions([submission,...submissions])
    } catch (err: any) {
      console.error(err)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CodeInterview</h1>
        <div className="header-stats">
          <span>Solved: {submissions.filter(s => s.status === 'Accepted').length}</span>
        </div>
      </header>

      <div className="main-container">
        <div className="sidebar">
          <h2>Problems</h2>
          {PROBLEMS.map(p => (
            <ProblemCard
              key={p.id}
              problem={p}
              selected={selectedProblem.id === p.id}
              onClick={() => setSelectedProblem(p)}
            />
          ))}
        </div>

        <PanelGroup direction="horizontal" className="workspace">
          <Panel defaultSize={40} minSize={30}>
            <div className="panel-content">
              <div className="tabs">
                <button
                  className={activeTab === 'description'? 'active' : ''}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={activeTab === 'submissions'? 'active' : ''}
                  onClick={() => setActiveTab('submissions')}
                >
                  Submissions ({submissions.filter(s => s.problemId === selectedProblem.id).length})
                </button>
              </div>

              {activeTab === 'description'? (
                <div className="problem-content">
                  <h2>{selectedProblem.title}</h2>
                  <span className={`difficulty ${selectedProblem.difficulty.toLowerCase()}`}>
                    {selectedProblem.difficulty}
                  </span>
                  <div className="description">
                    {selectedProblem.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  <div className="accordion">
                    <div className="accordion-header">Examples</div>
                    {selectedProblem.examples.map((ex, i) => (
                      <div key={i} className="example">
                        <div><strong>Input:</strong> {ex.input}</div>
                        <div><strong>Output:</strong> {ex.output}</div>
                        {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
                      </div>
                    ))}
                  </div>

                  <div className="accordion">
                    <div className="accordion-header">Constraints</div>
                    <ul className="constraints">
                      {selectedProblem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="submissions-list">
                  {submissions
                  .filter(s => s.problemId === selectedProblem.id)
                  .map(s => (
                      <div key={s.id} className={`submission-card ${s.status.toLowerCase().replace(' ', '-')}`}>
                        <div className="submission-header">
                          <span className="status">{s.status}</span>
                          <span className="runtime">{s.runtime.toFixed(0)}ms</span>
                        </div>
                        <div className="submission-meta">
                          {s.passedTests}/{s.totalTests} tests • {new Date(s.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="resize-handle" />

          <Panel defaultSize={60} minSize={40}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={50}>
                <div className="editor-container">
                  <div className="editor-header">
                    <select value={language} onChange={e => setLanguage(e.target.value)}>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                    <button onClick={runCode} disabled={running} className="btn-run">
                      {running? 'Running...' : 'Run & Submit'}
                    </button>
                  </div>
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={v => setCode(v || '')}
                    theme="vs-dark"
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                  />
                </div>
              </Panel>

              <PanelResizeHandle className="resize-handle-horizontal" />

              <Panel defaultSize={30} minSize={20}>
                <div className="test-panel">
                  <div className="accordion">
                    <button
                      className="accordion-trigger"
                      onClick={() => setShowTestAccordion(!showTestAccordion)}
                    >
                      <span>Test Results ({testResults.filter(t => t.passed).length}/{testResults.length})</span>
                      <span className={`chevron ${showTestAccordion? 'open' : ''}`}>⌄</span>
                    </button>
                    {showTestAccordion && (
                      <div className="test-results">
                        {testResults.length === 0? (
                          <p className="empty">Run code to see results</p>
                        ) : (
                          testResults.map((r, i) => (
                            <div key={r.testCaseId} className={`test-case ${r.passed? 'passed' : 'failed'}`}>
                              <div className="test-header">
                                <span>Case {i + 1}</span>
                                <span className="test-status">{r.passed? '✓ Passed' : '✗ Failed'}</span>
                              </div>
                              <div className="test-details">
                                <div><strong>Input:</strong> {r.input}</div>
                                <div><strong>Expected:</strong> {r.expected}</div>
                                <div><strong>Output:</strong> {r.actual}</div>
                                {r.error && <div className="error"><strong>Error:</strong> {r.error}</div>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default App