const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const { encodeURL } = require('@solana/pay');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve frontend static files (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Get merchant wallet from environment
const merchantWallet = process.env.MERCHANT_WALLET;

if (!merchantWallet) {
  console.error("❌ MERCHANT_WALLET not set in environment.");
  process.exit(1);
}

// Solana Pay endpoint
app.post('/create-payment', (req, res) => {
  const { amount, label } = req.body;

  if (!amount || !label) {
    return res.status(400).json({ error: 'Amount and label are required.' });
  }

  try {
    const url = encodeURL({
      recipient: merchantWallet,
      amount: parseFloat(amount),
      label: `Payment for ${label}`,
      message: 'Secure Solana Payment via Elite Craft'
    });

    res.status(200).json({ payment_url: url.href });
  } catch (err) {
    console.error('Error generating Solana payment URL:', err);
    res.status(500).json({ error: 'Failed to create payment URL.' });
  }
});

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Pricing.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running and ready on port ${PORT}`);
});
