export const WORD_LISTS = {
  easy: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she'
  ],
  medium: [
    'about', 'after', 'again', 'below', 'could', 'every', 'first', 'found',
    'great', 'house', 'large', 'learn', 'never', 'other', 'place', 'plant',
    'point', 'right', 'small', 'sound', 'spell', 'still', 'study', 'their',
    'there', 'these', 'thing', 'think', 'three', 'water', 'where', 'which'
  ],
  hard: [
    'abundant', 'accommodate', 'belligerent', 'conscientious', 'definitely',
    'embarrass', 'fluorescent', 'government', 'harassment', 'independent',
    'judgment', 'knowledge', 'maintenance', 'necessary', 'occasionally',
    'privilege', 'questionnaire', 'rhythm', 'separate', 'successful',
    'temperature', 'unfortunately', 'vacuum', 'weird', 'xylophone'
  ]
}

export const generateText = (difficulty: 'easy' | 'medium' | 'hard', wordCount = 50) => {
  const words = WORD_LISTS[difficulty]
  return Array.from({ length: wordCount }, () =>
    words[Math.floor(Math.random() * words.length)]
  ).join(' ')
}