'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ArrowLeft, Zap, DollarSign, MapPin, Sparkles, Upload } from 'lucide-react'

export default function CreateTaskPage() {
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    latitude: '',
    longitude: ''
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.description || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      const response = await axios.post('http://localhost:3001/api/tasks', {
        poster: publicKey.toString(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        location: {
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0
        }
      })
      
      toast.success('Task created successfully!')
      router.push('/tasks')
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const nextStep = () => {
    if (step === 1 && formData.description && formData.amount) {
      setStep(2)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

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
            <Zap className="w-12 h-12 text-cyber-teal" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">You need to connect your wallet to create tasks</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-holographic opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-dark-surface/50 hover:bg-dark-surface transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="holographic-text">Create New Task</span>
              </h1>
              <p className="text-gray-400">Post a micro-task and escrow SOL rewards</p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-cyber-gradient text-white' 
                    : 'bg-dark-surface text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                <div className={`ml-2 text-sm ${
                  step >= stepNumber ? 'text-white' : 'text-gray-400'
                }`}>
                  {stepNumber === 1 ? 'Task Details' : 'Review & Submit'}
                </div>
                {stepNumber < 2 && (
                  <div className={`w-8 h-px ml-4 ${
                    step > stepNumber ? 'bg-cyber-teal' : 'bg-dark-border'
                  }`} />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="cyber-card"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Task Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyber-teal" />
                      Task Description *
                    </div>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the task that needs to be completed... Be specific about what you need done."
                    className="cyber-input w-full h-32 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Be clear and specific about what needs to be done
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-cyber-teal" />
                      Reward Amount (SOL) *
                    </div>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.1"
                    step="0.01"
                    min="0.01"
                    className="cyber-input w-full"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum 0.01 SOL. Higher rewards attract more workers.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyber-teal" />
                        Latitude (optional)
                      </div>
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="37.7749"
                      step="any"
                      className="cyber-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyber-teal" />
                        Longitude (optional)
                      </div>
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="-122.4194"
                      step="any"
                      className="cyber-input w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-dark-surface/50 p-6 rounded-lg border border-dark-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyber-teal" />
                    Task Preview
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-400">Description:</span>
                      <p className="text-white mt-1">{formData.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Reward:</span>
                      <p className="text-cyber-teal font-semibold mt-1">{formData.amount} SOL</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Location:</span>
                      <p className="text-white mt-1">
                        {formData.latitude && formData.longitude ? 
                          `${formData.latitude}, ${formData.longitude}` : 
                          'No specific location'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-neon-green/10 border border-neon-green/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-neon-green mb-2">Important Notes:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Funds will be escrowed in a smart contract</li>
                    <li>• Payment is released only after task completion</li>
                    <li>• You can verify proof before releasing payment</li>
                    <li>• Transaction fees are minimal on Solana</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {step === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-transparent border border-dark-border text-gray-300 py-3 px-6 rounded-lg hover:border-cyber-teal hover:text-cyber-teal transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.description || !formData.amount}
                    className="flex-1 cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-transparent border border-dark-border text-gray-300 py-3 px-6 rounded-lg hover:border-cyber-teal hover:text-cyber-teal transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      'Create Task'
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
