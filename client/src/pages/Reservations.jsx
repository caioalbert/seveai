import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { getReservations, createReservation } from '../api';
import { Calendar, Users, X } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({
    date: '',
    customerName: '',
    customerPhone: '',
    partySize: '',
    status: 'pendente'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await getReservations();
      setReservations(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao buscar reservas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewReservation({ ...newReservation, [e.target.name]: e.target.value });
  };

  const addReservation = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!newReservation.date || !newReservation.customerName || !newReservation.customerPhone) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createReservation(newReservation);
      setReservations([...reservations, response.data]);
      toast({
        title: 'Reserva criada',
        description: 'A nova reserva foi adicionada com sucesso!',
      });
      setIsModalOpen(false);
      setNewReservation({
        date: '',
        customerName: '',
        customerPhone: '',
        partySize: '',
        status: 'pendente'
      });
    } catch (error) {
      toast({
        title: 'Erro ao adicionar reserva',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const eventMapper = () => {
    return reservations.map(reservation => ({
      title: `${reservation.customerName} - ${reservation.partySize} pessoas`,
      start: reservation.date,
      extendedProps: {
        phone: reservation.customerPhone,
        status: reservation.status
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light flex items-center">
          <Calendar className="w-8 h-8 mr-3" /> Reservas
        </h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <Users className="w-5 h-5 mr-2" /> Nova Reserva
        </Button>
      </div>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventMapper()}
          locale="pt-br"
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          buttonText={{
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia'
          }}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-light mb-4">Nova Reserva</h2>
          <form onSubmit={addReservation} className="grid grid-cols-1 gap-4">
            <Input
              type="datetime-local"
              name="date"
              value={newReservation.date}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="customerName"
              value={newReservation.customerName}
              onChange={handleInputChange}
              placeholder="Nome do Cliente"
              required
            />
            <Input
              type="tel"
              name="customerPhone"
              value={newReservation.customerPhone}
              onChange={handleInputChange}
              placeholder="Telefone"
              required
            />
            <Input
              type="number"
              name="partySize"
              value={newReservation.partySize}
              onChange={handleInputChange}
              placeholder="Número de Pessoas"
              required
            />
            <Select
              name="status"
              value={newReservation.status}
              onChange={handleInputChange}
            >
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </Select>
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Reservations;
