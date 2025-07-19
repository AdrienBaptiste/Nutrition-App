import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface DishFormInputs {
  name: string;
  description?: string;
}

const EditDishPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DishFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchDish = async () => {
      if (!id || !jwt) {
        setFetchError('ID du plat manquant ou utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/dishes/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setFetchError('Plat non trouvé');
          } else if (response.status === 401) {
            setFetchError('Session expirée. Veuillez vous reconnecter.');
          } else {
            setFetchError(`Erreur ${response.status}: Impossible de charger le plat.`);
          }
          return;
        }

        const dish = await response.json();
        
        // Pré-remplir le formulaire
        setValue('name', dish.name);
        setValue('description', dish.description || '');
      } catch {
        setFetchError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id, jwt, setValue]);

  const onSubmit = async (data: DishFormInputs) => {
    setServerError(undefined);
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/dishes/${id}`, {
        method: 'PUT',
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
        } else if (response.status === 404) {
          setServerError('Plat non trouvé');
        } else {
          setServerError(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        }
        return;
      }

      // Succès : redirection vers la liste des plats
      navigate('/dishes');
    } catch {
      setServerError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement du plat..." />
        </div>
      </MainLayout>
    );
  }

  if (fetchError) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{fetchError}</p>
            <button
              onClick={() => navigate('/dishes')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Retour aux plats
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Modifier le Plat</h1>
            <p className="text-gray-600">Modifiez les informations de votre plat.</p>
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
                  {isSubmitting ? 'Modification...' : 'Modifier le plat'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditDishPage;
