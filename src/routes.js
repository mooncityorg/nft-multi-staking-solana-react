import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import NFTs from './pages/NFTs';
import StakedYards from './pages/StakedYards';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout><NFTs /></DashboardLayout>,
      children: [
        { element: <Navigate to="/" replace /> },
        { path: '', element: <NFTs /> }
      ]
    },
    {
      path: '/yards',
      element: <DashboardLayout><StakedYards /></DashboardLayout>,
      children: [
        { element: <Navigate to="/yards" replace /> },
        { path: '', element: <StakedYards /> }
      ]
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ]);
}
