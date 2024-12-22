import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tables from './pages/Tables';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import KitchenView from './pages/KitchenView';
import Inventory from './pages/Inventory';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Reservations from './pages/Reservations';
import Restaurants from './pages/Restaurants';
import Login from './pages/Login';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Redireciona a rota root com base na role do usuário
const RoleBasedRedirect = () => {
  const role = localStorage.getItem('role');

  switch (role) {
    case 'manager':
      return <Navigate to="/dashboard" />;
    case 'chef':
      return <Navigate to="/kitchen" />;
    case 'waiter':
      return <Navigate to="/orders" />;
    case 'admin':
      return <Navigate to="/restaurants" />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<RoleBasedRedirect />} />
            
            <Route path="dashboard" element={
              <PrivateRoute allowedRoles={['manager', 'admin']}>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="tables" element={
              <PrivateRoute allowedRoles={['manager']}>
                <Tables />
              </PrivateRoute>
            } />

            <Route path="waiters" element={
              <PrivateRoute allowedRoles={['manager']}>
                <Users />
              </PrivateRoute>
            } />

            <Route path="products" element={
              <PrivateRoute allowedRoles={['manager', 'chef']}>
                <Products />
              </PrivateRoute>
            } />

            <Route path="orders" element={
              <PrivateRoute allowedRoles={['manager', 'waiter']}>
                <Orders />
              </PrivateRoute>
            } />

            <Route path="kitchen" element={
              <PrivateRoute allowedRoles={['chef', 'manager']}>
                <KitchenView />
              </PrivateRoute>
            } />

            <Route path="inventory" element={
              <PrivateRoute allowedRoles={['manager']}>
                <Inventory />
              </PrivateRoute>
            } />

            <Route path="finances" element={
              <PrivateRoute allowedRoles={['manager']}>
                <Finances />
              </PrivateRoute>
            } />

            <Route path="settings" element={
              <PrivateRoute allowedRoles={['manager']}>
                <Settings />
              </PrivateRoute>
            } />

            <Route path="reservations" element={
              <PrivateRoute allowedRoles={['manager', 'waiter']}>
                <Reservations />
              </PrivateRoute>
            } />

            <Route path="restaurants" element={
              <PrivateRoute allowedRoles={['admin']}>
                <Restaurants />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
