# 🚀 ProofQuest - Decentralized Physical World Micro-Task Marketplace

A Solana-based platform where users can post real-world micro-tasks, accept them, submit proof, and receive on-chain payments with reputation NFTs.

## 🧩 Overview

**ProofQuest** bridges the gap between the physical and digital worlds by creating a **decentralized task marketplace** on **Solana**.  
Users can post and complete **real-world micro-tasks** — such as verifying a location, taking a photo, or scanning a QR — and earn instant on-chain payments through **smart-contract-secured escrows**.

Our mission is to **prove real-world actions on-chain** and empower individuals anywhere to monetize their time and local presence — without intermediaries.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  Smart Contract │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Anchor)      │
│                 │    │                 │    │                 │
│ • Wallet Connect│    │ • REST API      │    │ • Task Escrow   │
│ • Task UI       │    │ • IPFS Upload   │    │ • Payment Logic │
│ • Proof Upload  │    │ • Solana RPC    │    │ • Reputation NFT│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   IPFS Storage  │
                    │                 │
                    │ • Proof Images  │
                    │ • Metadata      │
                    └─────────────────┘
```

## 🛠️ Tech Stack

- **Blockchain**: Solana (Devnet)
- **Smart Contract**: Anchor Framework
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: IPFS (via Pinata)
- **Wallet**: Phantom Wallet Adapter
- **UI**: Framer Motion + Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Tanishaaaaaaa/proofquest.git
   cd proofquest
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy smart contract:**
   ```bash
   cd smart-contract
   anchor build
   anchor deploy
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

## 🎯 Demo Flow

### For Hackathon Presentation

1. **Connect Wallet** (Phantom)
   - Visit the homepage
   - Click "Connect Wallet" 
   - Select Phantom wallet

2. **Create Task**
   - Navigate to `/create`
   - Fill in task details
   - Submit transaction

3. **Accept Task** (Different wallet)
   - Switch to another wallet
   - Go to `/tasks`
   - Accept the created task

4. **Submit Proof**
   - Upload proof image
   - Submit transaction
   - Wait for verification

5. **Verify & Release**
   - Switch back to original wallet
   - Verify proof
   - Release payment

6. **View Reputation NFT**
   - Check profile page
   - See earned reputation NFT

## 🔧 Development

### Smart Contract

```bash
cd smart-contract
anchor build
anchor test
anchor deploy
```

### Backend API

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## 📱 Features

### Core Features
- ✅ Wallet connection (Phantom)
- ✅ Task creation and management
- ✅ Proof submission with IPFS
- ✅ On-chain escrow system
- ✅ Reputation NFT minting
- ✅ Responsive UI with animations

### Smart Contract Functions
- `create_task()` - Create new task with escrow
- `accept_task()` - Accept available task
- `submit_proof()` - Submit completion proof
- `verify_and_release()` - Verify proof and release payment
- `mint_reputation_nft()` - Mint reputation NFT

## 🌐 API Endpoints

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `POST /api/tasks/:id/accept` - Accept task
- `POST /api/tasks/:id/submit-proof` - Submit proof
- `POST /api/tasks/:id/verify` - Verify proof

## 🎨 UI/UX Features

- **Clean Black Theme**: Professional dark design
- **Smooth Animations**: Framer Motion transitions
- **Responsive Design**: Mobile-first approach
- **Toast Notifications**: Real-time feedback
- **Wallet Integration**: Seamless Solana wallet connection

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Render)
```bash
cd backend
# Deploy to Render with environment variables
```

### Smart Contract (Devnet)
```bash
cd smart-contract
anchor deploy --provider.cluster devnet
```

## 📊 Sample Tasks

The platform comes with pre-populated demo tasks:

1. **"Take a photo of the nearest post office"** - 0.1 SOL
2. **"Scan a QR code on a local shop wall"** - 0.05 SOL

## 🔐 Security Features

- **Escrow System**: Funds locked until task completion
- **Proof Verification**: IPFS-based proof storage
- **Reputation System**: NFT-based reputation tracking
- **Wallet Integration**: Secure Solana wallet connection

## 📈 Future Enhancements

- [ ] Token rewards for task completions
- [ ] Leaderboards and gamification
- [ ] Advanced reputation scoring
- [ ] Multi-signature verification
- [ ] Mobile app (Solana Mobile Stack)

## 🧭 Prize Tracks

- 🧍‍♀️ **Consumer Apps** – Real-world use case for everyday users  
- 🧱 **Infrastructure** – On-chain proof & payment layer  
- 🌐 **RWAs (Real World Assets)** – Bridging physical work with digital value  

## 🧑‍💻 Team

**Tanisha (@tanishaaa)** – Backend + Smart Contracts + Architecture  
*(Solo submission for Solana Cypherpunk Hackathon – open to collaborators!)*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎥 Demo Video Script

1. **Introduction** (30s)
   - Show homepage with clean black design
   - Explain the concept briefly

2. **Wallet Connection** (30s)
   - Connect Phantom wallet
   - Show wallet balance

3. **Create Task** (60s)
   - Navigate to create page
   - Fill form and submit
   - Show transaction confirmation

4. **Accept Task** (60s)
   - Switch to different wallet
   - Browse and accept task
   - Show task status change

5. **Submit Proof** (90s)
   - Upload proof image
   - Submit proof
   - Show IPFS hash

6. **Verify & Complete** (60s)
   - Switch back to original wallet
   - Verify proof
   - Show payment release

7. **Reputation NFT** (30s)
   - Show earned reputation NFT
   - Explain the system

**Total Demo Time: ~5 minutes**

---

### ✨ "Prove It. Earn It. Own It." — ProofQuest

Built for the Solana Cypherpunk Hackathon 🚀
