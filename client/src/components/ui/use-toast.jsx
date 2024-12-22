import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toast, toasts };
};

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-6 space-y-4">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`p-4 rounded shadow-lg ${
            variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {title && <h3 className="font-bold">{title}</h3>}
          {description && <p>{description}</p>}
        </div>
      ))}
    </div>
  );
};
