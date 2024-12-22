import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Upload, Save, X, Trash2 } from 'lucide-react';
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

const Settings = () => {
  const [logo, setLogo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setLogo(URL.createObjectURL(file));
    } else {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione um arquivo de imagem (JPEG, PNG).',
        variant: 'destructive',
      });
    }
  };

  const handleSaveLogo = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Selecione uma imagem antes de salvar.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simula o upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Logo atualizada',
        description: 'A logo foi atualizada com sucesso!',
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar a logo. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setSelectedFile(null);
  };

  return (
    <div>
      <h1 className="text-4xl font-light mb-8">Configurações</h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light">Logo da Empresa</h2>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
            <Upload className="w-5 h-5 mr-2" /> Atualizar Logo
          </Button>
        </div>

        {logo ? (
          <div className="mt-6 flex flex-col items-center">
            <img
              src={logo}
              alt="Logo da empresa"
              className="w-40 h-40 object-contain"
            />
            <Button
              variant="destructive"
              onClick={removeLogo}
              className="mt-4 flex items-center"
            >
              <Trash2 className="w-5 h-5 mr-2" /> Remover Logo
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            Nenhuma logo configurada.
          </p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-light mb-4">Atualizar Logo</h2>
          <form onSubmit={handleSaveLogo} className="grid grid-cols-1 gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mb-4"
            />
            {logo && (
              <img
                src={logo}
                alt="Preview da logo"
                className="w-40 h-40 object-contain mx-auto"
              />
            )}
            <Button
              type="submit"
              className="mt-4 flex items-center"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (
                <>
                  <Save className="w-5 h-5 mr-2" /> Salvar Logo
                </>
              )}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Settings;
