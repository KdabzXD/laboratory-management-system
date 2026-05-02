import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Scientists from './pages/Scientists';
import Equipment from './pages/Equipment';
import Materials from './pages/Materials';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import QueriesReports from './pages/QueriesReports';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'departments', Component: Departments },
      { path: 'scientists', Component: Scientists },
      { path: 'equipment', Component: Equipment },
      { path: 'materials', Component: Materials },
      { path: 'suppliers', Component: Suppliers },
      { path: 'purchases', Component: Purchases },
      { path: 'queries-reports', Component: QueriesReports },
    ],
  },
]);
