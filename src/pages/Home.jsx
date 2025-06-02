import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { AuthContext } from '../App'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient">
                TaskFlow
              </h1>
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <span className="text-surface-600 dark:text-surface-400">
                    Welcome, {user?.firstName || user?.name || 'User'}
                  </span>
                  <button
                    onClick={logout}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Streamline your productivity with intelligent task management designed for modern workflows.
            </p>
</motion.div>
        </div>
      </header>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
              Organize Your Life with{' '}
              <span className="text-gradient">TaskFlow</span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
              Streamline your productivity with intelligent task management, priority tracking, and seamless collaboration.
            </p>
          </motion.div>

          {/* Main Feature */}
          <MainFeature />

          {/* Stats */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: 'Target', label: 'Tasks Completed', value: '0', color: 'text-green-600' },
              { icon: 'Clock', label: 'Active Tasks', value: '0', color: 'text-blue-600' },
              { icon: 'TrendingUp', label: 'Productivity', value: '0%', color: 'text-purple-600' },
              { icon: 'Award', label: 'Achievements', value: '0', color: 'text-yellow-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card text-center hover:shadow-soft transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-${stat.color.split('-')[1]}-100 to-${stat.color.split('-')[1]}-200 flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {stat.value}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Home