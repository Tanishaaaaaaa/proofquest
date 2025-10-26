# ProofQuest Demo Script

## 🎬 Video Presentation Flow (5 minutes)

### 1. Introduction & Setup (30 seconds)
- **Show**: Homepage with cyberpunk design
- **Say**: "Welcome to ProofQuest - a decentralized physical world micro-task marketplace built on Solana"
- **Action**: Scroll through homepage features
- **Highlight**: Mission statement and key features

### 2. Wallet Connection (30 seconds)
- **Show**: Click "Connect Wallet" button
- **Say**: "First, let's connect our Phantom wallet to interact with the Solana blockchain"
- **Action**: Connect Phantom wallet
- **Highlight**: Wallet balance and connection status

### 3. Create Task (60 seconds)
- **Show**: Navigate to `/create` page
- **Say**: "Now let's create a micro-task. I'll post a task asking someone to take a photo of a nearby café"
- **Action**: Fill out form:
  - Description: "Take a photo of the nearest café with outdoor seating"
  - Amount: "0.1 SOL"
  - Location: "37.7749, -122.4194"
- **Say**: "The SOL reward is automatically escrowed in our smart contract"
- **Action**: Submit and show transaction confirmation

### 4. Accept Task (60 seconds)
- **Show**: Switch to different wallet (or simulate)
- **Say**: "Now let's switch to a different wallet to accept this task"
- **Action**: Navigate to `/tasks` page
- **Say**: "Here we can see all available tasks. Let's accept the café photo task"
- **Action**: Click "Accept Task"
- **Highlight**: Task status changes to "In Progress"

### 5. Submit Proof (90 seconds)
- **Show**: Navigate to task detail page
- **Say**: "After completing the task, the worker needs to submit proof"
- **Action**: Upload a sample photo
- **Say**: "The proof is uploaded to IPFS for decentralized storage"
- **Action**: Submit proof
- **Highlight**: Show IPFS hash and submission confirmation

### 6. Verify & Release Payment (60 seconds)
- **Show**: Switch back to original wallet (task poster)
- **Say**: "Now the task poster needs to verify the proof"
- **Action**: Navigate to task detail page
- **Say**: "The poster can review the submitted proof and decide whether to approve it"
- **Action**: Click "Approve Proof"
- **Say**: "Once approved, the escrowed SOL is automatically released to the worker"
- **Highlight**: Show payment release and task completion

### 7. Reputation NFT (30 seconds)
- **Show**: Navigate to profile page
- **Say**: "As a bonus, the worker earns a reputation NFT that showcases their achievements"
- **Action**: Show earned reputation NFT
- **Say**: "This creates a trust system where reliable workers build their reputation over time"

### 8. Conclusion (30 seconds)
- **Show**: Overview of the platform
- **Say**: "ProofQuest demonstrates how Solana can power real-world micro-economies with secure escrow, decentralized storage, and reputation systems"
- **Highlight**: Key technical achievements and potential use cases

## 🎯 Key Points to Emphasize

1. **Real-world Utility**: Tasks involve physical world activities
2. **Decentralized Security**: Smart contract escrow system
3. **IPFS Integration**: Decentralized proof storage
4. **Reputation System**: NFT-based trust mechanism
5. **Solana Benefits**: Fast, cheap transactions
6. **User Experience**: Intuitive wallet integration

## 🛠️ Technical Highlights

- **Smart Contract**: Anchor-based Solana program
- **Frontend**: Next.js with Tailwind and Framer Motion
- **Backend**: Node.js API with IPFS integration
- **Wallet**: Phantom wallet adapter
- **Storage**: IPFS for proof metadata

## 📱 Demo Preparation Checklist

- [ ] Phantom wallet installed and funded with devnet SOL
- [ ] Two different wallet accounts ready
- [ ] Sample photos prepared for proof submission
- [ ] All services running locally
- [ ] Smart contract deployed to devnet
- [ ] Backend API running on port 3001
- [ ] Frontend running on port 3000

## 🎥 Recording Tips

1. **Screen Recording**: Use high resolution (1920x1080)
2. **Audio**: Clear narration with good microphone
3. **Pacing**: Don't rush through transactions
4. **Transitions**: Smooth navigation between pages
5. **Highlights**: Use cursor to point out key elements
6. **Timing**: Keep each section within time limits

---

**Total Demo Time: 5 minutes**
**Perfect for hackathon presentation! 🚀**
