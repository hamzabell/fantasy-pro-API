// This file contains utility functions for interacting with Polygon blockchain
// for power-ups (NFTs) functionality
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Converts an amount in MATIC to wei (smallest unit)
 * @param maticAmount - Amount in MATIC
 * @returns Amount in wei as a string
 */
export function maticToWei(maticAmount) {
    // 1 MATIC = 10^18 wei
    const weiPerMatic = BigInt(Math.pow(10, 18));
    const maticBigInt = BigInt(Math.floor(parseFloat(maticAmount) * Math.pow(10, 18)));
    return (maticBigInt * weiPerMatic / weiPerMatic).toString();
}
/**
 * Converts an amount in wei to MATIC
 * @param weiAmount - Amount in wei
 * @returns Amount in MATIC as a string
 */
export function weiToMatic(weiAmount) {
    // 1 MATIC = 10^18 wei
    const weiPerMatic = BigInt(Math.pow(10, 18));
    const weiBigInt = BigInt(weiAmount);
    return (weiBigInt / weiPerMatic).toString();
}
/**
 * Validates a Polygon address
 * @param address - The address to validate
 * @returns True if valid, false otherwise
 */
export function isValidPolygonAddress(address) {
    // Basic validation - check if it's a hex string of correct length with 0x prefix
    const polygonAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return polygonAddressRegex.test(address);
}
/**
 * Generates a Polygon network scanner URL for a transaction
 * @param txHash - The transaction hash
 * @param network - The network name (mainnet, mumbai, etc.)
 * @returns The scanner URL
 */
export function getPolygonScanUrl(txHash, network = 'mainnet') {
    const baseUrl = network === 'mainnet' ? 'https://polygonscan.com' : `https://${network}.polygonscan.com`;
    return `${baseUrl}/tx/${txHash}`;
}
/**
 * Generates a Polygon network scanner URL for an address
 * @param address - The address
 * @param network - The network name (mainnet, mumbai, etc.)
 * @returns The scanner URL
 */
export function getPolygonAddressUrl(address, network = 'mainnet') {
    const baseUrl = network === 'mainnet' ? 'https://polygonscan.com' : `https://${network}.polygonscan.com`;
    return `${baseUrl}/address/${address}`;
}
/**
 * Generates a Polygon network scanner URL for a token
 * @param tokenAddress - The token contract address
 * @param tokenId - The token ID (for ERC-721)
 * @param network - The network name (mainnet, mumbai, etc.)
 * @returns The scanner URL
 */
export function getPolygonTokenUrl(tokenAddress, tokenId, network = 'mainnet') {
    const baseUrl = network === 'mainnet' ? 'https://polygonscan.com' : `https://${network}.polygonscan.com`;
    if (tokenId) {
        return `${baseUrl}/token/${tokenAddress}?a=${tokenId}`;
    }
    return `${baseUrl}/token/${tokenAddress}`;
}
/**
 * Formats a timestamp for display
 * @param timestamp - The timestamp to format
 * @returns Formatted date string
 */
export function formatTransactionDate(timestamp) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(timestamp);
}
// Example Polygon contract addresses (these would be replaced with actual deployed contracts)
export const POLYGON_CONTRACT_ADDRESSES = {
    // Power-ups NFT contract
    POWER_UPS_NFT: '0x1234567890123456789012345678901234567890',
    // Marketplace contract
    MARKETPLACE: '0x0987654321098765432109876543210987654321',
    // Our wallet address where NFTs are transferred to
    OUR_WALLET_ADDRESS: '0xABC1234567890123456789012345678901234567890'
};
/**
 * Verifies a transaction on Polygon network by checking if it's a successful NFT transfer
 * @param transactionId - The transaction hash to verify
 * @param network - The network to check on (mainnet or mumbai)
 * @returns Promise<{success: boolean, powerUpId?: string, from?: string, to?: string}>
 */
export function verifyNFTTransaction(transactionId_1) {
    return __awaiter(this, arguments, void 0, function* (transactionId, network = 'mainnet') {
        try {
            // In a real implementation, this would call the Polygon RPC to get transaction details
            // For now, we'll simulate transaction verification
            // Validate transaction ID format
            if (!isValidTransactionHash(transactionId)) {
                return {
                    success: false,
                    error: 'Invalid transaction hash format'
                };
            }
            // In production, you would:
            // 1. Call Polygon RPC endpoint to get transaction details
            // 2. Check if transaction was successful (status: 1)
            // 3. Verify it's an NFT transfer to our wallet address
            // 4. Extract powerUpId from transaction logs/metadata
            // Simulated verification for development
            const mockTransaction = yield simulateTransactionVerification(transactionId);
            if (mockTransaction.success && mockTransaction.to === POLYGON_CONTRACT_ADDRESSES.OUR_WALLET_ADDRESS) {
                return {
                    success: true,
                    powerUpId: mockTransaction.powerUpId,
                    from: mockTransaction.from,
                    to: mockTransaction.to
                };
            }
            return {
                success: false,
                error: 'Transaction not found or not a valid NFT transfer to our address'
            };
        }
        catch (error) {
            console.error('Error verifying transaction:', error);
            return {
                success: false,
                error: 'Failed to verify transaction'
            };
        }
    });
}
/**
 * Validates if a string is a valid transaction hash
 * @param hash - The hash to validate
 * @returns True if valid, false otherwise
 */
export function isValidTransactionHash(hash) {
    // Transaction hash should be 0x followed by 64 hex characters
    const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
    return txHashRegex.test(hash);
}
/**
 * Simulates transaction verification for development/testing
 * In production, replace this with actual RPC calls
 * @param transactionId - The transaction ID to simulate
 */
function simulateTransactionVerification(transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Simulate async API call delay
        yield new Promise(resolve => setTimeout(resolve, 100));
        // Mock successful transactions for testing
        const mockSuccessfulTxs = [
            '0x1234567890123456789012345678901234567890123456789012345678901234',
            '0xabcdef1234567890123456789012345678901234567890123456789012345678'
        ];
        if (mockSuccessfulTxs.includes(transactionId)) {
            return {
                success: true,
                powerUpId: '1', // Mock power-up ID from NFT metadata
                from: '0x9876543210987654321098765432109876543210',
                to: POLYGON_CONTRACT_ADDRESSES.OUR_WALLET_ADDRESS
            };
        }
        return { success: false };
    });
}
// Polygon network configuration
export const POLYGON_NETWORK_CONFIG = {
    chainId: 137, // Mainnet
    chainName: 'Polygon Mainnet',
    currency: 'MATIC',
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
};
// Testnet configuration
export const POLYGON_MUMBAI_CONFIG = {
    chainId: 80001, // Mumbai Testnet
    chainName: 'Polygon Mumbai',
    currency: 'MATIC',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};
