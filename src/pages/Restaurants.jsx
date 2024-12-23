import React, { useState, useEffect } from 'react';
import { getRestaurants, createRestaurant } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building, PlusCircle, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

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

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    managerName: '',
    username: '',
    managerPassword: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await getRestaurants();  // Chama API
      console.log('Resposta completa da API:', response);  // Loga a resposta completa
      console.log('Dados retornados:', response.data);  // Loga apenas o .data
      setRestaurants(response.data);  // Define o estado com os dados
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
      alert('Erro ao carregar restaurantes.');
    }
  };

  const handleInputChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();

    if (!newRestaurant.username) {
      alert('O campo "Username do Gerente" é obrigatório.');
      return;
    }

    try {
      const response = await createRestaurant(newRestaurant);

      // Atualiza a lista de restaurantes corretamente
      setRestaurants((prevRestaurants) => [
        ...prevRestaurants,
        response.data.newRestaurant  // Garante que o estado seja atualizado corretamente
      ]);

      setIsModalOpen(false);
      setNewRestaurant({ name: '', address: '', managerName: '', username: '', managerPassword: '' });
    } catch (error) {
      console.error('Erro ao adicionar restaurante:', error);
      alert(error.response?.data?.message || 'Erro ao adicionar restaurante.');
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-light mb-8">Gerenciamento de Restaurantes</h1>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> Adicionar Restaurante
        </Button>
      </div>

      {/* Grid de Listagem de Restaurantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">{restaurant.name}</h3>
                <p className="text-gray-600 mt-2">{restaurant.address}</p>
              </div>
              <div className="bg-gray-50 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-gray-700">ID: {restaurant.id}</span>
                </div>
                <Trash2
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition"
                  onClick={() => handleDeleteRestaurant(restaurant.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Nenhum restaurante cadastrado.
          </p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-light mb-4">Adicionar Restaurante</h2>
          <form onSubmit={handleAddRestaurant} className="grid grid-cols-1 gap-4">
            <Input
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleInputChange}
              placeholder="Nome do Restaurante"
            />
            <Input
              type="text"
              name="address"
              value={newRestaurant.address}
              onChange={handleInputChange}
              placeholder="Endereço"
            />
            <h3 className="text-xl mt-6">Gerente</h3>
            <Input
              type="text"
              name="managerName"
              value={newRestaurant.managerName}
              onChange={handleInputChange}
              placeholder="Nome do Gerente"
            />
            <Input
              type="username"
              name="username"
              value={newRestaurant.username}
              onChange={handleInputChange}
              placeholder="Username do Gerente"
            />
            <Input
              type="password"
              name="managerPassword"
              value={newRestaurant.managerPassword}
              onChange={handleInputChange}
              placeholder="Senha do Gerente"
            />
            <Button type="submit" className="mt-4">Salvar Restaurante</Button>
          </form>
        </Modal>
      )}
    </div>

  );
};

export default Restaurants;
