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

interface MealFormInputs {
  name: string;
  description?: string;
  date: string;
}

const EditMealPage: React.FC = () => {
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
  } = useForm<MealFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id || !jwt) {
        setFetchError('ID du repas manquant ou utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meals/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setFetchError('Repas non trouvé');
          } else if (response.status === 401) {
            setFetchError('Session expirée. Veuillez vous reconnecter.');
          } else {
            setFetchError(`Erreur ${response.status}: Impossible de charger le repas.`);
          }
          return;
        }

        const meal = await response.json();
        
        // Pré-remplir le formulaire
        setValue('name', meal.name);
        setValue('description', meal.description || '');
        setValue('date', new Date(meal.date).toISOString().slice(0, 16));
      } catch {
        setFetchError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id, jwt, setValue]);

  const onSubmit = async (data: MealFormInputs) => {
    setServerError(undefined);
    
    const payload = {
      name: data.name,
      description: data.description || null,
      date: new Date(data.date).toISOString(),
    };
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setServerError('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const result = await response.json();
          setServerError(result.error?.[0] || result.error || 'Données invalides. Vérifiez vos informations.');
        } else if (response.status === 404) {
          setServerError('Repas non trouvé');
        } else {
          setServerError(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        }
        return;
      }

      // Succès : redirection vers la liste des repas
      navigate('/meals');
    } catch {
      setServerError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement du repas..." />
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
              onClick={() => navigate('/meals')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Retour aux repas
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Modifier le Repas</h1>
            <p className="text-gray-600">Modifiez les informations de votre repas.</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Nom du repas"
                  type="text"
                  placeholder="Ex: Petit-déjeuner, Déjeuner, Collation..."
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
                    placeholder="Décrivez votre repas, les aliments consommés..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={4}
                  />
                </div>

                <Input
                  label="Date et heure"
                  type="datetime-local"
                  {...register('date', { 
                    required: 'La date est requise'
                  })}
                  error={errors.date?.message}
                />
              </div>

              <ErrorMessage message={serverError} />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/meals')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Modification...' : 'Modifier le repas'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditMealPage;
