import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

interface FoodFormInputs {
  name: string;
  description?: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

const CreateFoodPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FoodFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit = async (data: FoodFormInputs) => {
    setServerError(undefined);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/foods', {
        method: 'POST',
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

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouvel Aliment</h1>
            <p className="text-gray-600">Ajoutez un nouvel aliment à votre base de données personnelle.</p>
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
                  {isSubmitting ? 'Création...' : 'Créer l\'aliment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateFoodPage;
