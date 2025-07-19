import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

interface DishFormInputs {
  name: string;
  description?: string;
}

const CreateDishPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DishFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit = async (data: DishFormInputs) => {
    setServerError(undefined);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/dishes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setServerError('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const result = await response.json();
          setServerError(result.error?.[0] || result.error || 'Données invalides. Vérifiez vos informations.');
        } else {
          setServerError(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        }
        return;
      }

      const createdDish = await response.json();
      
      // Succès : redirection vers la page de composition du plat
      navigate(`/dishes/${createdDish.id}/compose`);
    } catch {
      setServerError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouveau Plat</h1>
            <p className="text-gray-600">Créez un nouveau plat. Vous pourrez ensuite ajouter des aliments à sa composition.</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Nom du plat"
                  type="text"
                  placeholder="Ex: Salade de tomates, Pasta carbonara..."
                  {...register('name', { 
                    required: 'Le nom est requis',
                    maxLength: { value: 50, message: 'Maximum 50 caractères' }
                  })}
                  error={errors.name?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Décrivez votre plat, sa préparation, ses spécificités..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-purple-800">
                      Prochaine étape
                    </h3>
                    <div className="mt-1 text-sm text-purple-700">
                      <p>Après création du plat, vous serez dirigé vers la page de composition pour ajouter les aliments et leurs quantités.</p>
                    </div>
                  </div>
                </div>
              </div>

              <ErrorMessage message={serverError} />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dishes')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Créer le plat'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDishPage;
