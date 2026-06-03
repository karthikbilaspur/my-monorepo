import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './index.css'

type Transaction = {
  id: string
  title: string
  amount: number
  category: string
  date: string
  type: 'expense' | 'income'
}

type CategoryTotal = {
  name: string
  value: number
  color: string
}

const CATEGORIES = [
  { name: 'Food', color: '#ef4444' },
  { name: 'Transport', color: '#f59e0b' },
  { name: 'Shopping', color: '#8b5cf6' },
  { name: 'Bills', color: '#3b82f6' },
  { name: 'Entertainment', color: '#ec4899' },
  { name: 'Income', color: '#10b981' },
  { name: 'Other', color: '#6b7280' },
]

function MonthCard({
  month,
  year,
  transactions,
  onDelete,
  defaultOpen = false
}: {
  month: number
  year: number
  transactions: Transaction[]
  onDelete: (id: string) => void
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })
  const totalExpense = transactions
   .filter(t => t.type === 'expense')
   .reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = transactions
   .filter(t => t.type === 'income')
   .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const categoryData: CategoryTotal[] = CATEGORIES.map(cat => ({
    name: cat.name,
    value: transactions
     .filter(t => t.category === cat.name && t.type === 'expense')
     .reduce((sum, t) => sum + t.amount, 0),
    color: cat.color
  })).filter(c => c.value > 0)

  return (
    <div className="card month-card">
      <button className="month-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="month-info">
          <h3>{monthName} {year}</h3>
          <div className="month-stats">
            <span className="stat-item income">+₹{totalIncome.toFixed(2)}</span>
            <span className="stat-item expense">-₹{totalExpense.toFixed(2)}</span>
            <span className={`stat-item balance ${balance >= 0? 'pos' : 'neg'}`}>
              ₹{balance.toFixed(2)}
            </span>
          </div>
        <span className={`chevron ${isOpen? 'open' : ''}`}>⌄</span>
      </button>

      {isOpen && (
        <div className="month-body">
          {categoryData.length > 0 && (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="transaction-list">
            <h4>Transactions</h4>
            {transactions.length === 0? (
              <p className="empty">No transactions this month</p>
            ) : (
              transactions
               .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
               .map(t => (
                  <div key={t.id} className="transaction-row">
                    <div className="transaction-info">
                      <span className="transaction-title">{t.title}</span>
                      <span className="transaction-meta">
                        {t.category} • {new Date(t.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="transaction-actions">
                      <span className={`transaction-amount ${t.type}`}>
                        {t.type === 'expense'? '-' : '+'}₹{t.amount.toFixed(2)}
                      </span>
                      <button onClick={() => onDelete(t.id)} className="btn-delete">×</button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) setTransactions(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title ||!amount) return

    const newTransaction: Transaction = {
      id: nanoid(),
      title,
      amount: parseFloat(amount),
      category: type === 'income'? 'Income' : category,
      date,
      type
    }
    setTransactions([newTransaction,...transactions])
    setTitle('')
    setAmount('')
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id!== id))
  }

  // Group by month/year
  const grouped = transactions.reduce((acc, t) => {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {} as Record<string, Transaction[]>)

  const months = Object.keys(grouped)
   .map(key => {
      const [year, month] = key.split('-').map(Number)
      return { year, month, transactions: grouped[key] }
    })
   .sort((a, b) => {
      if (a.year!== b.year) return b.year - a.year
      return b.month - a.month
    })

  const totalBalance = transactions.reduce((sum, t) =>
    sum + (t.type === 'income'? t.amount : -t.amount), 0
  )

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>ExpenseTracker</h1>
          <p className="subtitle">App 17 - Track your spending</p>
        </div>
        <div className="balance-card">
          <span className="balance-label">Total Balance</span>
          <span className={`balance-amount ${totalBalance >= 0? 'pos' : 'neg'}`}>
            ₹{totalBalance.toFixed(2)}
          </span>
        </div>
      </header>

      <div className="card form-card">
        <h3>Add Transaction</h3>
        <form onSubmit={addTransaction}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <select value={type} onChange={e => setType(e.target.value as any)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {type === 'expense' && (
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.filter(c => c.name!== 'Income').map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            )}
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Add Transaction</button>
        </form>
      </div>

      <div className="months-list">
        {months.length === 0? (
          <div className="card empty-card">
            <p>No transactions yet. Add your first one above!</p>
          </div>
        ) : (
          months.map((m, idx) => (
            <MonthCard
              key={`${m.year}-${m.month}`}
              month={m.month}
              year={m.year}
              transactions={m.transactions}
              onDelete={deleteTransaction}
              defaultOpen={idx === 0}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App