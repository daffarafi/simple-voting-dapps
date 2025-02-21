import { connect, keyStores, WalletConnection, Contract } from 'near-api-js';

const nearConfig = {
  networkId: 'testnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  contractName: 'dev-1700000000000-123456789abcdef', // Ganti dengan Contract ID
};

export async function initNear() {
  const near = await connect(nearConfig);
  const wallet = new WalletConnection(near);
  const contract = new Contract(wallet.account(), nearConfig.contractName!, {
    viewMethods: ['get_results'],
    changeMethods: ['vote'],
  });

  return { wallet, contract };
}
