const contractPerNetwork = {
  mainnet:
    (process.env.NEXT_PUBLIC_CONTRACT_ID ?? 'example-simple-voting-dapps') +
    '.near',
  testnet:
    (process.env.NEXT_PUBLIC_CONTRACT_ID ?? 'example-simple-voting-dapps') +
    '.testnet',
};
// Chains for EVM Wallets
const evmWalletChains = {
  mainnet: {
    chainId: 397,
    name: 'Near Mainnet',
    explorer: 'https://eth-explorer.near.org',
    rpc: 'https://eth-rpc.mainnet.near.org',
  },
  testnet: {
    chainId: 398,
    name: 'Near Testnet',
    explorer: 'https://eth-explorer-testnet.near.org',
    rpc: 'https://eth-rpc.testnet.near.org',
  },
};

export const NetworkId =
  process.env.NEXT_PUBLIC_NETWORK_ID === 'mainnet' ? 'mainnet' : 'testnet';
export const HelloNearContract = contractPerNetwork[NetworkId];
export const EVMWalletChain = evmWalletChains[NetworkId];
