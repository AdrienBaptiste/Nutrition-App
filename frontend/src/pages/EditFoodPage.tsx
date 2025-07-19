import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface FoodFormInputs {
  name: string;
  description?: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

const EditFoodPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FoodFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      if (!id || !jwt) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/foods/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            setServerError(`Erreur ${response.status}: Impossible de charger l'aliment.`);
          }
          return;
        }

        const food = await response.json();
        
        // Pré-remplir le formulaire
        setValue('name', food.name);
        setValue('description', food.description || '');
        setValue('protein', food.protein);
        setValue('carbs', food.carbs);
        setValue('fat', food.fat);
        setValue('calories', food.calories);
      } catch {
        setServerError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id, jwt, setValue]);

  const onSubmit = async (data: FoodFormInputs) => {
    setServerError(undefined);
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/foods/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
          protein: parseFloat(data.protein.toString()),
          carbs: parseFloat(data.carbs.toString()),
          fat: parseFloat(data.fat.toString()),
          calories: parseFloat(data.calories.toString()),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setServerError('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const result = await response.json();
          setServerError(result.error?.[0] || result.error || 'Données invalides. Vérifiez vos informations.');
        } else if (response.status === 404) {
          setServerError('Aliment introuvable.');
        } else {
          setServerError(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        }
        return;
      }

      // Succès : redirection vers la liste des aliments
      navigate('/foods');
    } catch {
      setServerError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement de l'aliment..." />
        </div>
      </MainLayout>
    );
  }

  if (notFound) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aliment introuvable</h2>
            <p className="text-gray-600 mb-4">L'aliment que vous cherchez n'existe pas ou vous n'y avez pas accès.</p>
            <button
              onClick={() => navigate('/foods')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Retour à la liste
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Modifier l'Aliment</h1>
            <p className="text-gray-600">Modifiez les informations de cet aliment.</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Nom de l'aliment"
                    type="text"
                    placeholder="Ex: Pomme, Riz complet..."
                    {...register('name', { 
                      required: 'Le nom est requis',
                      maxLength: { value: 50, message: 'Maximum 50 caractères' }
                    })}
                    error={errors.name?.message}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Description de l'aliment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <Input
                  label="Protéines (g)"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...register('protein', { 
                    required: 'Les protéines sont requises',
                    min: { value: 0, message: 'Valeur positive requise' }
                  })}
                  error={errors.protein?.message}
                />

                <Input
                  label="Glucides (g)"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...register('carbs', { 
                    required: 'Les glucides sont requis',
                    min: { value: 0, message: 'Valeur positive requise' }
                  })}
                  error={errors.carbs?.message}
                />

                <Input
                  label="Lipides (g)"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...register('fat', { 
                    required: 'Les lipides sont requis',
                    min: { value: 0, message: 'Valeur positive requise' }
                  })}
                  error={errors.fat?.message}
                />

                <Input
                  label="Calories (kcal)"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  {...register('calories', { 
                    required: 'Les calories sont requises',
                    min: { value: 0, message: 'Valeur positive requise' }
                  })}
                  error={errors.calories?.message}
                />
              </div>

              <ErrorMessage message={serverError} />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/foods')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Modification...' : 'Modifier l\'aliment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditFoodPage;
