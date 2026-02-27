
import { logger } from '@/app/lib/logger';

const FLARE_RPC_URL = process.env.FLARE_RPC_URL || '';
const FLARE_PRIVATE_KEY = process.env.FLARE_PRIVATE_KEY || '';
const FLARE_CHAIN_ID = parseInt(process.env.FLARE_CHAIN_ID || '14', 10);
const TOKEN_CONTRACT = process.env.FLARE_TOKEN_CONTRACT_ADDRESS || '';

// Minimal ERC-20 ABI for transfer
const ERC20_TRANSFER_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address account) view returns (uint256)',
];

/**
 * Transfer tokens on Flare network.
 *
 * This uses ethers.js to interact with an ERC-20 contract on Flare.
 * Ensure ethers is installed: npm install ethers
 *
 * Returns the transaction hash on success.
 */
export async function transferTokens(
  toAddress: string,
  amount: number,
  tokenSymbol: string
): Promise<{ txHash: string }> {
  if (!FLARE_RPC_URL || !FLARE_PRIVATE_KEY || !TOKEN_CONTRACT) {
    throw new Error(
      'Flare chain not configured. Set FLARE_RPC_URL, FLARE_PRIVATE_KEY, FLARE_TOKEN_CONTRACT_ADDRESS'
    );
  }

  if (!toAddress || !toAddress.startsWith('0x')) {
    throw new Error('Invalid wallet address');
  }

  try {
    // Dynamic import — ethers is only needed at runtime for token transfers
    const { ethers } = await import('ethers');

    const provider = new ethers.JsonRpcProvider(FLARE_RPC_URL, FLARE_CHAIN_ID);
    const wallet = new ethers.Wallet(FLARE_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(TOKEN_CONTRACT, ERC20_TRANSFER_ABI, wallet);

    // Get token decimals
    const decimals = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    // Check balance
    const balance = await contract.balanceOf(wallet.address);
    if (balance < parsedAmount) {
      throw new Error(
        `Insufficient token balance. Have: ${ethers.formatUnits(balance, decimals)}, Need: ${amount}`
      );
    }

    // Execute transfer
    const tx = await contract.transfer(toAddress, parsedAmount);
    const receipt = await tx.wait();

    logger.info('Token transfer successful', {
      txHash: receipt.hash,
      to: toAddress,
      amount,
      tokenSymbol,
    });

    return { txHash: receipt.hash };
  } catch (error) {
    logger.error(
      'Token transfer failed',
      error instanceof Error ? error : new Error(String(error)),
      { toAddress, amount, tokenSymbol }
    );
    throw error;
  }
}

/**
 * Check the platform wallet's token balance.
 */
export async function getWalletBalance(): Promise<{
  balance: string;
  address: string;
}> {
  if (!FLARE_RPC_URL || !FLARE_PRIVATE_KEY || !TOKEN_CONTRACT) {
    return { balance: '0', address: 'not_configured' };
  }

  const { ethers } = await import('ethers');

  const provider = new ethers.JsonRpcProvider(FLARE_RPC_URL, FLARE_CHAIN_ID);
  const wallet = new ethers.Wallet(FLARE_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(TOKEN_CONTRACT, ERC20_TRANSFER_ABI, wallet);

  const decimals = await contract.decimals();
  const balance = await contract.balanceOf(wallet.address);

  return {
    balance: ethers.formatUnits(balance, decimals),
    address: wallet.address,
  };
}