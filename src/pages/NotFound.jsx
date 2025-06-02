import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-soft"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gradient mb-4">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The task you're looking for seems to have escaped! Let's get you back on track.
        </p>
        
        <Link 
          to="/"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Back to TaskFlow</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound