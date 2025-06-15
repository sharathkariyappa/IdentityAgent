// backend/index.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { ethers, isAddress, JsonRpcProvider } from 'ethers';
import { ERC20_ABI } from './erc20ABI.js';

const app = express();
app.use(cors());
app.use(express.json());

const provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

// --- GitHub Auth (unchanged)
app.get('/api/github/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenRes.data;
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.redirect(
      `http://localhost:5173/github/callback?token=${access_token}&data=${encodeURIComponent(JSON.stringify(userRes.data))}`
    );
  } catch (err) {
    console.error('GitHub Auth Error:', err?.response?.data || err.message);
    res.status(500).send('GitHub auth failed');
  }
});

// --- Onchain stats with ethers.js
app.get('/api/onchain-stats', async (req, res) => {
  let { address } = req.query;

  if (!address || typeof address !== 'string' || !isAddress(address)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  try {
    // Normalize address casing to avoid checksum issues
    address = ethers.getAddress(address);

    const balance = await provider.getBalance(address);
    const txCount = await provider.getTransactionCount(address);
    const code = await provider.getCode(address);
    const isContractDeployer = code !== '0x';

    // Fixed token addresses with proper checksums
    const tokens = [
      { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
      { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }, // Fixed checksum
    ];

    const tokenBalances = await Promise.all(
      tokens.map(async (token) => {
        try {
          // Also normalize token contract addresses
          const tokenAddress = ethers.getAddress(token.address);
          const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
          const rawBalance = await contract.balanceOf(address);
          const decimals = await contract.decimals();
          return {
            symbol: token.symbol,
            balance: parseFloat(ethers.formatUnits(rawBalance, decimals)),
          };
        } catch (tokenError) {
          console.error(`Error fetching ${token.symbol} balance:`, tokenError.message);
          return {
            symbol: token.symbol,
            balance: 0,
            error: tokenError.message,
          };
        }
      })
    );

    const hasNFTs = code !== '0x'; // Heuristic for now

    res.json({
      address,
      balance: ethers.formatEther(balance),
      txCount,
      isContractDeployer,
      tokenBalances,
      hasNFTs,
    });
  } catch (error) {
    console.error('Error fetching onchain stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch onchain data' });
  }
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});