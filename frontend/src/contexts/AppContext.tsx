'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletSelector } from '@near-wallet-selector/core';
import { WalletSelectorProvider } from '@near-wallet-selector/react-hook';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupMeteorWalletApp } from '@near-wallet-selector/meteor-wallet-app';
import { setupBitteWallet } from '@near-wallet-selector/bitte-wallet';
import { setupHotWallet } from '@near-wallet-selector/hot-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupSender } from '@near-wallet-selector/sender';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupNearMobileWallet } from '@near-wallet-selector/near-mobile-wallet';
import { setupWelldoneWallet } from '@near-wallet-selector/welldone-wallet';
import { HelloNearContract, NetworkId } from '@/config';

interface AppContextType {
  walletSelector: WalletSelector | null;
  setWalletSelector: (wallet: WalletSelector | null) => void;
  network: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletSelector, setWalletSelector] = useState<WalletSelector | null>(
    null,
  );
  const network = NetworkId;

  const walletSelectorConfig = {
    network: NetworkId,
    modules: [
      setupBitteWallet(),
      setupMeteorWallet(),
      setupMeteorWalletApp({ contractId: HelloNearContract }),
      setupHotWallet(),
      setupLedger(),
      setupSender(),
      setupHereWallet(),
      setupNearMobileWallet(),
      setupWelldoneWallet(),
      setupMyNearWallet(),
    ],
  };

  return (
    <AppContext.Provider value={{ walletSelector, setWalletSelector, network }}>
      <WalletSelectorProvider config={walletSelectorConfig}>
        {children}
      </WalletSelectorProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
