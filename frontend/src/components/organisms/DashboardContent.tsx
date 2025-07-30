import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../molecules/ProfileCard';
import DashboardSectionCard from '../molecules/DashboardSectionCard';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface DashboardContentProps {
  profile: UserProfile;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ profile }) => {
  const navigate = useNavigate();
  
  const handleSectionClick = (section: string) => {
    switch (section) {
      case 'aliments':
        navigate('/foods');
        break;
      case 'repas':
        navigate('/meals');
        break;
      case 'plats':
        navigate('/dishes');
        break;
      case 'poids':
        navigate('/weights');
        break;
      default:
        console.log(`Navigation vers ${section}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Profil utilisateur */}
        <ProfileCard profile={profile} />

        {/* Sections principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardSectionCard
            title="Mes aliments"
            description="Gérez votre base d'aliments"
            buttonText="Gérer mes aliments"
            buttonColor="green"
            onButtonClick={() => handleSectionClick('aliments')}
          />
          
          <DashboardSectionCard
            title="Mes repas"
            description="Enregistrez et organisez vos repas"
            buttonText="Gérer mes repas"
            buttonColor="blue"
            onButtonClick={() => handleSectionClick('repas')}
          />
          
          <DashboardSectionCard
            title="Mes plats"
            description="Créez des plats composés d'aliments"
            buttonText="Gérer mes plats"
            buttonColor="purple"
            onButtonClick={() => handleSectionClick('plats')}
          />
          
          <DashboardSectionCard
            title="Suivi du poids"
            description="Suivez votre évolution corporelle"
            buttonText="Gérer mes pesées"
            buttonColor="red"
            onButtonClick={() => handleSectionClick('poids')}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
