import { ethers } from "ethers";
import DeploymentAddress from "../assets/deployedAddress.json";
import Artifact from "../assets/VotingSystem.json";

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("Metamask not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    DeploymentAddress.deployAddress,
    Artifact.abi,
    signer
  );

  return contract;
}
