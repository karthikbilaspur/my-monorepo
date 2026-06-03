import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isPast, parseISO } from 'date-fns'
import { Deck, Card, StudyStats } from './types'
import { calculateSM2, getDueDate } from './utils/sm2'
import './index.css'

const DECK_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

function DeckCard({ deck, cards, onSelect, onDelete }: {
  deck: Deck
  cards: Card[]
  onSelect: () => void
  onDelete: () => void
}) {
  const [showSettings, setShowSettings] = useState(false)
  const dueCards = cards.filter(c => isPast(parseISO(c.dueDate))).length
  const totalCards = cards.length

  return (
    <div className="card deck-card" style={{ borderLeftColor: deck.color }}>
      <div className="deck-header" onClick={onSelect}>
        <div className="deck-info">
          <h3>{deck.name}</h3>
          <p className="deck-desc">{deck.description}</p>
          <div className="deck-stats">
            <span className="stat">{totalCards} cards</span>
            <span className="stat due">{dueCards} due</span>
          </div>
        </div>
        <div className="deck-color" style={{ background: deck.color }} />
      </div>

      <div className="accordion">
        <button
          className="accordion-trigger"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span>Deck Settings</span>
          <span className={`chevron ${showSettings? 'open' : ''}`}>⌄</span>
        </button>
        {showSettings && (
          <div className="accordion-content">
            <button onClick={onDelete} className="btn-danger-sm">
              Delete Deck
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StudyMode({ cards, onAnswer, onExit }: {
  cards: Card[]
  onAnswer: (cardId: string, quality: number) => void
  onExit: () => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 })

  if (cards.length === 0) {
    return (
      <div className="study-container">
        <div className="card empty-study">
          <h2>All done! 🎉</h2>
          <p>No cards due for review</p>
          <button onClick={onExit} className="btn-primary">Back to Decks</button>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIdx]
  const progress = ((currentIdx + 1) / cards.length) * 100

  const handleAnswer = (quality: number) => {
    onAnswer(currentCard.id, quality)
    setSessionStats(s => ({
      correct: s.correct + (quality >= 3? 1 : 0),
      total: s.total + 1
    }))
    setShowBack(false)
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setTimeout(onExit, 500)
    }
  }

  return (
    <div className="study-container">
      <div className="study-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="study-meta">
          <span>{currentIdx + 1} / {cards.length}</span>
          <button onClick={onExit} className="btn-exit">Exit</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id + showBack}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: showBack? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flashcard"
          onClick={() =>!showBack && setShowBack(true)}
        >
          <div className="card-face" style={{ display: showBack? 'none' : 'flex' }}>
            <p>{currentCard.front}</p>
            <span className="hint">Click to reveal</span>
          </div>
          <div className="card-face back" style={{ display: showBack? 'flex' : 'none', transform: 'rotateY(180deg)' }}>
            <p>{currentCard.back}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {showBack && (
        <div className="answer-buttons">
          <button onClick={() => handleAnswer(0)} className="btn-answer fail">
            Again<br /><span>0</span>
          </button>
          <button onClick={() => handleAnswer(3)} className="btn-answer hard">
            Hard<br /><span>3</span>
          </button>
          <button onClick={() => handleAnswer(4)} className="btn-answer good">
            Good<br /><span>4</span>
          </button>
          <button onClick={() => handleAnswer(5)} className="btn-answer easy">
            Easy<br /><span>5</span>
          </button>
        </div>
      )}
    </div>
  )
}

function App() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [studyMode, setStudyMode] = useState(false)
  const [showNewDeck, setShowNewDeck] = useState(false)
  const [showNewCard, setShowNewCard] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const [deckName, setDeckName] = useState('')
  const [deckDesc, setDeckDesc] = useState('')
  const [deckColor, setDeckColor] = useState(DECK_COLORS[0])

  const [cardFront, setCardFront] = useState('')
  const [cardBack, setCardBack] = useState('')

  useEffect(() => {
    const savedDecks = localStorage.getItem('studydeck-decks')
    const savedCards = localStorage.getItem('studydeck-cards')
    if (savedDecks) setDecks(JSON.parse(savedDecks))
    if (savedCards) setCards(JSON.parse(savedCards))
  }, [])

  useEffect(() => {
    localStorage.setItem('studydeck-decks', JSON.stringify(decks))
  }, [decks])

  useEffect(() => {
    localStorage.setItem('studydeck-cards', JSON.stringify(cards))
  }, [cards])

  const createDeck = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deckName) return
    const newDeck: Deck = {
      id: nanoid(),
      name: deckName,
      description: deckDesc,
      color: deckColor,
      createdAt: new Date().toISOString()
    }
    setDecks([...decks, newDeck])
    setDeckName('')
    setDeckDesc('')
    setShowNewDeck(false)
  }

  const deleteDeck = (id: string) => {
    setDecks(decks.filter(d => d.id!== id))
    setCards(cards.filter(c => c.deckId!== id))
    if (selectedDeck?.id === id) setSelectedDeck(null)
  }

  const createCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardFront ||!cardBack ||!selectedDeck) return
    const newCard: Card = {
      id: nanoid(),
      front: cardFront,
      back: cardBack,
      deckId: selectedDeck.id,
      interval: 0,
      repetition: 0,
      efactor: 2.5,
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    setCards([...cards, newCard])
    setCardFront('')
    setCardBack('')
    setShowNewCard(false)
  }

  const handleAnswer = (cardId: string, quality: number) => {
    setCards(cards.map(card => {
      if (card.id === cardId) {
        const { interval, repetition, efactor } = calculateSM2(
          quality,
          card.repetition,
          card.interval,
          card.efactor
        )
        return {
         ...card,
          interval,
          repetition,
          efactor,
          dueDate: getDueDate(interval)
        }
      }
      return card
    }))
  }

  const deckCards = selectedDeck? cards.filter(c => c.deckId === selectedDeck.id) : []
  const dueCards = deckCards.filter(c => isPast(parseISO(c.dueDate)))

  if (studyMode && selectedDeck) {
    return (
      <StudyMode
        cards={dueCards}
        onAnswer={handleAnswer}
        onExit={() => setStudyMode(false)}
      />
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>StudyDeck</h1>
          <p className="subtitle">Spaced Repetition Flashcards</p>
        </div>
      </header>

      {!selectedDeck? (
        <>
          <div className="card form-card">
            <button className="form-toggle" onClick={() => setShowNewDeck(!showNewDeck)}>
              <span>+ Create New Deck</span>
              <span className={`chevron ${showNewDeck? 'open' : ''}`}>⌄</span>
            </button>
            {showNewDeck && (
              <form onSubmit={createDeck} className="deck-form">
                <input
                  type="text"
                  placeholder="Deck name"
                  value={deckName}
                  onChange={e => setDeckName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={deckDesc}
                  onChange={e => setDeckDesc(e.target.value)}
                />
                <div className="color-picker">
                  {DECK_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`color-btn ${deckColor === c? 'selected' : ''}`}
                      style={{ background: c }}
                      onClick={() => setDeckColor(c)}
                    />
                  ))}
                </div>
                <button type="submit" className="btn-primary">Create Deck</button>
              </form>
            )}
          </div>

          <div className="decks-grid">
            {decks.length === 0? (
              <div className="card empty-card">
                <p>No decks yet. Create your first one above!</p>
              </div>
            ) : (
              decks.map(deck => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  cards={cards.filter(c => c.deckId === deck.id)}
                  onSelect={() => setSelectedDeck(deck)}
                  onDelete={() => deleteDeck(deck.id)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="deck-view-header">
            <button onClick={() => setSelectedDeck(null)} className="btn-back">← Back</button>
            <div>
              <h2 style={{ color: selectedDeck.color }}>{selectedDeck.name}</h2>
              <p>{deckCards.length} cards • {dueCards.length} due</p>
            </div>
            <button onClick={() => setStudyMode(true)} className="btn-primary" disabled={dueCards.length === 0}>
              Study Now
            </button>
          </div>

          <div className="card form-card">
            <button className="form-toggle" onClick={() => setShowNewCard(!showNewCard)}>
              <span>+ Add New Card</span>
              <span className={`chevron ${showNewCard? 'open' : ''}`}>⌄</span>
            </button>
            {showNewCard && (
              <form onSubmit={createCard} className="card-form">
                <textarea
                  placeholder="Front (question)"
                  value={cardFront}
                  onChange={e => setCardFront(e.target.value)}
                  required
                  rows={3}
                />
                <textarea
                  placeholder="Back (answer)"
                  value={cardBack}
                  onChange={e => setCardBack(e.target.value)}
                  required
                  rows={3}
                />
                <button type="submit" className="btn-primary">Add Card</button>
              </form>
            )}
          </div>

          <div className="cards-list">
            {deckCards.length === 0? (
              <div className="card empty-card">
                <p>No cards in this deck yet. Add one above!</p>
              </div>
            ) : (
              deckCards.map(card => (
                <div key={card.id} className="card card-item">
                  <div className="card-front">{card.front}</div>
                  <div className="card-divider" />
                  <div className="card-back">{card.back}</div>
                  <div className="card-meta">
                    Due: {format(parseISO(card.dueDate), 'MMM d, yyyy')}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App