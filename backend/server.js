const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, web3 } = require('@coral-xyz/anchor');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
const programId = new PublicKey(process.env.PROGRAM_ID || 'ProofQuest111111111111111111111111111111111');

// IPFS configuration
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

// Sample tasks for demo
let tasks = [
  {
    id: 1,
    poster: 'DemoPoster111111111111111111111111111111111',
    amount: 0.1,
    description: 'Take a photo of the nearest post office',
    status: 'open',
    location: { latitude: 37.7749, longitude: -122.4194 },
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    poster: 'DemoPoster222222222222222222222222222222222',
    amount: 0.05,
    description: 'Scan a QR code on a local shop wall',
    status: 'open',
    location: { latitude: 37.7849, longitude: -122.4094 },
    created_at: new Date().toISOString()
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { poster, amount, description, location } = req.body;
  
  if (!poster || !amount || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newTask = {
    id: tasks.length + 1,
    poster,
    amount: parseFloat(amount),
    description,
    status: 'open',
    location: location || { latitude: 0, longitude: 0 },
    created_at: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Accept task
app.post('/api/tasks/:id/accept', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { worker } = req.body;
  
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (task.status !== 'open') {
    return res.status(400).json({ error: 'Task is not available' });
  }
  
  task.worker = worker;
  task.status = 'in_progress';
  task.accepted_at = new Date().toISOString();
  
  res.json(task);
});

// Submit proof
app.post('/api/tasks/:id/submit-proof', upload.single('proof'), async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { worker, location } = req.body;
  
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (task.status !== 'in_progress' || task.worker !== worker) {
    return res.status(400).json({ error: 'Task is not in progress or worker mismatch' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'No proof file uploaded' });
  }
  
  try {
    // Upload to IPFS (simplified - in production, use proper IPFS service)
    const ipfsHash = await uploadToIPFS(req.file.path);
    
    task.proof = {
      ipfs_hash: ipfsHash,
      location: JSON.parse(location || '{}'),
      submitted_at: new Date().toISOString(),
      file_path: req.file.path
    };
    task.status = 'pending_verification';
    
    res.json(task);
  } catch (error) {
    console.error('Error uploading proof:', error);
    res.status(500).json({ error: 'Failed to upload proof' });
  }
});

// Verify and release payment
app.post('/api/tasks/:id/verify', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { poster, valid_proof } = req.body;
  
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (task.status !== 'pending_verification' || task.poster !== poster) {
    return res.status(400).json({ error: 'Task is not pending verification or poster mismatch' });
  }
  
  if (valid_proof) {
    task.status = 'completed';
    task.completed_at = new Date().toISOString();
    
    // In a real implementation, this would trigger the Solana transaction
    // to release the escrowed funds to the worker
  } else {
    task.status = 'rejected';
    task.rejected_at = new Date().toISOString();
  }
  
  res.json(task);
});

// Helper function to upload to IPFS (simplified)
async function uploadToIPFS(filePath) {
  // In a real implementation, you would use a proper IPFS service
  // For demo purposes, we'll generate a mock hash
  const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15);
  
  // Clean up uploaded file
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }, 5000);
  
  return mockHash;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ProofQuest Backend running on port ${PORT}`);
  console.log(`📡 Solana RPC: ${process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'}`);
});
