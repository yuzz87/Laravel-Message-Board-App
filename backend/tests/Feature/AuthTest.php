<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_successfully(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonPath('data.user.name', 'testuser')
            ->assertJsonPath('data.user.email', 'test@example.com');

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        $this->assertDatabaseHas('profiles', [
            'display_name' => 'testuser',
            'is_public' => true,
        ]);
    }
    public function test_login_successfully(): void

    {
        $this->postJson('/api/register', [
            'name' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user',
                    'token',
                ],
            ]);
    }
    public function test_guest_cannot_access_protected_api(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }
}