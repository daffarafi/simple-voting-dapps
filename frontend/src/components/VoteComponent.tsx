'use client';

import { useState, useEffect } from 'react';
import { initNear } from '@/lib/near';
import { getUserNFTs } from '@/lib/mintbase';

export default function VoteComponent() {
  const [wallet, setWallet] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [ownsNFT, setOwnsNFT] = useState<boolean>(false);
  const [voted, setVoted] = useState<boolean>(false);
  const [results, setResults] = useState<{ name: string; votes: number }[]>([]);

  useEffect(() => {
    async function setup() {
      const { wallet, contract } = await initNear();
      setWallet(wallet);
      setContract(contract);
      if (wallet.isSignedIn()) {
        const accountId = wallet.getAccountId();
        setAccountId(accountId);
        checkNFTOwnership(accountId);
      }
      fetchResults(contract);
    }
    setup();
  }, []);

  const checkNFTOwnership = async (accountId: string) => {
    const nfts = await getUserNFTs(accountId);
    setOwnsNFT(nfts.length > 0);
  };

  const fetchResults = async (contract: any) => {
    const results = await contract.get_results();
    setResults(results);
  };

  const handleVote = async (candidate: string) => {
    if (!contract || !ownsNFT || voted) return;
    await contract.vote({ candidate });
    setVoted(true);
    fetchResults(contract);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Vote for Your Favorite Scientist
      </h1>

      {accountId ? (
        ownsNFT ? (
          <>
            {['Alan Turing', 'Albert Einstein'].map((candidate) => (
              <button
                key={candidate}
                onClick={() => handleVote(candidate)}
                className="m-2 p-2 bg-blue-600 text-white rounded"
                disabled={voted}
              >
                Vote for {candidate}
              </button>
            ))}
          </>
        ) : (
          <p className="text-red-500">You must own an NFT to vote.</p>
        )
      ) : (
        <button
          onClick={() => wallet.requestSignIn()}
          className="bg-green-500 p-2 text-white rounded"
        >
          Login with NEAR
        </button>
      )}

      <h2 className="text-xl font-bold mt-4">Live Results</h2>
      {results.map((r, index) => (
        <p key={index}>
          {r[0]}: {r[1]} votes
        </p>
      ))}
    </div>
  );
}
