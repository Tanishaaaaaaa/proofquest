'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Globe, CheckCircle, DollarSign, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-300">Decentralized Task Marketplace</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gradient">ProofQuest</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Complete real-world micro-tasks, earn <span className="text-primary font-semibold">SOL rewards</span>, 
              and build your reputation with <span className="text-accent font-semibold">NFT achievements</span>.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <WalletMultiButton className="btn-primary text-lg px-8 py-4" />
              <Link href="/tasks" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                Explore Tasks <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary mb-2">$0.001</div>
                <div className="text-gray-400">Transaction Cost</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary mb-2">&lt;1s</div>
                <div className="text-gray-400">Transaction Speed</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-gray-400">Decentralized</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-dark-900">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gradient">How It Works</span>
            </h2>
            <p className="text-gray-400 text-xl">Simple, secure, and decentralized</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Post Tasks",
                description: "Create micro-tasks with SOL rewards. Funds are automatically escrowed in smart contracts for security.",
                delay: 0
              },
              {
                icon: Globe,
                title: "Complete Tasks",
                description: "Accept tasks, complete them in the real world, and submit proof via decentralized IPFS storage.",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "Earn Rewards",
                description: "Get paid in SOL instantly and earn reputation NFTs that showcase your achievements and trustworthiness.",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="card text-center group hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card"
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-gradient">Ready to Start?</span>
              </h2>
              <p className="text-gray-400 mb-8 text-xl leading-relaxed">
                Join the decentralized workforce and start earning SOL by completing real-world tasks. 
                Build your reputation and unlock new opportunities in the Web3 economy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create" className="btn-primary text-lg px-8 py-4">
                  Create Your First Task
                </Link>
                <Link href="/tasks" className="btn-secondary text-lg px-8 py-4">
                  Browse Available Tasks
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
