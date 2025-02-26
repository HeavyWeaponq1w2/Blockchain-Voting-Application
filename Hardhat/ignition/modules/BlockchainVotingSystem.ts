import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const votingModule = buildModule("VotingModule", (m) => {
  const votingSystem = m.contract("VotingSystem");

  return { votingSystem };
});

export default votingModule;