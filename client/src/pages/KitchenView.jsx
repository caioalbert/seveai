import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { kitchen } from '../api';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';

const KitchenView = () => {
  const [queue, setQueue] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const socket = useSocket();
  const toast = useToast();  // Captura o hook de toast

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000);

    if (socket) {
      socket.on('newOrder', handleNewOrder);
      socket.on('orderUpdated', handleOrderUpdated);
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('newOrder');
        socket.off('orderUpdated');
      }
    };
  }, [socket]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await kitchen.getQueue();
      setQueue(response.data);
    } catch (error) {
      console.error('Erro ao buscar fila da cozinha:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a fila de pedidos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = (order) => {
    setQueue((prevQueue) => [...prevQueue, order]);
    toast({
      title: 'Novo Pedido',
      description: `Pedido #${order.id} adicionado à fila.`,
    });
  };

  const handleOrderUpdated = (updatedOrder) => {
    setQueue((prevQueue) =>
      prevQueue.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handleItemStatusUpdate = async (orderId, itemId, newStatus) => {
    try {
      await kitchen.updateOrderItem(itemId, { status: newStatus });
      setQueue((prevQueue) =>
        prevQueue.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              OrderItems: order.OrderItems.map((item) =>
                item.id === itemId ? { ...item, status: newStatus } : item
              ),
            };
          }
          return order;
        })
      );
      toast({
        title: 'Status Atualizado',
        description: `Item do pedido #${orderId} atualizado para ${newStatus}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status do item:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do item.',
        variant: 'destructive',
      });
    }
  };

  const filteredQueue = filterStatus === 'todos'
    ? queue
    : queue.filter(order => order.status === filterStatus);

  const paginatedQueue = filteredQueue.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusIcons = {
    pending: <Clock className="text-yellow-500 w-5 h-5" />,
    preparing: <CheckCircle className="text-blue-500 w-5 h-5" />,
    ready: <CheckCircle className="text-green-500 w-5 h-5" />,
    default: <XCircle className="text-gray-500 w-5 h-5" />,
  };

  const getStatusIcon = (status) => statusIcons[status] || statusIcons.default;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light">Visão da Cozinha</h1>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="pending">Pendente</option>
          <option value="preparing">Em Preparo</option>
          <option value="ready">Pronto</option>
        </Select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando pedidos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedQueue.map((order) => (
            <Card key={order.id} className="w-full">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Pedido #{order.id}</CardTitle>
                  <p className="text-gray-500">Mesa: {order.Table?.number}</p>
                </div>
                <Badge>{order.status}</Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {order.OrderItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(item.status)}
                        <span className="ml-3">
                          {item.Product.name} x {item.quantity}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span>Página {currentPage}</span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= filteredQueue.length}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default KitchenView;
