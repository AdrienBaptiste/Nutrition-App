<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\WeightRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: WeightRepository::class)]
#[ApiResource(
    uriTemplate: '/v1/weights',
    operations: [
        new GetCollection(),
        new Post(),
        new Get(uriTemplate: '/v1/weights/{id}'),
        new Put(uriTemplate: '/v1/weights/{id}'),
        new Delete(uriTemplate: '/v1/weights/{id}')
    ],
    normalizationContext: ['groups' => ['weight:read']],
    denormalizationContext: ['groups' => ['weight:write']],
    security: 'is_granted("ROLE_USER")',
    securityMessage: 'Access denied.'
)]
class Weight
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['weight:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['weight:read', 'weight:write'])]
    private ?float $value = null;

    #[ORM\Column]
    #[Groups(['weight:read', 'weight:write'])]
    private ?\DateTime $date = null;

    #[ORM\ManyToOne(inversedBy: 'weights')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['weight:read'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getValue(): ?float
    {
        return $this->value;
    }

    public function setValue(float $value): static
    {
        $this->value = $value;

        return $this;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTime $date): static
    {
        $this->date = $date;

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
