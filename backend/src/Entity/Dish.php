<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\DishRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DishRepository::class)]
#[ApiResource(
    uriTemplate: '/v1/dishes',
    operations: [
        new GetCollection(),
        new Post(),
        new Get(uriTemplate: '/v1/dishes/{id}'),
        new Put(uriTemplate: '/v1/dishes/{id}'),
        new Delete(uriTemplate: '/v1/dishes/{id}')
    ],
    formats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
    normalizationContext: ['groups' => ['dish:read']],
    denormalizationContext: ['groups' => ['dish:write']],
    security: 'is_granted("ROLE_USER")',
    securityMessage: 'Access denied.',
    provider: 'App\\State\\DishStateProvider',
    processor: 'App\\State\\DishStateProcessor'
)]
class Dish
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['dish:read', 'dish:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['dish:read', 'dish:write'])]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'dishes')]
    #[Groups(['dish:read'])]
    private ?User $user = null;

    /**
     * @var Collection<int, Contain>
     */
    #[ORM\OneToMany(targetEntity: Contain::class, mappedBy: 'dish')]
    #[Groups(['dish:read'])]
    private Collection $contains;

    /**
     * @var Collection<int, Constitute>
     */
    #[ORM\OneToMany(targetEntity: Constitute::class, mappedBy: 'dish')]
    #[Groups(['dish:read'])]
    private Collection $constitutes;

    public function __construct()
    {
        $this->contains = new ArrayCollection();
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
     * @return Collection<int, Contain>
     */
    public function getContains(): Collection
    {
        return $this->contains;
    }

    public function addContain(Contain $contain): static
    {
        if (!$this->contains->contains($contain)) {
            $this->contains->add($contain);
            $contain->setDish($this);
        }

        return $this;
    }

    public function removeContain(Contain $contain): static
    {
        if ($this->contains->removeElement($contain)) {
            if ($contain->getDish() === $this) {
                $contain->setDish(null);
            }
        }

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
            $constitute->setDish($this);
        }

        return $this;
    }

    public function removeConstitute(Constitute $constitute): static
    {
        if ($this->constitutes->removeElement($constitute)) {
            if ($constitute->getDish() === $this) {
                $constitute->setDish(null);
            }
        }

        return $this;
    }
}
