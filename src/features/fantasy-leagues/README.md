# Fantasy Leagues API

This API provides endpoints for managing fantasy leagues in the FantasyPro application.

## Endpoints

### Create Fantasy League

- **URL**: `/api/fantasy-leagues/`
- **Method**: `POST`
- **Authentication**: Required (Bearer token)
- **Description**: Creates a new fantasy league
- **Request Body**:
  ```json
  {
    "name": "string",
    "stake": "string",
    "limit": "number",
    "leagueType": "string",
    "leagueMode": "string",
    "winners": "number",
    "code": "string (optional)",
    "gameweekId": "number (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Fantasy league created successfully",
    "league": {
      "id": "string",
      "name": "string",
      "stake": "string",
      "limit": "number",
      "leagueType": "string",
      "leagueMode": "string",
      "winners": "number",
      "allowPowerUps": "boolean",
      "description": "string",
      "code": "string",
      "ownerId": "string",
      "gameweekId": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Get All Fantasy Leagues

- **URL**: `/api/fantasy-leagues/`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)
- **Description**: Retrieves all public fantasy leagues with additional details
- **Query Parameters**:
  - `stake`: Filter leagues by stake value
  - `isMember`: Filter leagues by membership status (true/false)
  - `sortBy`: Sort leagues by field (currently supports `createdAt`)
  - `sortOrder`: Sort order (asc/desc)
  - `search`: Search leagues by name
  - `leagueType`: Filter leagues by type (public/private)
- **Response**:
  ```json
  {
    "message": "Leagues Retrieved Successfully",
    "leagues": [
      {
        "id": "string",
        "name": "string",
        "stake": "string",
        "limit": "number",
        "leagueType": "string",
        "leagueMode": "string",
        "winners": "number",
        "description": "string",
        "code": "string",
        "ownerId": "string",
        "gameweekId": "number",
        "createdAt": "string",
        "updatedAt": "string",
        "owner": {
          "id": "string",
          "email": "string"
        },
        "teamsCount": "number",
        "potentialWinnings": "number",
        "prizeDistribution": [
          {
            "position": "number",
            "percentage": "number"
          }
        ]
      }
    ]
  }
  ```

### Get Fantasy League by ID

- **URL**: `/api/fantasy-leagues/:id`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)
- **Description**: Retrieves details of a specific fantasy league
- **Response**:
  ```json
  {
    "message": "League Retrieved Successfully",
    "league": {
      "id": "string",
      "name": "string",
      "stake": "string",
      "limit": "number",
      "leagueType": "string",
      "leagueMode": "string",
      "winners": "number",
      "allowPowerUps": "boolean",
      "description": "string",
      "code": "string",
      "ownerId": "string",
      "gameweekId": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Join Fantasy League

- **URL**: `/api/fantasy-leagues/join`
- **Method**: `POST`
- **Authentication**: Required (Bearer token)
- **Description**: Allows a user to join a fantasy league using its code
- **Request Body**:
  ```json
  {
    "code": "string",
    "teamName": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Successfully joined league",
    "membership": {
      "id": "string",
      "userId": "string",
      "leagueId": "string",
      "teamName": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Get League Table

- **URL**: `/api/fantasy-leagues/:id/table`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)
- **Description**: Retrieves the league table sorted by points in descending order
- **Response**:
  ```json
  {
    "message": "League table retrieved successfully",
    "table": [
      {
        "userId": "string",
        "userName": "string",
        "teamName": "string",
        "points": "number"
      }
    ]
  }
  ```

### Get League History

- **URL**: `/api/fantasy-leagues/history`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)
- **Description**: Retrieves the authenticated user's league history
- **Query Parameters**:
  - `leagueId`: Filter by specific league ID
  - `status`: Filter by league status (ongoing/closed/upcoming)
  - `sortBy`: Sort by field (currently supports `createdAt`)
  - `sortOrder`: Sort order (asc/desc)
  - `search`: Search by league name
- **Response**:
  ```json
  {
    "message": "League history retrieved successfully",
    "history": [
      {
        "leagueId": "string",
        "leagueName": "string",
        "teamName": "string",
        "position": "number or null",
        "status": "ongoing|closed|upcoming",
        "createdAt": "string"
      }
    ]
  }
  ```

### Get League Position

- **URL**: `/api/fantasy-leagues/:id/position`
- **Method**: `GET`
- **Authentication**: Required (Bearer token)
- **Description**: Retrieves the authenticated user's position in a specific league
- **Response**:
  ```json
  {
    "message": "League position retrieved successfully",
    "position": "number or null",
    "teamName": "string"
  }
  ```

## Prize Distribution

The API automatically calculates prize distribution for leagues based on the number of winners:

- For 1 winner: 100% to the winner
- For 2 winners: 60% to 1st place, 40% to 2nd place
- For 3 or more winners: Distributed using a diminishing returns approach where earlier positions receive larger percentages

## Team Names

When joining a league, users must provide a team name. This team name is stored in the league membership and is used in various places throughout the application, including:
- League tables
- League history
- League position tracking

This allows users to have personalized team names within each league they join.