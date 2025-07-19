import React from 'react';
import MainLayout from '../components/templates/MainLayout';
import AppLink from '../components/atoms/AppLink';
import Card from '../components/atoms/Card';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bienvenue sur Nutrition App
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Suivez votre alimentation, gérez vos repas et atteignez vos objectifs nutritionnels
            </p>
            <div className="space-x-4">
              <AppLink
                to="/auth"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Se connecter
              </AppLink>
              <AppLink
                to="/calculator"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Calculateur
              </AppLink>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🍎 Aliments</h3>
              <p className="text-gray-600">
                Gérez votre base de données d'aliments personnalisée avec leurs valeurs nutritionnelles
              </p>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🍽️ Repas</h3>
              <p className="text-gray-600">
                Planifiez et enregistrez vos repas quotidiens pour un suivi optimal
              </p>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Suivi</h3>
              <p className="text-gray-600">
                Suivez votre évolution de poids et analysez vos habitudes alimentaires
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre compte gratuitement et commencez à suivre votre nutrition dès aujourd'hui
            </p>
            <AppLink
              to="/auth"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Créer un compte
            </AppLink>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
