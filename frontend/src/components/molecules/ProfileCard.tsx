import React from 'react';
import Card from '../atoms/Card';
import Title from '../atoms/Title';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="mb-8">
      <Title level={2} className="mb-4 text-gray-800">Mon Profil</Title>
      <div className="space-y-3">
        <div>
          <span className="font-medium text-gray-600">Nom :</span>
          <span className="ml-2 text-gray-800">{profile.name}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Email :</span>
          <span className="ml-2 text-gray-800">{profile.email}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">ID :</span>
          <span className="ml-2 text-gray-800">#{profile.id}</span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Rôles :</span>
          <span className="ml-2 text-gray-800">{profile.roles.join(', ')}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
