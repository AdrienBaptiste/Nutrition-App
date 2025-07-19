<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\MealRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MealRepository::class)]
#[ApiResource(
    uriTemplate: '/v1/meals',
    operations: [
        new GetCollection(),
        new Post(),
        new Get(uriTemplate: '/v1/meals/{id}'),
        new Put(uriTemplate: '/v1/meals/{id}'),
        new Delete(uriTemplate: '/v1/meals/{id}')
    ],
    formats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
    normalizationContext: ['groups' => ['meal:read']],
    denormalizationContext: ['groups' => ['meal:write']],
    security: 'is_granted("ROLE_USER")',
    securityMessage: 'Access denied.',
    provider: 'App\State\MealStateProvider',
    processor: 'App\State\MealStateProcessor'
)]
class Meal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['meal:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['meal:read', 'meal:write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['meal:read', 'meal:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['meal:read', 'meal:write'])]
    private ?\DateTime $date = null;

    #[ORM\ManyToOne(inversedBy: 'meals')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['meal:read'])]
    private ?User $user = null;

    /**
     * @var Collection<int, Constitute>
     */
    #[ORM\OneToMany(targetEntity: Constitute::class, mappedBy: 'meal')]
    #[Groups(['meal:read'])]
    private Collection $constitutes;

    public function __construct()
    {
        $this->constitutes = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Constitute>
     */
    public function getConstitutes(): Collection
    {
        return $this->constitutes;
    }

    public function addConstitute(Constitute $constitute): static
    {
        if (!$this->constitutes->contains($constitute)) {
            $this->constitutes->add($constitute);
            $constitute->setMeal($this);
        }

        return $this;
    }

    public function removeConstitute(Constitute $constitute): static
    {
        if ($this->constitutes->removeElement($constitute)) {
            if ($constitute->getMeal() === $this) {
                $constitute->setMeal(null);
            }
        }

        return $this;
    }
}
