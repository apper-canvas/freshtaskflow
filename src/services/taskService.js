class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task38'
  }

  // Get all fields for fetch operations (includes all fields regardless of visibility)
  getAllFields() {
    return [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'title', 'description', 'priority', 'due_date', 'status', 'created_at', 'updated_at'
    ]
  }

  // Get only updateable fields for create/update operations
  getUpdateableFields() {
    return ['Name', 'Tags', 'Owner', 'title', 'description', 'priority', 'due_date', 'status', 'created_at', 'updated_at']
  }

  // Fetch all tasks with optional filtering and sorting
  async fetchTasks(params = {}) {
    try {
      const queryParams = {
        fields: this.getAllFields(),
        ...params
      }

      const response = await this.apperClient.fetchRecords(this.tableName, queryParams)
      
      if (!response || !response.data) {
        return []
      }

      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw new Error('Failed to fetch tasks')
    }
  }

  // Get a single task by ID
  async getTaskById(taskId) {
    try {
      const params = {
        fields: this.getAllFields()
      }

      const response = await this.apperClient.getRecordById(this.tableName, taskId, params)
      
      if (!response || !response.data) {
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error)
      throw new Error('Failed to fetch task')
    }
  }

  // Create a new task
  async createTask(taskData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = this.getUpdateableFields()
      const filteredData = {}
      
      updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field]
        }
      })

      // Add timestamps
      const now = new Date().toISOString()
      filteredData.created_at = now
      filteredData.updated_at = now

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        } else {
          const failedRecord = response.results[0]
          if (failedRecord.errors) {
            const errorMessages = failedRecord.errors.map(error => 
              `${error.fieldLabel}: ${error.message}`
            ).join(', ')
            throw new Error(errorMessages)
          } else {
            throw new Error(failedRecord.message || 'Failed to create task')
          }
        }
      } else {
        throw new Error('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  // Update an existing task
  async updateTask(taskId, taskData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = this.getUpdateableFields()
      const filteredData = { Id: taskId }
      
      updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field]
        }
      })

      // Update timestamp
      filteredData.updated_at = new Date().toISOString()

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        } else {
          const failedRecord = response.results[0]
          throw new Error(failedRecord.message || 'Record does not exist')
        }
      } else {
        throw new Error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      const params = {
        RecordIds: [taskId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (successfulDeletions.length > 0) {
          return true
        } else if (failedDeletions.length > 0) {
          const failedRecord = failedDeletions[0]
          throw new Error(failedRecord.message || 'Record does not exist')
        }
      } else {
        throw new Error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // Search tasks by title or description
  async searchTasks(searchTerm) {
    try {
      const params = {
        fields: this.getAllFields(),
        where: [
          {
            fieldName: 'title',
            operator: 'Contains',
            values: [searchTerm]
          }
        ]
      }

      return await this.fetchTasks(params)
    } catch (error) {
      console.error('Error searching tasks:', error)
      throw new Error('Failed to search tasks')
    }
  }

  // Filter tasks by status
  async getTasksByStatus(status) {
    try {
      const params = {
        fields: this.getAllFields(),
        where: [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: [status]
          }
        ]
      }

      return await this.fetchTasks(params)
    } catch (error) {
      console.error('Error filtering tasks by status:', error)
      throw new Error('Failed to filter tasks')
    }
  }

  // Filter tasks by priority
  async getTasksByPriority(priority) {
    try {
      const params = {
        fields: this.getAllFields(),
        where: [
          {
            fieldName: 'priority',
            operator: 'ExactMatch',
            values: [priority]
          }
        ]
      }

      return await this.fetchTasks(params)
    } catch (error) {
      console.error('Error filtering tasks by priority:', error)
      throw new Error('Failed to filter tasks')
    }
  }
}

// Export a singleton instance
export default new TaskService()