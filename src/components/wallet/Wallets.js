import { useMemo } from 'react';
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ClientWalletProvider as WalletProvider } from './WalletProvider'
import { PUBLISH_NETWIRK } from '../../config';

export const Wallets = ({ children }) => {
  const netstate = PUBLISH_NETWIRK
  let SOLANA_NETWORK;
  if (netstate === "devnet") {
    SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
  } else if (netstate === "mainnet") {
    SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
  }
  const network = SOLANA_NETWORK;
  // eslint-disable-next-line
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
