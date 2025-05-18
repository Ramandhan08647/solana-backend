const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { Keypair } = require('@solana/web3.js');
const { encodeURL } = require('@solana/pay');

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sample merchant wallet (public)
const merchantWallet = 'YourMerchantPublicKeyHere';

// Payment Endpoint
app.post('/create-payment', (req, res) => {
  const { amount, label } = req.body;

  if (!amount || !label) {
    return res.status(400).json({ error: 'Amount and label required.' });
  }

  // Create payment URL (QR / Redirect)
  const url = encodeURL({
    recipient: merchantWallet,
    amount: parseFloat(amount),
    label: `Payment for ${label}`,
    message: 'Secure Solana Payment'
  });
