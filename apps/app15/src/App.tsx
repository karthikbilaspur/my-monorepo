import { useState } from 'react'
import './index.css'

type AccordionProps = {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="card accordion-card">
      <button
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className={`icon ${isOpen ? 'open' : ''}`}>+</span>
      </button>
      {isOpen && <div className="accordion-body">{children}</div>}
    </div>
  )
}

function App() {
  const [name, setName] = useState('Alex Chen')
  const [email, setEmail] = useState('alex@app15.com')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <h1>App 15 Settings</h1>
        <p>Manage your account and preferences</p>
      </header>

      <div className="grid">
        {/* Card 1: Profile - Always visible */}
        <div className="card">
          <div className="card-header">
            <div className="avatar">AC</div>
            <div>
              <h2>{name}</h2>
              <p className="text-muted">{email}</p>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <span className="stat-value">24</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-value">1.2k</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
        </div>

        {/* Accordion Cards */}
        <Accordion title="Account Information" defaultOpen>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn-primary">Save Changes</button>
        </Accordion>

        <Accordion title="Preferences">
          <div className="toggle-row">
            <div>
              <span className="toggle-label">Email Notifications</span>
              <span className="text-muted">Get updates about your account</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="toggle-row">
            <div>
              <span className="toggle-label">Dark Mode</span>
              <span className="text-muted">Toggle dark theme</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </Accordion>

        <Accordion title="Security">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button className="btn-primary">Update Password</button>
        </Accordion>

        <Accordion title="Danger Zone">
          <div className="danger-content">
            <p className="text-muted">Once you delete your account, there is no going back.</p>
            <button className="btn-danger">Delete Account</button>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

export default App