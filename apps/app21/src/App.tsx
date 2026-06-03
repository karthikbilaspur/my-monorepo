import { useState, useEffect, useRef } from 'react'
import { generateText } from './data/wordLists'
import './index.css'

type TestResult = {
  id: string
  wpm: number
  accuracy: number
  time: number
  difficulty: string
  date: string
}

function StatsCard({ title, value, unit }: { title: string, value: string | number, unit?: string }) {
  return (
    <div className="card stat-card">
      <span className="stat-label">{title}</span>
      <span className="stat-value">
        {value}<span className="stat-unit">{unit}</span>
      </span>
    </div>
  )
}

function App() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [timeLimit, setTimeLimit] = useState(30)
  const [text, setText] = useState('')
  const [input, setInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [history, setHistory] = useState<TestResult[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('typerush-history')
    if (saved) setHistory(JSON.parse(saved))
    resetTest()
  }, [])

  useEffect(() => {
    localStorage.setItem('typerush-history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && isActive) {
      finishTest()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  useEffect(() => {
    if (isActive) {
      calculateStats()
    }
  }, [input])

  const resetTest = () => {
    setText(generateText(difficulty))
    setInput('')
    setTimeLeft(timeLimit)
    setIsActive(false)
    setIsFinished(false)
    setWpm(0)
    setAccuracy(100)
    inputRef.current?.focus()
  }

  const startTest = () => {
    if (!isActive) {
      setIsActive(true)
      setIsFinished(false)
    }
  }

  const calculateStats = () => {
    const words = input.trim().split(' ').length
    const timeElapsed = timeLimit - timeLeft
    const currentWpm = timeElapsed > 0? Math.round((words / timeElapsed) * 60) : 0
    setWpm(currentWpm)

    let correctChars = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correctChars++
    }
    const currentAccuracy = input.length > 0? Math.round((correctChars / input.length) * 100) : 100
    setAccuracy(currentAccuracy)
  }

  const finishTest = () => {
    setIsActive(false)
    setIsFinished(true)
    calculateStats()

    const result: TestResult = {
      id: Date.now().toString(),
      wpm,
      accuracy,
      time: timeLimit,
      difficulty,
      date: new Date().toISOString()
    }
    setHistory([result,...history].slice(0, 20))
  }

  const renderText = () => {
    return text.split('').map((char, i) => {
      let className = 'char'
      if (i < input.length) {
        className += input[i] === char? ' correct' : ' incorrect'
      } else if (i === input.length) {
        className += ' current'
      }
      return <span key={i} className={className}>{char}</span>
    })
  }

  const avgWpm = history.length > 0
   ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length)
    : 0
  const bestWpm = history.length > 0? Math.max(...history.map(h => h.wpm)) : 0

  return (
    <div className="app">
      <header className="header">
        <h1>TypeRush</h1>
        <p className="subtitle">Test your typing speed</p>
      </header>

      <div className="stats-row">
        <StatsCard title="WPM" value={wpm} />
        <StatsCard title="Accuracy" value={accuracy} unit="%" />
        <StatsCard title="Time" value={timeLeft} unit="s" />
      </div>

      <div className="card typing-card">
        <div className="text-display">
          {renderText()}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => {
            setInput(e.target.value)
            if (!isActive && e.target.value.length > 0) startTest()
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && isFinished) resetTest()
          }}
          disabled={isFinished}
          placeholder={isActive? '' : 'Start typing to begin...'}
          className="typing-input"
          autoFocus
        />
        {isFinished && (
          <div className="result-banner">
            <span>Test Complete! Press Enter to restart</span>
            <button onClick={resetTest} className="btn-restart">Restart</button>
          </div>
        )}
      </div>

      <div className="accordion-card card">
        <button className="accordion-trigger" onClick={() => setShowSettings(!showSettings)}>
          <span>Settings</span>
          <span className={`chevron ${showSettings? 'open' : ''}`}>⌄</span>
        </button>
        {showSettings && (
          <div className="accordion-content">
            <div className="setting-row">
              <label>Difficulty</label>
              <select value={difficulty} onChange={e => {
                setDifficulty(e.target.value as any)
                setTimeout(resetTest, 0)
              }}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="setting-row">
              <label>Time Limit</label>
              <select value={timeLimit} onChange={e => {
                setTimeLimit(Number(e.target.value))
                setTimeout(resetTest, 0)
              }}>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={120}>120s</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="accordion-card card">
        <button className="accordion-trigger" onClick={() => setShowHistory(!showHistory)}>
          <span>History & Stats</span>
          <span className={`chevron ${showHistory? 'open' : ''}`}>⌄</span>
        </button>
        {showHistory && (
          <div className="accordion-content">
            <div className="history-stats">
              <div className="history-stat">
                <span>Average WPM</span>
                <span className="value">{avgWpm}</span>
              </div>
              <div className="history-stat">
                <span>Best WPM</span>
                <span className="value">{bestWpm}</span>
              </div>
              <div className="history-stat">
                <span>Tests Taken</span>
                <span className="value">{history.length}</span>
              </div>
            </div>
            <div className="history-list">
              {history.slice(0, 10).map(h => (
                <div key={h.id} className="history-item">
                  <span className="history-wpm">{h.wpm} WPM</span>
                  <span className="history-meta">
                    {h.accuracy}% • {h.difficulty} • {new Date(h.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App