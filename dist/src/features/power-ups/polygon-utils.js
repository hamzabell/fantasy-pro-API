// This file contains utility functions for interacting with Polygon blockchain
// for power-ups (NFTs) functionality
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
    MARKETPLACE: '0x0987654321098765432109876543210987654321'
};
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
