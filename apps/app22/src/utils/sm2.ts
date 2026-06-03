// SM-2 Spaced Repetition Algorithm
export function calculateSM2(
  quality: number, // 0-5: 0=complete blackout, 5=perfect
  repetition: number,
  interval: number,
  efactor: number
) {
  let newEfactor = efactor
  let newInterval = interval
  let newRepetition = repetition

  if (quality >= 3) {
    if (repetition === 0) {
      newInterval = 1
    } else if (repetition === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * efactor)
    }
    newRepetition = repetition + 1
  } else {
    newRepetition = 0
    newInterval = 1
  }

  newEfactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEfactor < 1.3) newEfactor = 1.3

  return {
    interval: newInterval,
    repetition: newRepetition,
    efactor: newEfactor
  }
}

export function getDueDate(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString()
}