<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250715224634 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE constitute (id INT AUTO_INCREMENT NOT NULL, food_id INT NOT NULL, dish_id INT NOT NULL, meal_id INT NOT NULL, food_quantity DOUBLE PRECISION NOT NULL, dish_quantity DOUBLE PRECISION NOT NULL, INDEX IDX_861C0FF1BA8E87C4 (food_id), INDEX IDX_861C0FF1148EB0CB (dish_id), INDEX IDX_861C0FF1639666D6 (meal_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contain (id INT AUTO_INCREMENT NOT NULL, food_id INT NOT NULL, dish_id INT NOT NULL, quantity DOUBLE PRECISION NOT NULL, INDEX IDX_4BEFF7C8BA8E87C4 (food_id), INDEX IDX_4BEFF7C8148EB0CB (dish_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dish (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, name VARCHAR(50) NOT NULL, description VARCHAR(255) DEFAULT NULL, INDEX IDX_957D8CB8A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE food (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, name VARCHAR(50) NOT NULL, description LONGTEXT DEFAULT NULL, protein DOUBLE PRECISION NOT NULL, carbs DOUBLE PRECISION NOT NULL, fat DOUBLE PRECISION NOT NULL, calories DOUBLE PRECISION NOT NULL, INDEX IDX_D43829F7A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE meal (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, name VARCHAR(50) NOT NULL, description LONGTEXT DEFAULT NULL, date DATETIME NOT NULL, INDEX IDX_9EF68E9CA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(50) NOT NULL, role JSON NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE weight (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, value DOUBLE PRECISION NOT NULL, date DATETIME NOT NULL, INDEX IDX_7CD5541A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE constitute ADD CONSTRAINT FK_861C0FF1BA8E87C4 FOREIGN KEY (food_id) REFERENCES food (id)');
        $this->addSql('ALTER TABLE constitute ADD CONSTRAINT FK_861C0FF1148EB0CB FOREIGN KEY (dish_id) REFERENCES dish (id)');
        $this->addSql('ALTER TABLE constitute ADD CONSTRAINT FK_861C0FF1639666D6 FOREIGN KEY (meal_id) REFERENCES meal (id)');
        $this->addSql('ALTER TABLE contain ADD CONSTRAINT FK_4BEFF7C8BA8E87C4 FOREIGN KEY (food_id) REFERENCES food (id)');
        $this->addSql('ALTER TABLE contain ADD CONSTRAINT FK_4BEFF7C8148EB0CB FOREIGN KEY (dish_id) REFERENCES dish (id)');
        $this->addSql('ALTER TABLE dish ADD CONSTRAINT FK_957D8CB8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE food ADD CONSTRAINT FK_D43829F7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE meal ADD CONSTRAINT FK_9EF68E9CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE weight ADD CONSTRAINT FK_7CD5541A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE constitute DROP FOREIGN KEY FK_861C0FF1BA8E87C4');
        $this->addSql('ALTER TABLE constitute DROP FOREIGN KEY FK_861C0FF1148EB0CB');
        $this->addSql('ALTER TABLE constitute DROP FOREIGN KEY FK_861C0FF1639666D6');
        $this->addSql('ALTER TABLE contain DROP FOREIGN KEY FK_4BEFF7C8BA8E87C4');
        $this->addSql('ALTER TABLE contain DROP FOREIGN KEY FK_4BEFF7C8148EB0CB');
        $this->addSql('ALTER TABLE dish DROP FOREIGN KEY FK_957D8CB8A76ED395');
        $this->addSql('ALTER TABLE food DROP FOREIGN KEY FK_D43829F7A76ED395');
        $this->addSql('ALTER TABLE meal DROP FOREIGN KEY FK_9EF68E9CA76ED395');
        $this->addSql('ALTER TABLE weight DROP FOREIGN KEY FK_7CD5541A76ED395');
        $this->addSql('DROP TABLE constitute');
        $this->addSql('DROP TABLE contain');
        $this->addSql('DROP TABLE dish');
        $this->addSql('DROP TABLE food');
        $this->addSql('DROP TABLE meal');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE weight');
    }
}
