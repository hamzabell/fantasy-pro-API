# Power-Ups Feature Documentation

## Overview

The Power-Ups feature allows users to purchase NFT-based power-ups on the Polygon blockchain that can be used in fantasy leagues. These power-ups provide special abilities or advantages when participating in leagues.

## Features

1. **Power-Up Store**: Users can browse and purchase power-ups using MATIC tokens on Polygon
2. **Admin Management**: Admins can create and manage power-ups
3. **User Inventory**: Users can view their owned power-ups
4. **League Integration**: Power-ups can be used when joining leagues (if allowed by the league)
5. **Secondary Market**: Power-ups are NFTs that can be traded on secondary markets

## Database Schema

The feature introduces three new models:

1. **PowerUp**: Represents a power-up type available in the store
2. **UserPowerUp**: Tracks which power-ups a user owns
3. **FantasyLeagueMembershipPowerUp**: Tracks which power-ups are associated with a league membership

## API Endpoints

### Public Endpoints (User Authentication Required)

- `GET /api/power-ups` - Get all available power-ups
- `GET /api/power-ups/featured` - Get featured power-ups
- `GET /api/power-ups/my-power-ups` - Get power-ups owned by the current user
- `GET /api/power-ups/league/{leagueId}` - Get power-ups applied in a league by the current user

### Admin Endpoints

- `POST /api/power-ups` - Create a new power-up (Admin only)
- `PUT /api/power-ups/{id}` - Update a power-up (Admin only)

## Blockchain Integration

Power-ups are implemented as NFTs on the Polygon blockchain:

- **Network**: Polygon (Mainnet and Mumbai Testnet supported)
- **Token Standard**: ERC-721
- **Currency**: MATIC
- **Metadata**: Stored as URIs pointing to JSON metadata
- **Explorer**: Transactions and tokens can be viewed on PolygonScan

## Integration with Fantasy Leagues

When joining a league that allows power-ups, users can select which of their owned power-ups to use. These power-ups are then associated with their league membership and can provide advantages during league gameplay.

## Security Considerations

1. Only admins can create/update power-ups
2. Users can only use power-ups they own
3. Power-ups are "burnt" (marked as used) when used in a league
4. All blockchain interactions should be verified on-chain

## Future Enhancements

1. Integration with actual Polygon smart contracts
2. Marketplace for trading power-ups
3. Power-up activation during league gameplay
4. More sophisticated power-up types and effects