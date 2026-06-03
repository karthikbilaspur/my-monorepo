export type Recipe = {
  id: string
  title: string
  description: string
  image: string
  cookTime: number // minutes
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  ingredients: { item: string; amount: string }[]
  instructions: string[]
  createdAt: string
}

export type MealPlan = {
  [date: string]: string[] // date -> recipe IDs
}