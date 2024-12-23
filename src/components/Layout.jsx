import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Menu, X, LogOut, Home, ClipboardList, ShoppingCart, Users, Settings, Utensils,
  Calendar, Package, BarChart as Chart, ChevronLeft, ChevronRight, Clipboard, Building2
} from 'lucide-react';
import { Button } from './ui';
import logo from '../../public/logo.png';

const Layout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className="flex items-center p-3 hover:bg-gray-100 hover:text-black rounded-md transition-all"
    >
      <Icon className="w-5 h-5 mr-3" />
      {!isSidebarCollapsed && <span className="font-normal text-gray-700">{label}</span>}
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative ${
          isSidebarCollapsed ? 'w-20' : 'w-56'
        } bg-white shadow-md transition-all duration-300 ease-in-out z-50 h-full flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <img src={logo} alt="Logo" className={`${isSidebarCollapsed ? 'w-20' : 'w-30'} transition-all`} />
          <button onClick={toggleSidebar} className="hidden md:block">
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="mt-5 flex-1 space-y-2">
          {['manager'].includes(userRole) && (
            <NavLink to="/" icon={Home} label="Dashboard" />
          )}

          {['manager'].includes(userRole) && (
            <NavLink to="/tables" icon={ClipboardList} label="Mesas" />
          )}

          {['manager', 'chef'].includes(userRole) && (
            <NavLink to="/products" icon={ShoppingCart} label="Produtos" />
          )}

          {['manager'].includes(userRole) && (
            <NavLink to="/inventory" icon={Package} label="Estoque" />
          )}

          {['manager'].includes(userRole) && (
            <NavLink to="/waiters" icon={Users} label="Usuários" />
          )}

          {['chef', 'manager'].includes(userRole) && (
            <NavLink to="/kitchen" icon={Utensils} label="Cozinha" />
          )}

          {['manager', 'waiter'].includes(userRole) && (
            <NavLink to="/reservations" icon={Calendar} label="Reservas" />
          )}

          {['manager', 'waiter'].includes(userRole) && (
            <NavLink to="/orders" icon={Clipboard} label="Pedidos" />
          )}

          {['manager'].includes(userRole) && (
            <NavLink to="/finances" icon={Chart} label="Finanças" />
          )}

          {['manager'].includes(userRole) && (
            <NavLink to="/settings" icon={Settings} label="Configurações" />
          )}

          {/* Apenas Admin vê essa opção */}
          {userRole === 'admin' && (
            <NavLink to="/restaurants" icon={Building2} label="Restaurantes" />
          )}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 hover:bg-red-500 text-white rounded-lg transition-all bg-red-400 w-full justify-center"
          >
            <LogOut className="w-5 h-5 mr-3" /> {!isSidebarCollapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center justify-between bg-white shadow-md p-6">
          <button onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-normal text-gray-700">Restaurante ERP</h1>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
