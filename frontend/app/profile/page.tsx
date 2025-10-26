'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { User, Trophy, Star, Zap, DollarSign, Calendar, Award, TrendingUp } from 'lucide-react'
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

export default function ProfilePage() {
  const { publicKey, connected } = useWallet()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (connected && publicKey) {
      fetchUserTasks()
    }
  }, [connected, publicKey])

  const fetchUserTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks')
      const userTasks = response.data.filter((task: Task) => 
        task.poster === publicKey?.toString() || task.worker === publicKey?.toString()
      )
      setTasks(userTasks)
    } catch (error) {
      console.error('Error fetching user tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserStats = () => {
    const postedTasks = tasks.filter(t => t.poster === publicKey?.toString())
    const completedTasks = tasks.filter(t => t.worker === publicKey?.toString() && t.status === 'completed')
    const totalEarned = completedTasks.reduce((sum, t) => sum + t.amount, 0)
    const totalSpent = postedTasks.reduce((sum, t) => sum + t.amount, 0)
    
    return {
      postedTasks: postedTasks.length,
      completedTasks: completedTasks.length,
      totalEarned,
      totalSpent,
      reputation: completedTasks.length * 10 // Simple reputation calculation
    }
  }

  const stats = getUserStats()

  if (!connected) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-cyber-teal" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view your profile and achievements</p>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-teal"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border border-cyber-teal opacity-20"></div>
          </div>
          <p className="text-gray-400 mt-4 text-lg">Loading profile...</p>
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
            <div className="w-24 h-24 bg-cyber-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="holographic-text">Your Profile</span>
            </h1>
            <p className="text-gray-400">
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="cyber-card text-center">
              <div className="w-12 h-12 bg-cyber-teal rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold neon-text mb-1">{stats.postedTasks}</div>
              <div className="text-gray-400 text-sm">Tasks Posted</div>
            </div>
            
            <div className="cyber-card text-center">
              <div className="w-12 h-12 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold neon-text mb-1">{stats.completedTasks}</div>
              <div className="text-gray-400 text-sm">Tasks Completed</div>
            </div>
            
            <div className="cyber-card text-center">
              <div className="w-12 h-12 bg-cyber-blue rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold neon-text mb-1">{stats.totalEarned.toFixed(2)}</div>
              <div className="text-gray-400 text-sm">SOL Earned</div>
            </div>
            
            <div className="cyber-card text-center">
              <div className="w-12 h-12 bg-cyber-purple rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold neon-text mb-1">{stats.reputation}</div>
              <div className="text-gray-400 text-sm">Reputation Score</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Achievements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6">
            <span className="holographic-text">Achievements</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "First Task",
                description: "Complete your first task",
                icon: Award,
                unlocked: stats.completedTasks > 0,
                color: "cyber-teal"
              },
              {
                title: "Task Poster",
                description: "Post your first task",
                icon: Zap,
                unlocked: stats.postedTasks > 0,
                color: "cyber-blue"
              },
              {
                title: "Earned SOL",
                description: "Earn your first SOL",
                icon: DollarSign,
                unlocked: stats.totalEarned > 0,
                color: "neon-green"
              },
              {
                title: "Reputation Builder",
                description: "Complete 5 tasks",
                icon: Star,
                unlocked: stats.completedTasks >= 5,
                color: "cyber-purple"
              },
              {
                title: "High Earner",
                description: "Earn 1 SOL total",
                icon: TrendingUp,
                unlocked: stats.totalEarned >= 1,
                color: "cyber-orange"
              },
              {
                title: "Task Master",
                description: "Complete 10 tasks",
                icon: Trophy,
                unlocked: stats.completedTasks >= 10,
                color: "neon-blue"
              }
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className={`cyber-card text-center group ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-50'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: achievement.unlocked ? 1 : 0.5, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
              >
                <div className={`w-16 h-16 bg-${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4 ${
                  achievement.unlocked ? 'shadow-neon' : ''
                }`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-3 text-xs text-neon-green font-semibold">
                    ✓ UNLOCKED
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">
            <span className="holographic-text">Recent Activity</span>
          </h2>
          
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task, index) => (
              <motion.div
                key={task.id}
                className="cyber-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.poster === publicKey?.toString() ? 'bg-cyber-blue' : 'bg-neon-green'
                    }`}>
                      {task.poster === publicKey?.toString() ? (
                        <Zap className="w-5 h-5 text-white" />
                      ) : (
                        <Trophy className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{task.description}</h3>
                      <p className="text-sm text-gray-400">
                        {task.poster === publicKey?.toString() ? 'Posted' : 'Completed'} • {task.amount} SOL
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      task.status === 'completed' ? 'text-neon-green' :
                      task.status === 'open' ? 'text-cyber-teal' :
                      'text-gray-400'
                    }`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(task.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">No activity yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Start by posting or accepting tasks to see your activity here
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
