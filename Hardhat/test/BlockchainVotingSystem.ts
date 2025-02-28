import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingSystem } from "../typechain-types/VotingSystem";
import { Signer } from "ethers";

describe("VotingSystem", function () {
  let votingSystem: VotingSystem;
  let owner: Signer;
  let voter1: Signer;
  let voter2: Signer;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();

    const VotingSystemFactory = await ethers.getContractFactory("VotingSystem");
    votingSystem = (await VotingSystemFactory.deploy()) as VotingSystem;
    // await votingSystem.deployed();
  });

  it("Should register a voter", async function () {
    const voterId = 123;
    const name = "John Doe";
    const aadhar = 456789;

    await expect(votingSystem.registerVoter(voterId, name, aadhar))
      .to.emit(votingSystem, "VoterRegistered")
      .withArgs(voterId, name, aadhar);

    const voterDetails = await votingSystem.getVoterDetails(voterId);
    expect(voterDetails[0]).to.equal(voterId);
    expect(voterDetails[1]).to.equal(name);
    expect(voterDetails[2]).to.equal(aadhar);
  });

  it("Should not register the same voter twice", async function () {
    const voterId = 123;
    const name = "John Doe";
    const aadhar = 456789;

    await votingSystem.registerVoter(voterId, name, aadhar);

    await expect(
      votingSystem.registerVoter(voterId, "Jane Doe", 987654)
    ).to.be.revertedWith("Voter is already registered.");
  });

  it("Should get voter details", async function () {
    const voterId = 123;
    const name = "John Doe";
    const aadhar = 456789;

    await votingSystem.registerVoter(voterId, name, aadhar);

    const [retrievedVoterId, retrievedName, retrievedAadhar] =
      await votingSystem.getVoterDetails(voterId);

    expect(retrievedVoterId).to.equal(voterId);
    expect(retrievedName).to.equal(name);
    expect(retrievedAadhar).to.equal(aadhar);
  });

  it("Should not get voter details for unregistered voter", async function () {
    const voterId = 123;

    await expect(votingSystem.getVoterDetails(voterId)).to.be.revertedWith(
      "Voter is not registered."
    );
  });

  it("Should cast a vote", async function () {
    const voterId = 123;
    const name = "John Doe";
    const aadhar = 456789;
    const partyIndex = 1;

    await votingSystem.registerVoter(voterId, name, aadhar);

    await expect(votingSystem.castVote(voterId, partyIndex))
      .to.emit(votingSystem, "VoteCast")
      .withArgs(voterId, partyIndex, 1);

    // Check if the vote count has been updated
    const candidate = await votingSystem.candidates(partyIndex);
    expect(candidate.totalVotes).to.equal(1);
  });

  it("Should not allow unregistered voter to cast a vote", async function () {
    const voterId = 123;
    const partyIndex = 1;

    await expect(votingSystem.castVote(voterId, partyIndex)).to.be.revertedWith(
      "Error: Voter is not registered."
    );
  });

  it("Should not allow a voter to vote twice", async function () {
    const voterId = 123;
    const name = "John Doe";
    const aadhar = 456789;
    const partyIndex = 1;

    await votingSystem.registerVoter(voterId, name, aadhar);
    await votingSystem.castVote(voterId, partyIndex);

    await expect(votingSystem.castVote(voterId, partyIndex)).to.be.revertedWith(
      "Error: Voter has already voted."
    );
  });

  it("Should not allow voting for an invalid party index", async function () {
    const voterId = 123;
    const name = "John Doe";
    const aadhar = 456789;
    const partyIndex = 6; // Assuming only 5 parties exist

    await votingSystem.registerVoter(voterId, name, aadhar);

    await expect(votingSystem.castVote(voterId, partyIndex)).to.be.revertedWith(
      "Error: Invalid party index."
    );
  });
});
