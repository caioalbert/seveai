import React, { useState, useEffect } from 'react';
import { getDailyFinancialReport, getWeeklyFinancialReport, getCustomFinancialReport } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../components/ui/button';
import { Calendar, BarChart as BarIcon, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select } from '../components/ui/select';

const Finances = () => {
  const [dailyReport, setDailyReport] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [customReport, setCustomReport] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterType, setFilterType] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDailyReport();
    fetchWeeklyReport();
  }, []);

  const fetchDailyReport = async () => {
    try {
      const response = await getDailyFinancialReport();
      setDailyReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório diário:', error);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const response = await getWeeklyFinancialReport();
      setWeeklyReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório semanal:', error);
    }
  };

  const fetchCustomReport = async () => {
    if (startDate > endDate) {
      alert('A data de início não pode ser maior que a data de término.');
      return;
    }
    try {
      const response = await getCustomFinancialReport(startDate, endDate);
      setCustomReport(response.data);
    } catch (error) {
      console.error('Erro ao buscar relatório personalizado:', error);
    }
  };

  const prepareChartData = (report) => {
    if (!report) return [];
    return Object.entries(report.productSales || {}).map(([name, data]) => ({
      name,
      quantidade: data.quantity,
      receita: data.revenue
    }));
  };

  const filterReports = (report) => {
    if (!report) return [];
    if (filterType === 'todos') return report;
    return report.filter(item => item.status === filterType);
  };

  const paginatedData = (report) => {
    const filtered = filterReports(report);
    return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light flex items-center">
          <BarIcon className="w-8 h-8 mr-3" /> Relatórios Financeiros
        </h1>
        <div className="flex items-center space-x-4">
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </Select>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="p-2 border rounded"
          />
          <span>até</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="p-2 border rounded"
          />
          <Button
            onClick={fetchCustomReport}
            className="flex items-center"
            disabled={startDate > endDate}
          >
            <RefreshCw className="w-5 h-5 mr-2" /> Gerar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Relatório Diário */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-light mb-4">Relatório Diário</h2>
          <p>Total de Pedidos: {dailyReport?.orderCount || 0}</p>
          <p>Receita Total: R$ {dailyReport?.totalRevenue?.toFixed(2) || '0.00'}</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paginatedData(prepareChartData(dailyReport))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receita" fill="#8884d8" name="Receita (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Finances;
