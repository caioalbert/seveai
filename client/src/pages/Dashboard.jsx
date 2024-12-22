import React, { useState, useEffect } from 'react';
import { getTables, getUsers, getProducts, getOrders, getDailyFinancialReport } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Utensils, ShoppingCart, ClipboardList, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tables: 0,
    waiters: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [financialReport, setFinancialReport] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchFinancialReport();
  }, []);

  const fetchStats = async () => {
    try {
      const [tablesRes, waitersRes, productsRes, ordersRes] = await Promise.all([
        getTables(),
        getUsers({ role: 'waiter' }),  // Busca usuários com role de waiter
        getProducts(),
        getOrders()
      ]);

      const revenue = ordersRes.data.reduce((total, order) => total + parseFloat(order.totalAmount), 0);

      setStats({
        tables: tablesRes.data.length,
        waiters: waitersRes.data.length,  // Usa o resultado correto
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        revenue: revenue.toFixed(2)
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchFinancialReport = async () => {
    try {
      const response = await getDailyFinancialReport();
      setFinancialReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório financeiro:', error);
    }
  };

  const prepareChartData = () => {
    if (!financialReport) return [];
    return Object.entries(financialReport.productSales).map(([name, data]) => ({
      name,
      quantidade: data.quantity,
      receita: data.revenue
    }));
  };

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white p-6 rounded-xl shadow flex items-center">
      <Icon className="w-10 h-10 text-blue-500" />
      <div className="ml-4">
        <h2 className="text-lg text-gray-500">{label}</h2>
        <p className="text-3xl font-light mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-4xl font-light mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={ClipboardList} label="Mesas" value={stats.tables} />
        <StatCard icon={Users} label="Garçons" value={stats.waiters} />
        <StatCard icon={ShoppingCart} label="Produtos" value={stats.products} />
        <StatCard icon={Utensils} label="Pedidos" value={stats.orders} />
        <StatCard icon={DollarSign} label="Receita Total" value={`R$ ${stats.revenue}`} />
      </div>

      <h2 className="text-2xl font-light mb-6">Relatório Financeiro Diário</h2>
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <p>Total de Pedidos: {financialReport?.orderCount}</p>
        <p>Receita Total: R$ {financialReport?.totalRevenue.toFixed(2)}</p>
      </div>

      <h2 className="text-2xl font-light mb-6">Vendas por Produto</h2>
      <div className="bg-white p-6 rounded-xl shadow" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={prepareChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="quantidade" fill="#8884d8" name="Quantidade" />
            <Bar yAxisId="right" dataKey="receita" fill="#82ca9d" name="Receita (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
