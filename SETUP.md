# ProofQuest Installation & Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
Make sure you have the following installed:
- Node.js 18+ 
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+

### 2. Install Dependencies
```bash
# Install all dependencies across the monorepo
npm run install:all
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# At minimum, you need:
# - SOLANA_RPC_URL (devnet)
# - PROGRAM_ID (your deployed program ID)
```

### 4. Deploy Smart Contract
```bash
cd smart-contract
anchor build
anchor deploy
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Frontend: npm run dev:frontend
# Backend: npm run dev:backend
```

## 🔧 Development Commands

### Smart Contract
```bash
cd smart-contract
anchor build          # Build the program
anchor test           # Run tests
anchor deploy         # Deploy to devnet
```

### Backend API
```bash
cd backend
npm run dev          # Start with nodemon
npm start            # Start production server
```

### Frontend
```bash
cd frontend
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm start            # Start production server
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 🎯 Demo Preparation

1. **Install Phantom Wallet** browser extension
2. **Fund wallet** with devnet SOL:
   ```bash
   solana airdrop 2 <your-wallet-address> --url devnet
   ```
3. **Create second wallet** for demo (or use different account)
4. **Prepare sample photos** for proof submission

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure Phantom wallet is installed
   - Check if wallet is unlocked
   - Try refreshing the page

2. **Transaction Failed**
   - Check wallet has enough SOL
   - Verify network is set to Devnet
   - Check console for error messages

3. **Backend Connection Error**
   - Ensure backend is running on port 3001
   - Check CORS settings
   - Verify API endpoints are accessible

4. **Smart Contract Deployment Failed**
   - Check Anchor.toml configuration
   - Verify Solana CLI is properly configured
   - Ensure sufficient SOL for deployment

### Getting Help

- Check the console for error messages
- Verify all services are running
- Ensure environment variables are set correctly
- Check network connectivity

## 📱 Mobile Testing

For mobile testing, you can use:
- **Solana Mobile Stack** (if available)
- **Phantom Mobile** app
- **Browser wallet** on mobile devices

## 🔐 Security Notes

- This is a demo/hackathon project
- Use devnet for testing only
- Never use mainnet with real funds
- Smart contract is not audited

---

**Ready to demo! 🚀**
