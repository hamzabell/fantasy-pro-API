var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach } from 'vitest';
import { savePowerUpToDatabase, retrieveAllPowerUpsFromDatabase, retrieveFeaturedPowerUpsFromDatabase, retrieveUserPowerUpsByUserId, updatePowerUpInDatabaseById, deleteAllPowerUpsFromDatabase } from './power-ups-model';
import prisma from '../../prisma';
describe('Power-Ups Model', () => {
    // Clear the database before each test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Delete in the correct order to respect foreign key constraints
        try {
            yield prisma.fantasyLeagueMembershipPowerUp.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
        try {
            yield prisma.userPowerUp.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
        try {
            yield prisma.powerUp.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
        try {
            yield prisma.fantasyLeagueMembership.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
        try {
            yield prisma.fantasyLeague.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
        try {
            yield prisma.team.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
        try {
            yield prisma.user.deleteMany();
        }
        catch (e) {
            // Ignore if table doesn't exist yet
        }
    }));
    describe('savePowerUpToDatabase', () => {
        it('should create a new power-up in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            const powerUpData = {
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            };
            const powerUp = yield savePowerUpToDatabase(powerUpData);
            expect(powerUp).toBeDefined();
            expect(powerUp.name).toBe(powerUpData.name);
            expect(powerUp.description).toBe(powerUpData.description);
            expect(powerUp.price).toBe(powerUpData.price);
            expect(powerUp.tokenId).toBe(powerUpData.tokenId);
            expect(powerUp.contractAddress).toBe(powerUpData.contractAddress);
            expect(powerUp.metadataUri).toBe(powerUpData.metadataUri);
            expect(powerUp.imageUrl).toBe(powerUpData.imageUrl);
            expect(powerUp.isActive).toBe(powerUpData.isActive);
            expect(powerUp.isFeatured).toBe(powerUpData.isFeatured);
        }));
    });
    describe('retrieveAllPowerUpsFromDatabase', () => {
        it('should retrieve all active power-ups from the database', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create test power-ups
            yield savePowerUpToDatabase({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            yield savePowerUpToDatabase({
                name: 'Triple Captain',
                description: 'Triple points for your captain',
                price: '15',
                tokenId: '2',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/2',
                imageUrl: 'https://example.com/images/2.png',
                isActive: true,
                isFeatured: false
            });
            const powerUps = yield retrieveAllPowerUpsFromDatabase();
            expect(powerUps).toHaveLength(2);
            // Find the specific power-ups by name since order may vary
            const doublePoints = powerUps.find(p => p.name === 'Double Points');
            const tripleCaptain = powerUps.find(p => p.name === 'Triple Captain');
            expect(doublePoints).toBeDefined();
            expect(tripleCaptain).toBeDefined();
        }));
    });
    describe('retrieveFeaturedPowerUpsFromDatabase', () => {
        it('should retrieve all featured power-ups from the database', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create test power-ups
            yield savePowerUpToDatabase({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            yield savePowerUpToDatabase({
                name: 'Triple Captain',
                description: 'Triple points for your captain',
                price: '15',
                tokenId: '2',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/2',
                imageUrl: 'https://example.com/images/2.png',
                isActive: true,
                isFeatured: false
            });
            const powerUps = yield retrieveFeaturedPowerUpsFromDatabase();
            expect(powerUps).toHaveLength(1);
            expect(powerUps[0].name).toBe('Double Points');
            expect(powerUps[0].isFeatured).toBe(true);
        }));
    });
    describe('updatePowerUpInDatabaseById', () => {
        it('should update a power-up in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a power-up
            const powerUp = yield savePowerUpToDatabase({
                name: 'Double Points',
                description: 'Double your points for one gameweek',
                price: '10',
                tokenId: '1',
                contractAddress: '0x1234567890123456789012345678901234567890',
                metadataUri: 'https://example.com/metadata/1',
                imageUrl: 'https://example.com/images/1.png',
                isActive: true,
                isFeatured: true
            });
            // Update the power-up
            const updatedPowerUp = yield updatePowerUpInDatabaseById({
                id: powerUp.id,
                powerUp: {
                    name: 'Double Points Plus',
                    price: '12'
                }
            });
            expect(updatedPowerUp.name).toBe('Double Points Plus');
            expect(updatedPowerUp.price).toBe('12');
            // Other fields should remain unchanged
            expect(updatedPowerUp.description).toBe('Double your points for one gameweek');
        }));
    });
});
