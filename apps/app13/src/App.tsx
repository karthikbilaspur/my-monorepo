import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'

function Dashboard() {
  return (
    <div className="container">
      <nav className="nav">
        <h2>App 13</h2>
        <Link to="/settings">Settings</Link>
        <Link to="/logout">Logout</Link>
      </nav>
      <div className="card">
        <h1>Dashboard</h1>
        <p>Welcome back. This is App 13 inside your monorepo.</p>
        <div className="grid">
          <div className="stat">
            <span className="stat-value">12</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat">
            <span className="stat-value">1.2k</span>
            <span className="stat-label">Requests</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Settings() {
  return (
    <div className="container">
      <div className="card">
        <h1>Settings</h1>
        <Link to="/">← Back to Dashboard</Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App