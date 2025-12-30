// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LeaguePayout {
    address public owner;
    
    event Payout(string leagueId, address indexed winner, uint256 amount);
    event Deposit(address indexed sender, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Function to receive POL (Matic)
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Payout function called by the backend
    // winners: Array of winner addresses
    // amounts: Array of amounts in wei
    // leagueId: ID of the league for event logging
    function payoutWinners(string calldata leagueId, address[] calldata winners, uint256[] calldata amounts) external {
        require(msg.sender == owner, "Only owner can payout");
        require(winners.length == amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < winners.length; i++) {
            require(address(this).balance >= amounts[i], "Insufficient contract balance");
            (bool success, ) = winners[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
            emit Payout(leagueId, winners[i], amounts[i]);
        }
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdraw failed");
    }
}
