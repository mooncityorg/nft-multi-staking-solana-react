// routes
import Router from './routes';
//style
import "./assets/scss/style.css"
import { Wallets } from './components/wallet';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Wallets>
      <Router />
    </Wallets>
  );
}
