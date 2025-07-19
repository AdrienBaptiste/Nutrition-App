<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\ContainRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContainRepository::class)]
#[ApiResource(
    uriTemplate: '/v1/contains',
    operations: [
        new GetCollection(),
        new Post(),
        new Get(uriTemplate: '/v1/contains/{id}'),
        new Put(uriTemplate: '/v1/contains/{id}'),
        new Delete(uriTemplate: '/v1/contains/{id}')
    ],
    formats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
    normalizationContext: ['groups' => ['contain:read']],
    denormalizationContext: ['groups' => ['contain:write']],
    security: 'is_granted("ROLE_USER")',
    securityMessage: 'Access denied.',
    provider: 'App\\State\\ContainStateProvider',
    processor: 'App\\State\\ContainStateProcessor'
)]
class Contain
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['contain:read', 'contain:write'])]
    private ?Food $food = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['contain:read', 'contain:write'])]
    private ?Dish $dish = null;

    #[ORM\Column]
    #[Groups(['contain:read', 'contain:write'])]
    private ?float $quantity = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFood(): ?Food
    {
        return $this->food;
    }

    public function setFood(?Food $food): static
    {
        $this->food = $food;

        return $this;
    }

    public function getDish(): ?Dish
    {
        return $this->dish;
    }

    public function setDish(?Dish $dish): static
    {
        $this->dish = $dish;

        return $this;
    }

    public function getQuantity(): ?float
    {
        return $this->quantity;
    }

    public function setQuantity(float $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }
}
