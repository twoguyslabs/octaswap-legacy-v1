# OctaSwap Staking Platform

A decentralized staking platform for OCS tokens built on the Octa blockchain. This platform allows users to stake their OCS tokens and earn rewards based on different tiers and lock durations.

## Overview

OctaSwap Staking is a web3 application that enables users to:

- Stake OCS tokens in different tiers
- Earn rewards based on staking duration and amount
- View staking statistics and performance
- Withdraw staked tokens and rewards

The platform is built with a modern tech stack including Next.js, TypeScript, Tailwind CSS, and integrates with blockchain using wagmi, viem, and RainbowKit.

## Project Structure

The project consists of two main parts:

- **Frontend**: A Next.js application with React components for the user interface
- **Backend**: Smart contracts deployed on the Octa blockchain

### Key Features

- Multiple staking tiers with different reward rates
- Flexible lock durations for staking
- Real-time staking statistics and rewards tracking
- User-friendly interface with responsive design
- Secure wallet connection using RainbowKit

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn package manager
- A web3 wallet (MetaMask, etc.)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/octaswap-staking.git
   cd octaswap-staking
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the frontend directory with the necessary configuration.

### Development

Run the development server:

```bash
yarn dev
```

This will start:

- The frontend on [http://localhost:3000](http://localhost:3000)
- An Anvil instance for local blockchain development

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Navigate to the Staking page
3. Choose a staking tier and lock duration
4. Enter the amount of OCS tokens to stake
5. Confirm the transaction in your wallet
6. Monitor your staking positions and rewards in the Overview tab

## Smart Contracts

The staking functionality is powered by the following smart contracts:

- `OCSStaking`: Manages staking tiers, deposits, rewards, and withdrawals

## Technologies Used

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- RainbowKit & wagmi for wallet connection
- viem for blockchain interactions
- Radix UI components

### Backend

- Solidity smart contracts
- Anvil for local development

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
