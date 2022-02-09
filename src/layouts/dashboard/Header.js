import PropTypes from 'prop-types';
// components

import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

Header.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <div>
          <WalletModalProvider>
            <WalletMultiButton />
          </WalletModalProvider>
        </div>
      </div>
    </div>
  );
}
