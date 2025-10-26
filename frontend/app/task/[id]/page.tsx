'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Upload, MapPin, Clock, User, DollarSign, CheckCircle } from 'lucide-react'

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

export default function TaskDetailPage() {
  const { publicKey, connected } = useWallet()
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [submittingProof, setSubmittingProof] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchTask(Number(params.id))
    }
  }, [params.id])

  const fetchTask = async (taskId: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tasks/${taskId}`)
      setTask(response.data)
    } catch (error) {
      console.error('Error fetching task:', error)
      toast.error('Failed to fetch task')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
    }
  }

  const submitProof = async () => {
    if (!connected || !publicKey || !task) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!proofFile) {
      toast.error('Please select a proof file')
      return
    }

    setSubmittingProof(true)

    try {
      const formData = new FormData()
      formData.append('proof', proofFile)
      formData.append('worker', publicKey.toString())
      formData.append('location', JSON.stringify({
        latitude: task.location.latitude,
        longitude: task.location.longitude
      }))

      await axios.post(`http://localhost:3001/api/tasks/${task.id}/submit-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Proof submitted successfully!')
      fetchTask(task.id)
    } catch (error) {
      console.error('Error submitting proof:', error)
      toast.error('Failed to submit proof')
    } finally {
      setSubmittingProof(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyber-teal"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
          <p className="text-gray-400 mb-6">The task you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/tasks')}
            className="cyber-button"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    )
  }

  const isWorker = task.worker === publicKey?.toString()
  const isPoster = task.poster === publicKey?.toString()

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="cyber-card"
        >
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{task.description}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {task.amount} SOL
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
                <div className={`text-sm font-medium ${
                  task.status === 'completed' ? 'text-green-400' :
                  task.status === 'in_progress' ? 'text-yellow-400' :
                  task.status === 'open' ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </div>
                {task.worker && (
                  <div className="text-xs text-gray-400 mt-1">
                    Worker: {task.worker.slice(0, 8)}...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Task Status Sections */}
          {task.status === 'open' && connected && (
            <div className="bg-dark-surface/50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Accept This Task</h3>
              <p className="text-gray-400 mb-4">
                You can accept this task and start working on it. Once accepted, you'll need to complete the task and submit proof.
              </p>
              <button
                onClick={() => {
                  // This would trigger the Solana transaction to accept the task
                  toast.success('Task accepted! You can now work on it.')
                }}
                className="cyber-button"
              >
                Accept Task
              </button>
            </div>
          )}

          {task.status === 'in_progress' && isWorker && (
            <div className="bg-dark-surface/50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Submit Proof</h3>
              <p className="text-gray-400 mb-4">
                Upload a photo or document as proof that you've completed the task.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Proof File (Image/Document)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="cyber-input w-full"
                  />
                </div>
                
                {proofFile && (
                  <div className="bg-dark-surface p-4 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Selected file: {proofFile.name} ({(proofFile.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                )}
                
                <button
                  onClick={submitProof}
                  disabled={!proofFile || submittingProof}
                  className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingProof ? 'Submitting...' : 'Submit Proof'}
                </button>
              </div>
            </div>
          )}

          {task.status === 'pending_verification' && isPoster && (
            <div className="bg-dark-surface/50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Verify Proof</h3>
              <p className="text-gray-400 mb-4">
                Review the submitted proof and decide whether to approve or reject it.
              </p>
              
              {task.proof && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Proof submitted:</p>
                  <div className="bg-dark-surface p-4 rounded-lg">
                    <p className="text-sm">IPFS Hash: {task.proof.ipfs_hash}</p>
                    <p className="text-sm">Submitted: {new Date(task.proof.submitted_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // This would trigger the Solana transaction to reject the proof
                    toast.success('Proof rejected. Payment returned to poster.')
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Reject Proof
                </button>
                <button
                  onClick={() => {
                    // This would trigger the Solana transaction to approve the proof
                    toast.success('Proof approved! Payment released to worker.')
                  }}
                  className="flex-1 cyber-button"
                >
                  Approve Proof
                </button>
              </div>
            </div>
          )}

          {task.status === 'completed' && (
            <div className="bg-green-900/20 border border-green-500/50 p-6 rounded-lg mb-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Task Completed</h3>
              </div>
              <p className="text-gray-400">
                This task has been completed and payment has been released to the worker.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => router.push('/tasks')}
              className="bg-transparent border border-dark-border text-gray-300 py-3 px-6 rounded-lg hover:border-cyber-teal hover:text-cyber-teal transition-all duration-300"
            >
              Back to Tasks
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
