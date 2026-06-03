import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { nanoid } from 'nanoid'
import { format, startOfWeek, addDays } from 'date-fns'
import './index.css'

type Recipe = {
  id: string
  title: string
  description: string
  image: string
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  ingredients: { item: string; amount: string }[]
  instructions: string[]
}

type MealPlan = { [date: string]: string[] }

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Garlic Pasta',
    description: 'Rich and creamy pasta ready in 20 minutes',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    tags: ['Italian', 'Vegetarian', 'Quick'],
    ingredients: [
      { item: 'Pasta', amount: '400g' },
      { item: 'Heavy cream', amount: '1 cup' },
      { item: 'Garlic', amount: '4 cloves' },
      { item: 'Parmesan', amount: '1/2 cup' }
    ],
    instructions: [
      'Cook pasta according to package directions',
      'Sauté garlic in butter until fragrant',
      'Add cream and simmer 3 minutes',
      'Toss with pasta and parmesan'
    ]
  },
  {
    id: '2',
    title: 'Chicken Stir Fry',
    description: 'Healthy weeknight dinner with vegetables',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    tags: ['Asian', 'Healthy', 'Protein'],
    ingredients: [
      { item: 'Chicken breast', amount: '500g' },
      { item: 'Mixed vegetables', amount: '3 cups' },
      { item: 'Soy sauce', amount: '3 tbsp' },
      { item: 'Rice', amount: '2 cups' }
    ],
    instructions: [
      'Slice chicken into strips',
      'Stir fry chicken until cooked',
      'Add vegetables and sauce',
      'Serve over rice'
    ]
  },
  {
    id: '3',
    title: 'Avocado Toast',
    description: 'Perfect breakfast or snack',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Vegetarian', 'Quick'],
    ingredients: [
      { item: 'Bread', amount: '4 slices' },
      { item: 'Avocado', amount: '2' },
      { item: 'Lemon', amount: '1' },
      { item: 'Salt', amount: 'to taste' }
    ],
    instructions: [
      'Toast bread until golden',
      'Mash avocado with lemon and salt',
      'Spread on toast',
      'Top with pepper flakes'
    ]
  }
]

function RecipeCard({ recipe, onAddToPlan }: { recipe: Recipe; onAddToPlan: (id: string) => void }) {
  const [view, setView] = useState<'overview' | 'ingredients' | 'instructions'>('overview')
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: recipe.id })

  return (
    <div ref={setNodeRef} className={`recipe-card ${isDragging? 'dragging' : ''}`} {...attributes}>
      <div className="recipe-image" style={{ backgroundImage: `url(${recipe.image})` }} {...listeners}>
        <div className="recipe-badges">
          <span className="badge">{recipe.cookTime} min</span>
          <span className={`badge difficulty-${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="recipe-desc">{recipe.description}</p>

        <div className="recipe-tags">
          {recipe.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>

        {/* Flexbox tab navigation instead of accordions */}
        <div className="tab-nav">
          <button
            className={view === 'overview'? 'active' : ''}
            onClick={() => setView('overview')}
          >
            Overview
          </button>
          <button
            className={view === 'ingredients'? 'active' : ''}
            onClick={() => setView('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={view === 'instructions'? 'active' : ''}
            onClick={() => setView('instructions')}
          >
            Steps
          </button>
        </div>

        <div className="tab-content">
          {view === 'overview' && (
            <div className="overview-grid">
              <div className="stat-item">
                <span className="stat-icon">⏱️</span>
                <span>{recipe.cookTime} min</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span>{recipe.servings} servings</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          )}
          {view === 'ingredients' && (
            <ul className="ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="ingredient-amount">{ing.amount}</span>
                  <span>{ing.item}</span>
                </li>
              ))}
            </ul>
          )}
          {view === 'instructions' && (
            <ol className="instructions-list">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
        </div>

        <button onClick={() => onAddToPlan(recipe.id)} className="btn-add-plan">
          + Add to Meal Plan
        </button>
      </div>
    </div>
  )
}

function MealDay({ date, recipeIds, recipes, onRemove }: {
  date: string
  recipeIds: string[]
  recipes: Recipe[]
  onRemove: (date: string, recipeId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: date })

  return (
    <div ref={setNodeRef} className={`meal-day ${isOver? 'drop-over' : ''}`}>
      <div className="day-header">
        <span className="day-name">{format(new Date(date), 'EEE')}</span>
        <span className="day-date">{format(new Date(date), 'MMM d')}</span>
      </div>
      <div className="day-meals">
        {recipeIds.map(id => {
          const recipe = recipes.find(r => r.id === id)
          return recipe? (
            <div key={id} className="meal-item">
              <img src={recipe.image} alt={recipe.title} />
              <span>{recipe.title}</span>
              <button onClick={() => onRemove(date, id)} className="btn-remove">×</button>
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES)
  const [mealPlan, setMealPlan] = useState<MealPlan>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('All')
  const [showPlanner, setShowPlanner] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('recipevault-plan')
    if (saved) setMealPlan(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('recipevault-plan', JSON.stringify(mealPlan))
  }, [mealPlan])

  const allTags = ['All',...Array.from(new Set(recipes.flatMap(r => r.tags)))]
  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = filterTag === 'All' || r.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'yyyy-MM-dd')
  )

  const addToPlan = (recipeId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    setMealPlan(prev => ({
     ...prev,
      [today]: [...(prev[today] || []), recipeId]
    }))
    setShowPlanner(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const recipeId = active.id as string
    const targetDate = over.id as string

    setMealPlan(prev => ({
     ...prev,
      [targetDate]: [...(prev[targetDate] || []), recipeId]
    }))
  }

  const removeFromPlan = (date: string, recipeId: string) => {
    setMealPlan(prev => ({
     ...prev,
      [date]: prev[date].filter(id => id!== recipeId)
    }))
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>RecipeVault</h1>
          <p className="subtitle">Organize recipes & plan meals</p>
        </div>
        <button onClick={() => setShowPlanner(!showPlanner)} className="btn-primary">
          {showPlanner? 'View Recipes' : 'Meal Planner'}
        </button>
      </header>

      {!showPlanner? (
        <>
          <div className="filters-bar">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="tag-filters">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter ${filterTag === tag? 'active' : ''}`}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="recipes-grid">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onAddToPlan={addToPlan} />
            ))}
          </div>
        </>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="meal-planner">
            <h2>This Week's Meals</h2>
            <div className="week-grid">
              {weekDates.map(date => (
                <MealDay
                  key={date}
                  date={date}
                  recipeIds={mealPlan[date] || []}
                  recipes={recipes}
                  onRemove={removeFromPlan}
                />
              ))}
            </div>
          </div>
        </DndContext>
      )}
    </div>
  )
}

export default App