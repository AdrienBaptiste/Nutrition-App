<?php

declare(strict_types=1);

namespace App\Tests\Smoke;

use PHPUnit\Framework\TestCase;

final class HealthCheckTest extends TestCase
{
    public function testTruth(): void
    {
        $this->assertTrue(true);
    }
}
