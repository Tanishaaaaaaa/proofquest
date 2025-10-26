'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, User, DollarSign, CheckCircle, XCircle, Zap, Star, TrendingUp } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Task {
  id: number
  poster: string
  amount: number
  description: string
  status: string
  location: { latitude: number; longitude: number }
  created_at: string
  worker?: string
  accepted_at?: string
  proof?: any
  completed_at?: string
}

export default function TasksPage() {
  const { publicKey, connected } = useWallet()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const acceptTask = async (taskId: number) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      await axios.post(`http://localhost:3001/api/tasks/${taskId}/accept`, {
        worker: publicKey.toString()
      })
      
      toast.success('Task accepted successfully!')
      fetchTasks()
    } catch (error) {
      console.error('Error accepting task:', error)
      toast.error('Failed to accept task')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-neon-green'
      case 'in_progress': return 'text-cyber-orange'
      case 'pending_verification': return 'text-neon-blue'
      case 'completed': return 'text-neon-green'
      case 'rejected': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />
      case 'rejected': return <XCircle className="w-5 h-5" />
      case 'open': return <Zap className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'open': return `${baseClasses} bg-neon-green/20 text-neon-green border border-neon-green/30`
      case 'in_progress': return `${baseClasses} bg-cyber-orange/20 text-cyber-orange border border-cyber-orange/30`
      case 'pending_verification': return `${baseClasses} bg-neon-blue/20 text-neon-blue border border-neon-blue/30`
      case 'completed': return `${baseClasses} bg-neon-green/20 text-neon-green border border-neon-green/30`
      case 'rejected': return `${baseClasses} bg-red-400/20 text-red-400 border border-red-400/30`
      default: return `${baseClasses} bg-gray-400/20 text-gray-400 border border-gray-400/30`
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'available') return task.status === 'open'
    if (filter === 'my-tasks') return task.worker === publicKey?.toString() || task.poster === publicKey?.toString()
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-teal"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border border-cyber-teal opacity-20"></div>
          </div>
          <p className="text-gray-400 mt-4 text-lg">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-holographic opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="holographic-text">Task Marketplace</span>
            </h1>
            <p className="text-gray-400 text-xl">
              Complete real-world tasks and earn SOL rewards
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold neon-text mb-1">{tasks.length}</div>
              <div className="text-gray-400 text-sm">Total Tasks</div>
            </div>
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold neon-text mb-1">{tasks.filter(t => t.status === 'open').length}</div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold neon-text mb-1">{tasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold neon-text mb-1">
                {tasks.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </div>
              <div className="text-gray-400 text-sm">SOL Rewards</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { key: 'all', label: 'All Tasks', icon: TrendingUp },
              { key: 'available', label: 'Available', icon: Zap },
              { key: 'my-tasks', label: 'My Tasks', icon: Star }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  filter === filterOption.key
                    ? 'bg-cyber-gradient text-white shadow-cyber'
                    : 'bg-dark-surface/50 text-gray-400 hover:text-white hover:bg-dark-surface'
                }`}
              >
                <filterOption.icon className="w-4 h-4" />
                {filterOption.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={filter}
            className="grid gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="cyber-card group hover:scale-[1.02] transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                      </div>
                      <div className={getStatusBadge(task.status)}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-cyber-teal transition-colors">
                      {task.description}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-cyber-teal">{task.amount} SOL</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {task.poster.slice(0, 8)}...
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">
                      Task #{task.id}
                    </div>
                    {task.worker && (
                      <div className="text-xs text-gray-500">
                        Worker: {task.worker.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  {task.status === 'open' && connected && (
                    <motion.button
                      onClick={() => acceptTask(task.id)}
                      className="cyber-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Accept Task
                    </motion.button>
                  )}

                  {task.status === 'in_progress' && task.worker === publicKey?.toString() && (
                    <motion.a 
                      href={`/task/${task.id}`}
                      className="cyber-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Proof
                    </motion.a>
                  )}

                  <motion.a 
                    href={`/task/${task.id}`}
                    className="bg-transparent border border-dark-border text-gray-300 py-2 px-4 rounded-lg hover:border-cyber-teal hover:text-cyber-teal transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No tasks found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === 'available' ? 'No available tasks at the moment' : 
               filter === 'my-tasks' ? 'You haven\'t participated in any tasks yet' :
               'No tasks match your current filter'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
