'use client'

import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <motion.div
            className="w-32 h-32 border-4 border-transparent border-t-cyber-teal rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner pulsing ring */}
          <motion.div
            className="absolute inset-4 w-24 h-24 border-4 border-transparent border-b-cyber-blue rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center pulsing dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-4 h-4 bg-cyber-purple rounded-full" />
          </motion.div>
        </div>
        
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold neon-text">Loading...</h3>
          <p className="text-gray-400">Preparing your experience</p>
        </motion.div>
      </div>
    </div>
  )
}
