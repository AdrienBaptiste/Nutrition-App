import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

interface MealFormInputs {
  name: string;
  description?: string;
  date: string;
}

const CreateMealPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MealFormInputs>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 16), // Format YYYY-MM-DDTHH:MM
    },
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit = async (data: MealFormInputs) => {
    setServerError(undefined);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meals`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
          date: new Date(data.date).toISOString(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setServerError('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const result = await response.json();
          setServerError(
            result.error?.[0] || result.error || 'Données invalides. Vérifiez vos informations.'
          );
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

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouveau Repas</h1>
            <p className="text-gray-600">
              Enregistrez un nouveau repas dans votre journal alimentaire.
            </p>
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
                    maxLength: { value: 50, message: 'Maximum 50 caractères' },
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
                    required: 'La date est requise',
                  })}
                  error={errors.date?.message}
                />
              </div>

              <ErrorMessage message={serverError} />

              <div className="flex justify-between pt-4">
                <Button type="button" onClick={() => navigate('/meals')} variant="secondary">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="primary">
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer le repas'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateMealPage;
