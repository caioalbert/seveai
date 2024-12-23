import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { getOrders, createOrder, addOrderItems, deleteOrder } from '../api';
import { getTables, getUsers, getProducts } from '../api';
import { ClipboardList, Trash2, PlusCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
      <button onClick={onClose} className="absolute top-4 right-4">
        <X className="w-6 h-6" />
      </button>
      {children}
    </div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [waiters, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({ tableId: '', waiterId: '', products: [] });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchOrders();
    fetchTables();
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar garçons:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleProductChange = (productId) => {
    const updatedProducts = newOrder.products.includes(productId)
      ? newOrder.products.filter(id => id !== productId)
      : [...newOrder.products, productId];
    setNewOrder({ ...newOrder, products: updatedProducts });
  };

  const addOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await createOrder(newOrder);
      setOrders([...orders, response.data]);
      setNewOrder({ tableId: '', waiterId: '', products: [] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
    }
  };

  const addItemsToOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await addOrderItems(selectedOrder.id, newOrder.products);
      fetchOrders();
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erro ao adicionar itens:', error);
    }
  };

  const removeOrder = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      console.error('Erro ao remover pedido:', error);
    }
  };

  const filteredOrders = filterStatus === 'todos'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light flex items-center">
          <ClipboardList className="w-8 h-8 mr-3" /> Gerenciamento de Pedidos
        </h1>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="open">Aberto</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Finalizado</option>
        </Select>
      </div>

      <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
        <PlusCircle className="w-5 h-5 mr-2" /> Novo Pedido
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {paginatedOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <h2 className="text-2xl font-light">Pedido #{order.id}</h2>
            <p>Mesa: {order.tableId}</p>
            <p>Status: {order.status}</p>
            <Button onClick={() => removeOrder(order.id)} variant="destructive">
              <Trash2 className="w-5 h-5 mr-2" /> Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
