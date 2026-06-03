export type Card = {
  id: string
  front: string
  back: string
  deckId: string
  // SM-2 algorithm fields
  interval: number // days until next review
  repetition: number // number of times reviewed
  efactor: number // easiness factor
  dueDate: string // ISO date
  createdAt: string
}

export type Deck = {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}

export type StudyStats = {
  totalReviews: number
  correctReviews: number
  currentStreak: number
  bestStreak: number
}