# Blockchain Voting Application

This project uses React and Ethers.js to interact with the Sepolia Blockchain and Hardhat to test and deploy smart contracts made in Solidity. The project makes a decentralized voting application.

## How to run

### Locally host smart contract

#### Client

- Run `cd Client` in terminal.
- Run `npm i`
- Run `npm run dev`

#### Hardhat

- Run `cd Hardhat` in a new terminal.
- Run `npm i`
- Run `npx hardhat compile` to compile the smart contracts.
- Run `npx hardhat node` to create a local network.
- Run `npx hardhat ignition deploy ./ignition/modules/BlockchainVotingSystem.ts --network localhost` in a new terminal.
- Copy the deployment address to `deployAddress` inside `Client/assets/deployedAddress.json` to update the deployment address.
- Import any of the generated wallets in `npx hardhat node` into metamask.

### Use deployed smart contract on testnet

- Run `cd Client`
- Run `npm i`
- Run `npm run dev`
- Make sure you have a Sepolia testnet wallet in your metamask.
- Navigate to `http://localhost:5173

## Routes

- `/`: Voter Registration
- `/castVote`: Vote Casting
- `/admin`: View candidate details and total votes
