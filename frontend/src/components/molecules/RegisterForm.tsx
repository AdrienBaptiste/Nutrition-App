import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import ErrorMessage from '../atoms/ErrorMessage';

interface RegisterFormInputs {
  email: string;
  password: string;
  name: string;
}

const RegisterForm: React.FC<{ onRegister?: () => void }> = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(undefined);
    setSuccess(false);
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        // Gestion spécifique des codes d'erreur HTTP
        if (response.status === 409) {
          setServerError('Cet email est déjà utilisé. Veuillez en choisir un autre.');
          return;
        }
        if (response.status === 400) {
          const result = await response.json();
          setServerError(result.error?.[0] || result.error || 'Données invalides. Vérifiez vos informations.');
          return;
        }
        if (response.status === 422) {
          const result = await response.json();
          setServerError(result.error?.[0] || result.error || 'Données non valides. Vérifiez le format de vos informations.');
          return;
        }
        // Autres erreurs serveur
        setServerError(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        return;
      }
      
      await response.json(); // Succès de l'inscription
      setSuccess(true);
      onRegister?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
      <Input
        label="Nom"
        type="text"
        autoComplete="name"
        {...register('name', { required: 'Nom requis' })}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        {...register('email', { required: 'Email requis' })}
        error={errors.email?.message}
      />
      <Input
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        {...register('password', { required: 'Mot de passe requis' })}
        error={errors.password?.message}
      />
      <ErrorMessage message={serverError} />
      {success && (
        <div className="text-green-600 text-sm font-medium mb-2" role="status">
          Inscription réussie ! Vous pouvez vous connecter.
        </div>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Inscription...' : "S'inscrire"}
      </Button>
    </form>
  );
};

export default RegisterForm;
