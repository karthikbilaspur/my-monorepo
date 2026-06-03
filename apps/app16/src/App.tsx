import { useState, useEffect } from 'react'
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { nanoid } from 'nanoid'
import './index.css'

type Task = {
  id: string
  title: string
  description: string
  tags: string[]
}

type Column = {
  id: string
  title: string
  taskIds: string[]
  collapsed: boolean
}

function TaskCard({ task, onDelete }: { task: Task, onDelete: () => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="task-card" {...attributes}>
      <div className="task-header" {...listeners}>
        <span className="drag-handle">⋮⋮</span>
        <span className="task-title">{task.title}</span>
        <button onClick={onDelete} className="task-delete">×</button>
      </div>

      <div className="accordion">
        <button
          className="accordion-trigger-sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          Details
          <span className={`chevron-sm ${showDetails? 'open' : ''}`}>⌄</span>
        </button>
        {showDetails && (
          <div className="accordion-content-sm">
            <p className="task-desc">{task.description || 'No description'}</p>
            <div className="task-tags">
              {task.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Column({ column, tasks, onToggle, onAddTask, onDeleteTask }: any) {
  return (
    <div className="column card">
      <div className="column-header">
        <button className="column-title" onClick={onToggle}>
          <span className={`collapse-icon ${column.collapsed? '' : 'open'}`}>▶</span>
          {column.title}
          <span className="task-count">{tasks.length}</span>
        </button>
      </div>

      {!column.collapsed && (
        <>
          <SortableContext items={tasks.map((t: Task) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="task-list">
              {tasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(column.id, task.id)} />
              ))}
            </div>
          </SortableContext>
          <button className="add-task-btn" onClick={() => onAddTask(column.id)}>+ Add task</button>
        </>
      )}
    </div>
  )
}

function App() {
  const [tasks, setTasks] = useState<Record<string, Task>>({})
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', taskIds: [], collapsed: false },
    { id: 'doing', title: 'In Progress', taskIds: [], collapsed: false },
    { id: 'done', title: 'Done', taskIds: [], collapsed: false },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('taskboard')
    if (saved) {
      const { tasks, columns } = JSON.parse(saved)
      setTasks(tasks)
      setColumns(columns)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('taskboard', JSON.stringify({ tasks, columns }))
  }, [tasks, columns])

  const addTask = (columnId: string) => {
    const id = nanoid()
    const newTask: Task = {
      id,
      title: 'New Task',
      description: 'Click to edit',
      tags: ['task']
    }
    setTasks({...tasks, [id]: newTask })
    setColumns(columns.map(col =>
      col.id === columnId? {...col, taskIds: [...col.taskIds, id] } : col
    ))
  }

  const deleteTask = (columnId: string, taskId: string) => {
    const newTasks = {...tasks }
    delete newTasks[taskId]
    setTasks(newTasks)
    setColumns(columns.map(col =>
      col.id === columnId? {...col, taskIds: col.taskIds.filter(id => id!== taskId) } : col
    ))
  }

  const toggleColumn = (columnId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId? {...col, collapsed:!col.collapsed } : col
    ))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCol = columns.find(col => col.taskIds.includes(activeId))
    const overCol = columns.find(col => col.id === overId || col.taskIds.includes(overId))

    if (!activeCol ||!overCol) return

    if (activeCol.id === overCol.id) return

    setColumns(columns.map(col => {
      if (col.id === activeCol.id) {
        return {...col, taskIds: col.taskIds.filter(id => id!== activeId) }
      }
      if (col.id === overCol.id) {
        return {...col, taskIds: [...col.taskIds, activeId] }
      }
      return col
    }))
  }

  return (
    <div className="app">
      <header className="board-header">
        <h1>TaskBoard</h1>
        <p className="subtitle">App 16 - Drag tasks between columns</p>
      </header>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="board">
          {columns.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={column.taskIds.map(id => tasks[id]).filter(Boolean)}
              onToggle={() => toggleColumn(column.id)}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

export default App