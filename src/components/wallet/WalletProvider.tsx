import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import {
    getPhantomWallet,
    getLedgerWallet,
    getMathWallet,
    getSolflareWallet,
    getSolletWallet,
    getSolongWallet,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import("@solana/wallet-adapter-react-ui/styles.css" as any);

export function ClientWalletProvider(
    props: Omit<WalletProviderProps, "wallets">
): JSX.Element {
    const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSolflareWallet(),
            getLedgerWallet(),
            getSolongWallet(),
            getMathWallet(),
            getSolletWallet(),
        ],
        []
    );

    return (
        <WalletProvider wallets={wallets} {...props}>
            <WalletModalProvider {...props} />
        </WalletProvider>
    );
}

export default ClientWalletProvider;
