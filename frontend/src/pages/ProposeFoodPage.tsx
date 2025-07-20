import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface ProposeFoodFormInputs {
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ProposeFoodPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProposeFoodFormInputs>();

  const onSubmit = async (data: ProposeFoodFormInputs) => {
    if (!jwt) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/foods', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la proposition d\'aliment');
      }

      setSuccess(true);
      reset();
      
      // Rediriger vers la page des propositions après 2 secondes
      setTimeout(() => {
        navigate('/foods/my-proposals');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Envoi de votre proposition..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-2 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Proposer un nouvel aliment</h1>
          
          {success ? (
            <Card>
              <div className="text-center py-8">
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Proposition envoyée avec succès !
                </h2>
                <p className="text-gray-600 mb-4">
                  Votre aliment sera examiné par un administrateur avant d'être ajouté à la base commune.
                </p>
                <p className="text-sm text-gray-500">
                  Redirection vers vos propositions...
                </p>
              </div>
            </Card>
          ) : (
            <>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h2 className="font-semibold text-blue-800 mb-2">ℹ️ Comment ça marche ?</h2>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Proposez un nouvel aliment avec ses valeurs nutritionnelles</li>
                  <li>• Votre proposition sera examinée par un administrateur</li>
                  <li>• Une fois validée, l'aliment sera disponible pour tous les utilisateurs</li>
                  <li>• Vous pouvez suivre le statut de vos propositions dans "Mes propositions"</li>
                </ul>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Nom de l'aliment *"
                        placeholder="Ex: Quinoa rouge bio"
                        {...register('name', { 
                          required: 'Le nom est requis',
                          minLength: { value: 2, message: 'Minimum 2 caractères' },
                          maxLength: { value: 50, message: 'Maximum 50 caractères' }
                        })}
                        error={errors.name?.message}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optionnelle)
                      </label>
                      <textarea
                        {...register('description', {
                          maxLength: { value: 500, message: 'Maximum 500 caractères' }
                        })}
                        placeholder="Ex: Quinoa rouge biologique, riche en protéines et sans gluten..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                      {errors.description && (
                        <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <Input
                      label="Calories (pour 100g) *"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 368"
                      {...register('calories', { 
                        required: 'Les calories sont requises',
                        min: { value: 0, message: 'Minimum 0 kcal' },
                        max: { value: 1000, message: 'Maximum 1000 kcal' },
                        valueAsNumber: true
                      })}
                      error={errors.calories?.message}
                    />

                    <Input
                      label="Protéines (g pour 100g) *"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 14.1"
                      {...register('protein', { 
                        required: 'Les protéines sont requises',
                        min: { value: 0, message: 'Minimum 0g' },
                        max: { value: 100, message: 'Maximum 100g' },
                        valueAsNumber: true
                      })}
                      error={errors.protein?.message}
                    />

                    <Input
                      label="Glucides (g pour 100g) *"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 64.2"
                      {...register('carbs', { 
                        required: 'Les glucides sont requis',
                        min: { value: 0, message: 'Minimum 0g' },
                        max: { value: 100, message: 'Maximum 100g' },
                        valueAsNumber: true
                      })}
                      error={errors.carbs?.message}
                    />

                    <Input
                      label="Lipides (g pour 100g) *"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 6.1"
                      {...register('fat', { 
                        required: 'Les lipides sont requis',
                        min: { value: 0, message: 'Minimum 0g' },
                        max: { value: 100, message: 'Maximum 100g' },
                        valueAsNumber: true
                      })}
                      error={errors.fat?.message}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={loading}>
                      Proposer cet aliment
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/foods')}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </Card>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProposeFoodPage;
