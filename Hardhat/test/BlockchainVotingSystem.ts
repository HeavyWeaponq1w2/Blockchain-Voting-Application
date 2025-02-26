import { ethers } from "hardhat";
import { expect } from "chai";
import { VotingSystem } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BigNumberish } from "ethers";

describe("VotingSystem", function () {
  let votingSystem: VotingSystem;
  let owner: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;
  let otherAccount: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, voter1, voter2, otherAccount] = await ethers.getSigners();

    const VotingSystemFactory = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystemFactory.deploy();
    await votingSystem.waitForDeployment();
  });

  describe("Voter Registration", function () {
    it("Should register a new voter", async function () {
      const voterId = 123;
      const name = "Alice";
      const aadhar = 456;

      await votingSystem.registerVoter(voterId, name, aadhar);

      const voterDetails = await votingSystem.getVoterDetails(voterId);

      expect(voterDetails[0]).to.equal(voterId);
      expect(voterDetails[1]).to.equal(name);
      expect(voterDetails[2]).to.equal(aadhar);
      expect(voterDetails[3]).to.equal(true);

      const voter = await votingSystem.getVoterDetails(voterId);
      expect(voter[0]).to.equal(voterId);
      expect(voter[1]).to.equal(name);
      expect(voter[2]).to.equal(aadhar);
      expect(voter[3]).to.equal(true);
    });

    it("Should emit VoterRegistered event", async function () {
      const voterId = 123;
      const name = "Alice";
      const aadhar = 456;

      await expect(votingSystem.registerVoter(voterId, name, aadhar))
        .to.emit(votingSystem, "VoterRegistered")
        .withArgs(voterId, name, aadhar);
    });

    it("Should not register the same voter twice", async function () {
      const voterId = 123;
      const name = "Alice";
      const aadhar = 456;

      await votingSystem.registerVoter(voterId, name, aadhar);

      await expect(
        votingSystem.registerVoter(voterId, "Bob", 789)
      ).to.be.revertedWith("Voter is already registered.");
    });

    it("Should revert if trying to get details of unregistered voter", async () => {
      await expect(votingSystem.getVoterDetails(123)).to.be.revertedWith(
        "Voter is not registered."
      );
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Register some voters before each voting test
      await votingSystem.registerVoter(123, "Alice", 456);
      await votingSystem.registerVoter(456, "Bob", 789);
    });

    it("Should allow a registered voter to cast a vote", async function () {
      const voterId = 123;
      const partyIndex = 1;

      await votingSystem.castVote(voterId, partyIndex);

      // Correct way to access a mapping with a key in tests
      const hasVoted = await votingSystem.hasVoted(voterId);
      expect(hasVoted).to.equal(true);

      expect(await votingSystem.getPartyVoteCount(partyIndex)).to.equal(1);
    });

    it("Should emit VoteCast event", async function () {
      const voterId = 123;
      const partyIndex = 1;

      await expect(votingSystem.castVote(voterId, partyIndex))
        .to.emit(votingSystem, "VoteCast")
        .withArgs(voterId, partyIndex, 1);
    });

    it("Should not allow a voter to vote twice", async function () {
      const voterId = 123;
      const partyIndex = 1;

      await votingSystem.castVote(voterId, partyIndex);

      await expect(votingSystem.castVote(voterId, partyIndex)).to.be.revertedWith(
        "Error: Voter has already voted."
      );
    });

    it("Should not allow an unregistered voter to vote", async function () {
      const voterId = 789; // Not registered
      const partyIndex = 1;

      await expect(votingSystem.castVote(voterId, partyIndex)).to.be.revertedWith(
        "Error: Voter is not registered."
      );
    });

    it("Should not allow voting for an invalid party index", async function () {
      const voterId = 123;
      const invalidPartyIndex = 6; // Assuming only 5 parties

      await expect(
        votingSystem.castVote(voterId, invalidPartyIndex)
      ).to.be.revertedWith("Error: Invalid party index.");
    });
  });

  describe("Vote Counting", function () {
    beforeEach(async function () {
      // Register some voters and have them vote
      await votingSystem.registerVoter(123, "Alice", 456);
      await votingSystem.registerVoter(456, "Bob", 789);
      await votingSystem.registerVoter(789, "Charlie", 101);

      await votingSystem.castVote(123, 1); // Alice votes for Party 1
      await votingSystem.castVote(456, 2); // Bob votes for Party 2
      await votingSystem.castVote(789, 1); // Charlie votes for Party 1
    });

    it("Should return the correct vote count for each party", async function () {
      expect(await votingSystem.getPartyVoteCount(1)).to.equal(2);
      expect(await votingSystem.getPartyVoteCount(2)).to.equal(1);
      expect(await votingSystem.getPartyVoteCount(3)).to.equal(0);
    });

    it("Should return the correct vote count for specific parties", async () => {
      expect(await votingSystem.getParty1Votes()).to.equal(2);
      expect(await votingSystem.getParty2Votes()).to.equal(1);
      expect(await votingSystem.getParty3Votes()).to.equal(0);
      expect(await votingSystem.getParty4Votes()).to.equal(0);
      expect(await votingSystem.getParty5Votes()).to.equal(0);
    });
  });
});
