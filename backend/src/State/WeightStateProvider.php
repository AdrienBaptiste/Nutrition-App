<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Weight;
use App\Repository\WeightRepository;
use Symfony\Bundle\SecurityBundle\Security;

class WeightStateProvider implements ProviderInterface
{
    public function __construct(
        private WeightRepository $weightRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        // Si c'est une collection (GET /api/v1/weights)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            return $this->weightRepository->findBy(['user' => $user], ['date' => 'DESC']);
        }

        // Si c'est un élément spécifique (GET /api/v1/weights/{id})
        if (isset($uriVariables['id'])) {
            $weight = $this->weightRepository->find($uriVariables['id']);
            
            // Vérifier que la pesée appartient à l'utilisateur connecté
            if ($weight && $weight->getUser() === $user) {
                return $weight;
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
