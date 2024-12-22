import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { getUsers, createUser, deleteUser } from '../api';
import { PlusCircle, Trash2, User, X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={onClose} className="absolute top-4 right-4">
        <X className="w-6 h-6" />
      </button>
      {children}
    </div>
  </div>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'waiter' });
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar usuários',
        description: 'Não foi possível buscar os usuários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createUser(newUser);
      setUsers([...users, response.data]);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', phone: '', role: 'waiter' });

      toast({
        title: 'Usuário adicionado',
        description: `Usuário ${response.data.name} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar usuário',
        description: 'Não foi possível adicionar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveUser = (id) => {
    setUserToDelete(id);
  };

  const removeUser = async () => {
    setLoading(true);
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete));

      toast({
        title: 'Usuário removido',
        description: 'O usuário foi removido com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover usuário',
        description: 'Não foi possível remover o usuário.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setUserToDelete(null);
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h1 className="text-4xl font-light mb-8">Gerenciamento de Usuários</h1>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> {loading ? 'Adicionando...' : 'Adicionar Usuário'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedUsers.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex items-center mb-4">
              <User className="w-10 h-10 text-blue-500" />
              <div className="ml-4">
                <h2 className="text-2xl font-light">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-lg mt-2">Telefone: <strong>{user.phone || 'N/A'}</strong></p>
                <p className="text-gray-500">Função: {user.role}</p>
              </div>
            </div>
            <Button onClick={() => confirmRemoveUser(user.id)} className="mt-auto flex items-center" variant="destructive">
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
          disabled={currentPage * itemsPerPage >= users.length}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Users;
