<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250719154510 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE constitute CHANGE food_id food_id INT DEFAULT NULL, CHANGE dish_id dish_id INT DEFAULT NULL, CHANGE food_quantity food_quantity DOUBLE PRECISION DEFAULT NULL, CHANGE dish_quantity dish_quantity DOUBLE PRECISION DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE constitute CHANGE food_id food_id INT NOT NULL, CHANGE dish_id dish_id INT NOT NULL, CHANGE food_quantity food_quantity DOUBLE PRECISION NOT NULL, CHANGE dish_quantity dish_quantity DOUBLE PRECISION NOT NULL');
    }
}
