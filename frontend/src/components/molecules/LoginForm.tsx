import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import ErrorMessage from '../atoms/ErrorMessage';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC<{ onLogin?: (jwt: string) => void }> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(undefined);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.message || 'Identifiants invalides.');
        return;
      }
      if (result.token) {
        onLogin?.(result.token);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erreur réseau, veuillez réessayer.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
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
        autoComplete="current-password"
        {...register('password', { required: 'Mot de passe requis' })}
        error={errors.password?.message}
      />
      <ErrorMessage message={serverError} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
};

export default LoginForm;
