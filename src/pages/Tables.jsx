import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { getTables, createOrder, getProducts } from '../api';
import { Table, X } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const Modal = ({ show, onClose, children, title }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl w-full relative">
        <div className="flex justify-between items-center border-b p-5">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
    fetchProducts();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
    } catch (error) {
      toast({ title: 'Erro ao carregar mesas', variant: 'destructive' });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      toast({ title: 'Erro ao buscar produtos', variant: 'destructive' });
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      default:
        return 'Desconhecido';
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const addOrderItem = (product) => {
    const existingItem = orderItems.find(item => item.productId === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setOrderItems([...orderItems, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const submitOrder = async () => {
    if (!selectedTable) return;
    try {
      await createOrder({ tableId: selectedTable.id, items: orderItems });
      toast({ title: 'Pedido criado', description: `Pedido para a mesa ${selectedTable.number}.` });
      setShowOrderModal(false);
      setOrderItems([]);
    } catch (error) {
      toast({ title: 'Erro ao criar pedido', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-light mb-8">Gerenciamento de Mesas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.map(table => (
          <div key={table.id} className="bg-white p-6 rounded-xl shadow-md cursor-pointer" onClick={() => handleTableClick(table)}>
            <div className="flex items-center mb-4">
              <Table className="w-10 h-10 text-blue-500" />
              <div className="ml-4">
                <h2 className="text-2xl font-light">Mesa {table.number}</h2>
                <p className="text-lg mt-1">Status: {translateStatus(table.status)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showOrderModal} onClose={() => setShowOrderModal(false)} title={`Pedido - Mesa ${selectedTable?.number}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">R$ {parseFloat(product.price || 0).toFixed(2)}</p>
              </div>
              <Button onClick={() => addOrderItem(product)}>Adicionar</Button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {orderItems.map(item => (
            <div key={item.productId} className="flex justify-between items-center mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={submitOrder}>Finalizar Pedido</Button>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Tables;
