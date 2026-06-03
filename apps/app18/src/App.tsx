import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { format, startOfWeek, addDays, isSameDay, subDays, differenceInDays } from 'date-fns'
import './index.css'

type Habit = {
  id: string
  name: string
  icon: string
  color: string
  frequency: 'daily' | 'weekly'
  target: number
  completions: string[] // ISO date strings
  createdAt: string
}

const ICONS = ['💪', '📚', '💧', '🏃', '🧘', '✍️', '🎨', '💻', '🥗', '😴']
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

function HabitCard({ habit, onToggle, onDelete }: {
  habit: Habit
  onToggle: (habitId: string, date: string) => void
  onDelete: (id: string) => void
}) {
  const [showStats, setShowStats] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')
  const isCompletedToday = habit.completions.includes(today)

  // Calculate streak
  const calculateStreak = () => {
    if (habit.completions.length === 0) return 0
    const sorted = [...habit.completions].sort().reverse()
    let streak = 0
    let currentDate = new Date()
    
    for (let i = 0; i < sorted.length; i++) {
      const checkDate = format(currentDate, 'yyyy-MM-dd')
      if (sorted.includes(checkDate)) {
        streak++
        currentDate = subDays(currentDate, 1)
      } else {
        break
      }
    }
    return streak
  }

  const streak = calculateStreak()
  const completionRate = habit.completions.length > 0
    ? Math.round((habit.completions.length / differenceInDays(new Date(), new Date(habit.createdAt))) * 100)
    : 0

  // Last 7 days for mini calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return format(date, 'yyyy-MM-dd')
  })

  return (
    <div className="card habit-card" style={{ borderLeftColor: habit.color }}>
      <div className="habit-header">
        <div className="habit-info">
          <span className="habit-icon" style={{ background: habit.color + '20' }}>{habit.icon}</span>
          <div>
            <h3>{habit.name}</h3>
            <div className="habit-meta">
              <span className="streak">🔥 {streak} day streak</span>
              <span className="rate">{completionRate}% rate</span>
            </div>
          </div>
        <button
          className={`check-btn ${isCompletedToday? 'completed' : ''}`}
          onClick={() => onToggle(habit.id, today)}
        >
          {isCompletedToday? '✓' : '○'}
        </button>
      </div>

      <div className="mini-calendar">
        {last7Days.map(date => (
          <div
            key={date}
            className={`day-dot ${habit.completions.includes(date)? 'completed' : ''}`}
            style={{ background: habit.completions.includes(date)? habit.color : '' }}
            title={format(new Date(date), 'MMM d')}
          />
        ))}
      </div>

      <div className="accordion">
        <button className="accordion-trigger" onClick={() => setShowStats(!showStats)}>
          <span>Stats & Settings</span>
          <span className={`chevron ${showStats? 'open' : ''}`}>⌄</span>
        </button>
        
        {showStats && (
          <div className="accordion-content">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Check-ins</span>
                <span className="stat-value">{habit.completions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Streak</span>
                <span className="stat-value">{streak} days</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completion Rate</span>
                <span className="stat-value">{completionRate}%</span>
              </div>
            <button onClick={() => onDelete(habit.id)} className="btn-danger-sm">
              Delete Habit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💪')
  const [color, setColor] = useState('#3b82f6')

  useEffect(() => {
    const saved = localStorage.getItem('habitvault')
    if (saved) setHabits(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('habitvault', JSON.stringify(habits))
  }, [habits])

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const newHabit: Habit = {
      id: nanoid(),
      name,
      icon,
      color,
      frequency: 'daily',
      target: 1,
      completions: [],
      createdAt: new Date().toISOString()
    }
    setHabits([newHabit,...habits])
    setName('')
    setShowForm(false)
  }

  const toggleCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const hasDate = h.completions.includes(date)
        return {
         ...h,
          completions: hasDate
            ? h.completions.filter(d => d!== date)
            : [...h.completions, date]
        }
      }
      return h
    }))
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id!== id))
  }

  const todayStr = format(new Date(), 'EEEE, MMMM d')
  const completedToday = habits.filter(h => 
    h.completions.includes(format(new Date(), 'yyyy-MM-dd'))
  ).length

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>HabitVault</h1>
          <p className="subtitle">{todayStr}</p>
        </div>
        <div className="today-summary">
          <span className="summary-label">Today</span>
          <span className="summary-value">{completedToday}/{habits.length}</span>
        </div>
      </header>

      <div className="card form-card">
        <button className="form-toggle" onClick={() => setShowForm(!showForm)}>
          <span>+ Add New Habit</span>
          <span className={`chevron ${showForm? 'open' : ''}`}>⌄</span>
        </button>
        
        {showForm && (
          <form onSubmit={addHabit} className="habit-form">
            <input
              type="text"
              placeholder="Habit name: Drink water, Read 10 pages..."
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <div className="form-row">
              <div className="icon-picker">
                <label>Icon</label>
                <div className="icon-grid">
                  {ICONS.map(i => (
                    <button
                      key={i}
                      type="button"
                      className={`icon-btn ${icon === i? 'selected' : ''}`}
                      onClick={() => setIcon(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div className="color-picker">
                <label>Color</label>
                <div className="color-grid">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`color-btn ${color === c? 'selected' : ''}`}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Habit</button>
          </form>
        )}
      </div>

      <div className="habits-list">
        {habits.length === 0? (
          <div className="card empty-card">
            <p>No habits yet. Create your first one above!</p>
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleCompletion}
              onDelete={deleteHabit}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App