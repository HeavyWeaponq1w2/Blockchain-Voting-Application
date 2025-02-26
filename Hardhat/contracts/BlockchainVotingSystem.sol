//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Struct to store voter information
    struct Voter {
        uint voterId;
        string name;
        uint aadhar;
        bool isRegistered;
    }

    // Mapping to store voters by their voter ID
    mapping(uint => Voter) private voters;

    // Party names (using an array for flexibility)
    string[] public partyNames = ["Party 1", "Party 2", "Party 3", "Party 4", "Party 5"];

    // Mapping to store vote counts for each party
    mapping(uint => uint) private partyVotes;

    // Mapping to track which voters have already voted
    mapping(uint => bool) public hasVoted;

    // Events
    event VoterRegistered(uint voterId, string name, uint aadhar);
    event VoteCast(uint voterId, uint partyIndex, uint newVoteCount);

    // Modifiers
    modifier onlyNewVoter(uint _voterId) {
        require(!voters[_voterId].isRegistered, "Voter is already registered.");
        _;
    }

    // Function to register a voter
    function registerVoter(uint _voterId, string memory _name, uint _aadhar) public onlyNewVoter(_voterId)
    {
        voters[_voterId] = Voter({
            voterId: _voterId,
            name: _name,
            aadhar: _aadhar,
            isRegistered: true
        });
        emit VoterRegistered(_voterId, _name, _aadhar);
    }

    // Function to get voter details by voter ID
    function getVoterDetails(uint _voterId) public view returns (uint,string memory,uint,bool)
    {
        require(voters[_voterId].isRegistered, "Voter is not registered.");
        Voter memory voter = voters[_voterId];
        return (voter.voterId, voter.name, voter.aadhar, voter.isRegistered);
    }

    // Function to cast a vote for a party
    function castVote(uint _voterId, uint _partyIndex) public {
        require(voters[_voterId].isRegistered, "Error: Voter is not registered.");
        require(!hasVoted[_voterId], "Error: Voter has already voted.");
        require(
            _partyIndex > 0 && _partyIndex <= partyNames.length,
            "Error: Invalid party index."
        );

        hasVoted[_voterId] = true;
        partyVotes[_partyIndex]++;
        emit VoteCast(_voterId, _partyIndex, partyVotes[_partyIndex]);
    }

    // Function to get the vote count for a party by index
    function getPartyVoteCount(uint _partyIndex) public view returns (uint) {
        require(
            _partyIndex > 0 && _partyIndex <= partyNames.length,
            "Error: Invalid party index."
        );
        return partyVotes[_partyIndex];
    }

    // Functions to get the vote count for specific parties
    function getParty1Votes() public view returns (uint) {
        return partyVotes[1];
    }

    function getParty2Votes() public view returns (uint) {
        return partyVotes[2];
    }

    function getParty3Votes() public view returns (uint) {
        return partyVotes[3];
    }

    function getParty4Votes() public view returns (uint) {
        return partyVotes[4];
    }

    function getParty5Votes() public view returns (uint) {
        return partyVotes[5];
    }
}