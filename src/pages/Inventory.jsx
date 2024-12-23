import React, { useState, useEffect } from 'react';
import { getProducts, updateProductStock } from '../api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Package, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select } from '../components/ui/select';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [updatedStock, setUpdatedStock] = useState({});
  const [filterCategory, setFilterCategory] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar inventário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id, value) => {
    const parsedValue = parseInt(value, 10);
    if (parsedValue < 0) return;  // Evita valores negativos
    setUpdatedStock({ ...updatedStock, [id]: parsedValue });
  };

  const handleStockUpdate = async (id) => {
    const newStock = updatedStock[id];
    if (newStock === undefined) return;  // Evita atualização sem mudanças
    setLoading(true);
    try {
      await updateProductStock(id, newStock);
      
      // Atualiza o estoque diretamente no estado sem recarregar tudo
      const updatedProducts = products.map(product => 
        product.id === id ? { ...product, stock: newStock } : product
      );
      setProducts(updatedProducts);

      // Limpa o valor de input alterado após sucesso
      setUpdatedStock((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filterCategory === 'todos'
    ? products
    : products.filter(product => product.category === filterCategory);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light flex items-center">
          <Package className="w-8 h-8 mr-3" /> Controle de Estoque
        </h1>
        <div className="flex items-center space-x-4">
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="bebidas">Bebidas</option>
            <option value="comidas">Comidas</option>
            <option value="sobremesas">Sobremesas</option>
          </Select>
        </div>
      </div>
      
      {loading && (
        <p className="text-center text-gray-500">Carregando...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map(product => (
          <div key={product.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex items-center mb-4">
              <Package className="w-10 h-10 text-blue-500" />
              <div className="ml-4">
                <h2 className="text-2xl font-light">{product.name}</h2>
                <p className="text-gray-500">Preço: R$ {product.price}</p>
                <p className="text-gray-500">Estoque atual: {product.stock}</p>
              </div>
            </div>
            <div className="flex mt-auto space-x-4">
              <Input
                type="number"
                min="0"
                value={updatedStock[product.id] ?? product.stock}
                onChange={(e) => handleStockChange(product.id, e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => handleStockUpdate(product.id)} 
                className="flex items-center" 
                disabled={loading}
              >
                <RefreshCw className="w-5 h-5 mr-2" /> Atualizar
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span>Página {currentPage}</span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= filteredProducts.length}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Inventory;
