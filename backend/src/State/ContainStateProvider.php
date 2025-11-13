<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Contain;
use App\Entity\User;
use App\Repository\ContainRepository;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<Contain>
 */
class ContainStateProvider implements ProviderInterface
{
    public function __construct(
        private ContainRepository $containRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        // Si c'est une collection (GET /api/v1/contains)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            // Récupérer les relations Contain où le plat appartient à l'utilisateur
            return $this->containRepository->createQueryBuilder('c')
                ->join('c.dish', 'd')
                ->where('d.user = :user')
                ->setParameter('user', $user instanceof User ? $user : null)
                ->getQuery()
                ->getResult();
        }

        // Si c'est un élément spécifique (GET /api/v1/contains/{id})
        if (isset($uriVariables['id'])) {
            $contain = $this->containRepository->find($uriVariables['id']);
            
            // Vérifier que le plat appartient à l'utilisateur connecté
            if ($contain && $user instanceof User && $contain->getDish()->getUser() === $user) {
                return $contain;
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
