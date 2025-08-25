import { describe, it, expect } from 'vitest';
import {
	maticToWei,
	weiToMatic,
	isValidPolygonAddress,
	getPolygonScanUrl,
	getPolygonAddressUrl,
	getPolygonTokenUrl,
	formatTransactionDate,
	POLYGON_CONTRACT_ADDRESSES,
	POLYGON_NETWORK_CONFIG,
	POLYGON_MUMBAI_CONFIG
} from './polygon-utils.js';

describe('Polygon Utilities', () => {
	describe('maticToWei', () => {
		it('should convert MATIC to wei correctly', () => {
			expect(maticToWei('1')).toBe('1000000000000000000');
			expect(maticToWei('0.5')).toBe('500000000000000000');
			expect(maticToWei('10')).toBe('10000000000000000000');
		});
	});

	describe('weiToMatic', () => {
		it('should convert wei to MATIC correctly', () => {
			expect(weiToMatic('1000000000000000000')).toBe('1');
			expect(weiToMatic('500000000000000000')).toBe('0');
			expect(weiToMatic('10000000000000000000')).toBe('10');
		});
	});

	describe('isValidPolygonAddress', () => {
		it('should validate correct Polygon addresses', () => {
			expect(isValidPolygonAddress('0x1234567890123456789012345678901234567890')).toBe(true);
			expect(isValidPolygonAddress('0xabcdef123456789012345678901234567890abcd')).toBe(true);
		});

		it('should reject invalid Polygon addresses', () => {
			expect(isValidPolygonAddress('0x123')).toBe(false); // Too short
			expect(isValidPolygonAddress('1234567890123456789012345678901234567890')).toBe(false); // Missing 0x
			expect(isValidPolygonAddress('0x12345678901234567890123456789012345678901')).toBe(false); // Too long
			expect(isValidPolygonAddress('0xghijklmnopqrstuvwxyz12345678901234567890')).toBe(false); // Invalid hex
		});
	});

	describe('getPolygonScanUrl', () => {
		it('should generate correct PolygonScan URLs for transactions', () => {
			const txHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
			expect(getPolygonScanUrl(txHash)).toBe(`https://polygonscan.com/tx/${txHash}`);
			expect(getPolygonScanUrl(txHash, 'mumbai')).toBe(`https://mumbai.polygonscan.com/tx/${txHash}`);
		});
	});

	describe('getPolygonAddressUrl', () => {
		it('should generate correct PolygonScan URLs for addresses', () => {
			const address = '0x1234567890123456789012345678901234567890';
			expect(getPolygonAddressUrl(address)).toBe(`https://polygonscan.com/address/${address}`);
			expect(getPolygonAddressUrl(address, 'mumbai')).toBe(`https://mumbai.polygonscan.com/address/${address}`);
		});
	});

	describe('getPolygonTokenUrl', () => {
		it('should generate correct PolygonScan URLs for tokens', () => {
			const tokenAddress = '0x1234567890123456789012345678901234567890';
			const tokenId = '1';
			
			expect(getPolygonTokenUrl(tokenAddress)).toBe(`https://polygonscan.com/token/${tokenAddress}`);
			expect(getPolygonTokenUrl(tokenAddress, tokenId)).toBe(`https://polygonscan.com/token/${tokenAddress}?a=${tokenId}`);
			
			expect(getPolygonTokenUrl(tokenAddress, undefined, 'mumbai')).toBe(`https://mumbai.polygonscan.com/token/${tokenAddress}`);
			expect(getPolygonTokenUrl(tokenAddress, tokenId, 'mumbai')).toBe(`https://mumbai.polygonscan.com/token/${tokenAddress}?a=${tokenId}`);
		});
	});

	describe('formatTransactionDate', () => {
		it('should format dates correctly', () => {
			const date = new Date('2023-01-01T12:00:00Z');
			const formatted = formatTransactionDate(date);
			// Format may vary based on locale, but should contain these elements
			expect(formatted).toContain('2023');
			expect(formatted).toContain('Jan');
			expect(formatted).toContain('1');
		});
	});

	describe('Contract Addresses', () => {
		it('should have correct contract addresses', () => {
			expect(POLYGON_CONTRACT_ADDRESSES.POWER_UPS_NFT).toBe('0x1234567890123456789012345678901234567890');
			expect(POLYGON_CONTRACT_ADDRESSES.MARKETPLACE).toBe('0x0987654321098765432109876543210987654321');
		});
	});

	describe('Network Configurations', () => {
		it('should have correct Polygon mainnet configuration', () => {
			expect(POLYGON_NETWORK_CONFIG.chainId).toBe(137);
			expect(POLYGON_NETWORK_CONFIG.chainName).toBe('Polygon Mainnet');
			expect(POLYGON_NETWORK_CONFIG.currency).toBe('MATIC');
		});

		it('should have correct Polygon Mumbai configuration', () => {
			expect(POLYGON_MUMBAI_CONFIG.chainId).toBe(80001);
			expect(POLYGON_MUMBAI_CONFIG.chainName).toBe('Polygon Mumbai');
			expect(POLYGON_MUMBAI_CONFIG.currency).toBe('MATIC');
		});
	});
});
