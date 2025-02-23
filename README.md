
# 🗳️ Simple Voting DApp

A decentralized voting application built on [**NEAR Protocol**](https://docs.near.org/) using **Rust** smart contracts and a modern **Next.js frontend**. This DApp allows users to create elections, add candidates, and vote in a **secure, transparent, and immutable** way.

---

## 🚀 Features

- ✅ **Create Voting Sessions** – Users can create new voting sessions with multiple candidates.
- ✅ **Vote for Candidates** – Users can vote for their preferred candidate (only once per session).
- ✅ **Blockchain Security** – Votes are recorded on-chain, ensuring immutability.
- ✅ **User-Friendly Interface** – A responsive **Next.js frontend** built with **Tailwind CSS** & **shadcn/ui**.
- ✅ **Near Wallet Integration** – Users connect their NEAR Wallet to interact with the smart contract.

---

## 📁 Folder Structure

```bash
simple-voting-dapp/
│── frontend/       # Next.js frontend
│── contract/       # Rust-based NEAR smart contract
```

---

## 🏗️ Tech Stack

### **🖥 Frontend**
- **Next.js** (React Framework)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (UI Components)
- **NEAR Wallet Selector** (For blockchain interaction)

### **🛠 Smart Contract**
- **Rust** + NEAR SDK
- **NEAR Blockchain** (for on-chain voting)
- **NEAR CLI** (for contract deployment)

---

## 📦 Installation & Setup

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Rust & Cargo**: [Install Rust](https://www.rust-lang.org/tools/install)
- **Node.js & npm**: [Download here](https://nodejs.org/)
- **NEAR CLI**: `npm install -g near-cli-rs@latest` ([Read More](https://docs.near.org/tools/near-cli))
- **NEAR Testnet Account** (Optional): Only needed if you want to use your own testnet account.  
  - Create one [here](https://wallet.testnet.near.org/)  
  - Otherwise, you can use the provided testnet account.
- **Reown Cloud Project ID** (Optional): Required only if you want to use your own wallet setup.  
  - Create an account on [Reown Cloud](https://cloud.reown.com)  
  - Generate a new **Project ID** from the dashboard  
  - Otherwise, you can use the provided **Project ID**.

---

## 🚀 Backend (Smart Contract)

> ⚡ **You can skip contract deployment!** If you just want to run the frontend and interact with the existing contract, you don't need to deploy your own contract.  
>  
> 👉 **Simply run the frontend and use the pre-deployed contract on NEAR Testnet!**  
> 
### **1️⃣ Build the Contract**
```sh
cd contract
cargo near build
```

### **2️⃣ Deploy to NEAR Testnet**
```sh
near contract deploy <created-account> use-file ./target/near/contract.wasm without-init-call network-config testnet sign-with-legacy-keychain send
```

### **3️⃣ Call the Smart Contract**
#### ✅ Create a Voting Session
```sh
near call <contract-account> create_voting_session '{"title": "Election 2025", "description": "Choose the best leader", "expires_at": 1735689600000, "candidates": [["Alice", "Fair leader"], ["Bob", "Innovative thinker"]]}' --accountId <your-account>
```

#### ✅ Vote for a Candidate
```sh
near call <contract-account> vote '{"candidate_id": 1}' --accountId <your-account>
```

#### ✅ Get All Voting Sessions
```sh
near view <contract-account> get_all_sessions
```

---

## 🌐 Frontend (Next.js)

### **1️⃣ Install Dependencies**
```sh
cd frontend
npm install
```
> ⚡ Or use your favorite package manager (e.g., `yarn`, `pnpm`, `bun`, etc...).

### **2️⃣ Start Development Server**
```sh
npm run dev
```
Then, open **http://localhost:3000/** in your browser.

### **3️⃣ Configure Environment Variables (Optional)**
> ⚡ **You can skip the environment configuration!**  
> If you are not deploying your own contract or setting up your own NEAR testnet and wallet, you can **skip this step** and use the pre-configured contract and wallet setup.  

Create a **.env** file inside the `frontend/` folder and add:
```
NEXT_PUBLIC_CONTRACT_ID=<your-deployed-contract>
NEXT_PUBLIC_WALLET_PROJECT_ID=<your-wallet-project-id>
NEXT_PUBLIC_NETWORK_ID=testnet
```

---


🚀 **Happy Voting on Blockchain!** 🏛️

