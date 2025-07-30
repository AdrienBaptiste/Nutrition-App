<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserInput
{
    #[Assert\NotBlank(message: 'Un email est requis')]
    #[Assert\Email(message: 'Un email est requis')]
    public string $email;

    #[Assert\NotBlank(message: 'Un mot de passe est requis')]
    #[Assert\Length(min: 8, minMessage: 'Le mot de passe doit faire au moins 8 caractères')]
    #[Assert\Regex(
        pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/',
        message: 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
    )]
    public string $password;

    #[Assert\NotBlank(message: 'Un nom est requis')]
    public string $name;
}
