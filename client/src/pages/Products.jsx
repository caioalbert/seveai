import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { getProducts, createProduct, deleteProduct } from '../api';
import { PlusCircle, Trash2, Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao buscar produtos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createProduct(newProduct);
      setProducts([...products, response.data]);
      toast({
        title: 'Sucesso',
        description: 'Produto adicionado com sucesso!',
      });
      setIsModalOpen(false);
      setNewProduct({ name: '', description: '', price: '', category: '' });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar produto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;

    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Produto removido com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover produto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h1 className="text-4xl font-light mb-8">Gerenciamento de Produtos</h1>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> Adicionar Produto
        </Button>
      </div>

      {loading && <p className="text-center">Carregando...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedProducts.map(product => (
          <div key={product.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex items-center mb-4">
              <Package className="w-10 h-10 text-blue-500" />
              <div className="ml-4">
                <h2 className="text-2xl font-light">{product.name}</h2>
                <p className="text-gray-500">{product.description}</p>
                <p className="text-lg mt-2">Preço: <strong>R$ {product.price}</strong></p>
                <p className="text-gray-500">Categoria: {product.category}</p>
              </div>
            </div>
            <Button onClick={() => removeProduct(product.id)} className="mt-auto flex items-center" variant="destructive">
              <Trash2 className="w-5 h-5 mr-2" /> Remover
            </Button>
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
          disabled={currentPage * itemsPerPage >= products.length}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-light mb-4">Adicionar Produto</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 gap-4">
            <Input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Nome do Produto"
              required
            />
            <Input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Preço"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
