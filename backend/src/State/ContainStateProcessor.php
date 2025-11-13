<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Contain;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProcessorInterface<Contain, Contain|null>
 */
class ContainStateProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $user = $this->security->getUser();
        
        if (!$user || !$data instanceof Contain) {
            throw new \RuntimeException('Access denied');
        }
        if (!$user instanceof User) {
            throw new \RuntimeException('Access denied');
        }

        // Pour les créations (POST)
        if ($operation instanceof \ApiPlatform\Metadata\Post) {
            // Vérifier que le plat et l'aliment appartiennent à l'utilisateur connecté
            if ($data->getDish()->getUser() !== $user || $data->getFood()->getUser() !== $user) {
                throw new \RuntimeException('Access denied: You can only link your own foods and dishes');
            }
        }

        // Pour les modifications (PUT/PATCH)
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            // Vérifier que le plat appartient à l'utilisateur connecté
            if ($data->getDish()->getUser() !== $user) {
                throw new \RuntimeException('Access denied');
            }
        }

        // Pour les suppressions (DELETE)
        if ($operation instanceof \ApiPlatform\Metadata\Delete) {
            if ($data->getDish()->getUser() !== $user) {
                throw new \RuntimeException('Access denied');
            }
            $this->entityManager->remove($data);
            $this->entityManager->flush();
            return null;
        }

        // Sauvegarder les modifications
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
