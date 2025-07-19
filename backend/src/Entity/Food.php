<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\FoodRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FoodRepository::class)]
#[ApiResource(
    uriTemplate: '/v1/foods',
    operations: [
        new GetCollection(),
        new Post(),
        new Get(uriTemplate: '/v1/foods/{id}'),
        new Put(uriTemplate: '/v1/foods/{id}'),
        new Delete(uriTemplate: '/v1/foods/{id}')
    ],
    formats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
    normalizationContext: ['groups' => ['food:read']],
    denormalizationContext: ['groups' => ['food:write']],
    security: 'is_granted("ROLE_USER")',
    securityMessage: 'Access denied.',
    provider: 'App\State\FoodStateProvider',
    processor: 'App\State\FoodStateProcessor'
)]
class Food
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['food:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['food:read', 'food:write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['food:read', 'food:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['food:read', 'food:write'])]
    private ?float $protein = null;

    #[ORM\Column]
    #[Groups(['food:read', 'food:write'])]
    private ?float $carbs = null;

    #[ORM\Column]
    #[Groups(['food:read', 'food:write'])]
    private ?float $fat = null;

    #[ORM\Column]
    #[Groups(['food:read', 'food:write'])]
    private ?float $calories = null;

    #[ORM\ManyToOne(inversedBy: 'foods')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['food:read'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getProtein(): ?float
    {
        return $this->protein;
    }

    public function setProtein(float $protein): static
    {
        $this->protein = $protein;

        return $this;
    }

    public function getCarbs(): ?float
    {
        return $this->carbs;
    }

    public function setCarbs(float $carbs): static
    {
        $this->carbs = $carbs;

        return $this;
    }

    public function getFat(): ?float
    {
        return $this->fat;
    }

    public function setFat(float $fat): static
    {
        $this->fat = $fat;

        return $this;
    }

    public function getCalories(): ?float
    {
        return $this->calories;
    }

    public function setCalories(float $calories): static
    {
        $this->calories = $calories;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
