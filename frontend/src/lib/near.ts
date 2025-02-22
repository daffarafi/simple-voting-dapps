import {
  connect,
  keyStores,
  WalletConnection,
  Contract,
  Near,
} from 'near-api-js';

const CONTRACT_ID = 'your-contract.testnet'; // Change to your deployed contract ID
const NETWORK_ID = 'testnet';

export type VotingContract = {
  create_voting_session: () => Promise<number>;
  add_candidate: (args: {
    session_id: number;
    candidate: string;
  }) => Promise<void>;
  vote: (args: { session_id: number; candidate: string }) => Promise<void>;
  get_votes: (args: {
    session_id: number;
    candidate: string;
  }) => Promise<number>;
  get_voter_choice: (args: {
    session_id: number;
    account: string;
  }) => Promise<string | null>;
  get_candidates: (args: { session_id: number }) => Promise<string[]>;
};

export async function initNear(): Promise<{
  near: Near;
  wallet: WalletConnection;
}> {
  const config = {
    networkId: NETWORK_ID,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
  };

  const near = await connect(config);
  const wallet = new WalletConnection(near, 'e-voting-app');
  return { near, wallet };
}

export async function getContract(
  wallet: WalletConnection,
): Promise<VotingContract> {
  return new Contract(wallet.account(), CONTRACT_ID, {
    viewMethods: ['get_votes', 'get_voter_choice', 'get_candidates'],
    changeMethods: ['create_voting_session', 'add_candidate', 'vote'],
  }) as VotingContract;
}
