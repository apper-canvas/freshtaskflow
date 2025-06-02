import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, isTomorrow } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [searchTerm, setSearchTerm] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  })

  const priorities = [
    { value: 'low', label: 'Low', color: 'green', icon: 'ArrowDown' },
    { value: 'medium', label: 'Medium', color: 'yellow', icon: 'Minus' },
    { value: 'high', label: 'High', color: 'red', icon: 'ArrowUp' },
    { value: 'urgent', label: 'Urgent', color: 'purple', icon: 'Zap' }
  ]

  const statuses = [
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'in-progress', label: 'In Progress', icon: 'Play' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ]

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    const task = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      ...newTask,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? task : t))
      toast.success('Task updated successfully!')
    } else {
      setTasks(prev => [...prev, task])
      toast.success('Task created successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    })
    setEditingTask(null)
    setShowModal(false)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status
    })
    setShowModal(true)
  }

  const handleDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks

    // Apply filter
    switch (filter) {
      case 'completed':
        filtered = tasks.filter(task => task.status === 'completed')
        break
      case 'pending':
        filtered = tasks.filter(task => task.status !== 'completed')
        break
      case 'overdue':
        filtered = tasks.filter(task => 
          task.status !== 'completed' && 
          task.dueDate && 
          isPast(new Date(task.dueDate)) && 
          !isToday(new Date(task.dueDate))
        )
        break
      default:
        filtered = tasks
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'title':
          return a.title.localeCompare(b.title)
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }

  const getPriorityStyles = (priority) => {
    const styles = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
      urgent: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return styles[priority] || styles.medium
  }

  const getStatusStyles = (status) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return styles[status] || styles.pending
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`
    return format(date, 'MMM d, yyyy')
  }

  const filteredTasks = getFilteredAndSortedTasks()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Task Management
          </h2>
          <motion.button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2 self-start lg:self-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Task</span>
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
            <option value="created">Sort by Created</option>
          </select>

          <div className="text-sm text-surface-600 dark:text-surface-400 flex items-center">
            <ApperIcon name="List" className="w-4 h-4 mr-2" />
            {filteredTasks.length} tasks
          </div>
        </div>
      </motion.div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card text-center py-12"
            >
              <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-surface-600 dark:text-surface-400 mb-2">
                No tasks found
              </h3>
              <p className="text-surface-500">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your filters or search term'
                  : 'Create your first task to get started!'
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`card hover:shadow-soft transition-all duration-300 ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <motion.button
                        onClick={() => toggleStatus(task.id)}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500'
                            : 'border-surface-300 hover:border-green-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {task.status === 'completed' && (
                          <ApperIcon name="Check" className="w-4 h-4 text-white" />
                        )}
                      </motion.button>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed'
                            ? 'line-through text-surface-500'
                            : 'text-surface-900 dark:text-surface-100'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-surface-600 dark:text-surface-400 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(task.priority)}`}>
                        <ApperIcon 
                          name={priorities.find(p => p.value === task.priority)?.icon || 'Minus'} 
                          className="w-3 h-3 inline mr-1" 
                        />
                        {priorities.find(p => p.value === task.priority)?.label}
                      </span>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(task.status)}`}>
                        <ApperIcon 
                          name={statuses.find(s => s.value === task.status)?.icon || 'Clock'} 
                          className="w-3 h-3 inline mr-1" 
                        />
                        {statuses.find(s => s.value === task.status)?.label}
                      </span>

                      {task.dueDate && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isPast(new Date(task.dueDate)) && task.status !== 'completed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                          {formatDueDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-surface-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <motion.button
                  onClick={resetForm}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field"
                    rows="3"
                    placeholder="Add description..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                      className="input-field"
                    >
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature