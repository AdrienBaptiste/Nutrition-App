<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Food;
use App\Repository\FoodRepository;
use Symfony\Bundle\SecurityBundle\Security;

class FoodStateProvider implements ProviderInterface
{
    public function __construct(
        private FoodRepository $foodRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        $isAdmin = $this->security->isGranted('ROLE_ADMIN') || 
               $user->getEmail() === 'admin@nutrition.app' ||
               str_contains($user->getEmail(), 'admin');

        // Si c'est une collection (GET /api/v1/foods)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            // Vérifier si c'est pour "Mes propositions" via un paramètre de requête
            $includeMyProposals = isset($context['filters']['includeMyProposals']) && $context['filters']['includeMyProposals'] === 'true';
            
            if ($isAdmin) {
                // Admin voit tous les aliments (active + pending)
                return $this->foodRepository->findAll();
            } else {
                if ($includeMyProposals) {
                    // Page "Mes propositions" : aliments active + propositions pending de l'utilisateur
                    $qb = $this->foodRepository->createQueryBuilder('f')
                        ->where('f.status = :active')
                        ->orWhere('f.status = :pending AND f.user = :user')
                        ->setParameter('active', 'active')
                        ->setParameter('pending', 'pending')
                        ->setParameter('user', $user)
                        ->orderBy('f.name', 'ASC');
                    
                    return $qb->getQuery()->getResult();
                } else {
                    // Page "Foods" (base commune) : SEULEMENT les aliments active
                    $qb = $this->foodRepository->createQueryBuilder('f')
                        ->where('f.status = :active')
                        ->setParameter('active', 'active')
                        ->orderBy('f.name', 'ASC');
                    
                    return $qb->getQuery()->getResult();
                }
            }
        }

        // Si c'est un élément spécifique (GET /api/v1/foods/{id})
        if (isset($uriVariables['id'])) {
            $food = $this->foodRepository->find($uriVariables['id']);
            
            if (!$food) {
                return null;
            }
            
            if ($isAdmin) {
                // Admin peut voir tous les aliments
                return $food;
            } else {
                // Utilisateur normal peut voir :
                // 1. Les aliments validés (status = 'active')
                // 2. Ses propres propositions (status = 'pending' + user = current_user)
                if ($food->getStatus() === 'active' || 
                    ($food->getStatus() === 'pending' && $food->getUser() === $user)) {
                    return $food;
                }
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
