// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LeaguePayout {
    address public owner;
    bool private locked;

    // Track balance per league
    mapping(string => uint256) public leagueBalances;
    // Track if a user has staked in a league
    mapping(string => mapping(address => bool)) public hasStaked;
    // Track if league creation fee was paid
    mapping(string => bool) public leagueFeePaid;
    
    event Payout(string leagueId, address indexed winner, uint256 amount);
    event PayoutCompleted(string leagueId, uint256 totalPayout, uint256 commission);
    event Stake(address indexed user, uint256 amount, string userId, string leagueId);
    event LeagueCreated(string leagueId, string userId, uint256 commissionPercentage, address indexed creator, uint256 feePaid);
    event Deposit(address indexed sender, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    // Function to receive POL (Matic) directly if needed
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Create League Function
    // Allows creator to pay a fee (msg.value) to potentially bypass commission later
    // Marks creator as 'staked' so they can receive payouts/commissions
    function createLeague(string calldata leagueId, string calldata userId, uint256 commissionPercentage) external payable {
        // Transfer fee to owner if > 0
        if (msg.value > 0) {
            (bool success, ) = owner.call{value: msg.value}("");
            require(success, "Fee transfer failed");
            leagueFeePaid[leagueId] = true;
        }

        // Mark creator as staker
        hasStaked[leagueId][msg.sender] = true;

        emit LeagueCreated(leagueId, userId, commissionPercentage, msg.sender, msg.value);
    }

    // Stake function
    // Users send POL with leagueId and userId metadata
    function stake(string calldata leagueId, string calldata userId) external payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        
        leagueBalances[leagueId] += msg.value;
        hasStaked[leagueId][msg.sender] = true;
        
        emit Stake(msg.sender, msg.value, userId, leagueId);
    }

    // Payout function called by the backend
    function payoutWinners(
        string calldata leagueId, 
        address[] calldata winners, 
        uint256[] calldata winningPercentages, 
        uint256 commissionPercentage
    ) external noReentrant {
        require(msg.sender == owner, "Only owner can payout");
        require(winners.length == winningPercentages.length, "Arrays length mismatch");
        require(leagueBalances[leagueId] > 0, "No funds in league");
        require(commissionPercentage <= 10000, "Invalid commission percentage");

        // Enforce: If fee was paid, platform cannot take commission
        if (leagueFeePaid[leagueId]) {
            require(commissionPercentage == 0, "Fee paid, no commission allowed");
        }

        uint256 totalStaked = leagueBalances[leagueId];
        
        // Calculate commission
        uint256 commissionAmount = (totalStaked * commissionPercentage) / 10000;
        uint256 distributableAmount = totalStaked - commissionAmount;

        // Reset league balance before transfer (Checks-Effects-Interactions)
        leagueBalances[leagueId] = 0;

        // Transfer commission to owner
        if (commissionAmount > 0) {
            (bool success, ) = owner.call{value: commissionAmount}("");
            require(success, "Commission transfer failed");
        }

        uint256 totalPayout = 0;

        for (uint256 i = 0; i < winners.length; i++) {
            require(hasStaked[leagueId][winners[i]], "Winner did not stake");
            
            uint256 amount = (distributableAmount * winningPercentages[i]) / 10000;
            if (amount > 0) {
                (bool success, ) = winners[i].call{value: amount}("");
                require(success, "Transfer failed");
                totalPayout += amount;
                emit Payout(leagueId, winners[i], amount);
            }
        }

        emit PayoutCompleted(leagueId, totalPayout, commissionAmount);
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdraw failed");
    }
}
