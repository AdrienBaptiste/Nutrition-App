<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Constitute;
use App\Entity\User;
use App\Repository\ConstituteRepository;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<Constitute>
 */
class ConstituteStateProvider implements ProviderInterface
{
    public function __construct(
        private ConstituteRepository $constituteRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        // Si c'est une collection (GET /api/v1/constitutes)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            // Récupérer les relations Constitute où le repas appartient à l'utilisateur
            return $this->constituteRepository->createQueryBuilder('c')
                ->join('c.meal', 'm')
                ->where('m.user = :user')
                ->setParameter('user', $user instanceof User ? $user : null)
                ->getQuery()
                ->getResult();
        }

        // Si c'est un élément spécifique (GET /api/v1/constitutes/{id})
        if (isset($uriVariables['id'])) {
            $constitute = $this->constituteRepository->find($uriVariables['id']);
            
            // Vérifier que le repas appartient à l'utilisateur connecté
            if ($constitute && $user instanceof User && $constitute->getMeal()->getUser() === $user) {
                return $constitute;
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
