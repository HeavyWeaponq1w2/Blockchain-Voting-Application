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

    struct Candidate {
        string name;
        string party;
        string area;
        int totalVotes;
    }

    // Mapping to store voters by their voter ID
    mapping(uint => Voter) private voters;

    // Mapping to track which voters have already voted
    mapping(uint => bool) private hasVoted;

    // Array to store candidate information
    Candidate[5] public candidates;

    // Events
    event VoterRegistered(uint voterId, string name, uint aadhar);
    event VoteCast(uint voterId, uint partyIndex, int newVoteCount);

    // Modifiers
    modifier onlyNewVoter(uint _voterId) {
        require(!voters[_voterId].isRegistered, "Voter is already registered.");
        _;
    }

    constructor() {
        candidates[0] = Candidate("M", "Party 1", "Khaderbagh", 0);
        candidates[1] = Candidate("S", "Party 2", "Nanal Nagar", 0);
        candidates[2] = Candidate("A", "Party 3", "Tolichowki", 0);
        candidates[3] = Candidate("B", "Party 4", "Gachibowli", 0);
        candidates[4] = Candidate("C", "Party 5", "Madhapur", 0);
    }

    // Function to register a voter
    function registerVoter(
        uint _voterId,
        string memory _name,
        uint _aadhar
    ) public onlyNewVoter(_voterId) {
        voters[_voterId] = Voter({
            voterId: _voterId,
            name: _name,
            aadhar: _aadhar,
            isRegistered: true
        });
        emit VoterRegistered(_voterId, _name, _aadhar);
    }

    // Function to get voter details by voter ID
    function getVoterDetails(uint _voterId)
        public
        view
        returns (
            uint,
            string memory,
            uint
        )
    {
        require(voters[_voterId].isRegistered, "Voter is not registered.");
        Voter memory voter = voters[_voterId];
        return (voter.voterId, voter.name, voter.aadhar);
    }

    // Function to cast a vote for a party
    function castVote(uint _voterId, uint _partyIndex) public {
        require(voters[_voterId].isRegistered, "Error: Voter is not registered.");
        require(!hasVoted[_voterId], "Error: Voter has already voted.");
        require(
            _partyIndex > 0 && _partyIndex <= candidates.length,
            "Error: Invalid party index."
        );

        hasVoted[_voterId] = true;
        candidates[_partyIndex].totalVotes++;
        emit VoteCast(_voterId, _partyIndex, candidates[_partyIndex].totalVotes);
    }
}