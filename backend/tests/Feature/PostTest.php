<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_public_posts(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $user->id,
            'display_name' => $user->name,
            'is_public' => true,
        ]);

        Post::factory()->create([
            'user_id' => $user->id,
            'body' => '公開投稿',
            'is_public' => true,
        ]);

        $response = $this->getJson('/api/posts');

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonFragment([
                'body' => '公開投稿',
            ]);
    }

    public function test_guest_cannot_view_private_post(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $user->id,
            'display_name' => $user->name,
            'is_public' => true,
        ]);

        $post = Post::factory()->create([
            'user_id' => $user->id,
            'is_public' => false,
        ]);

        $response = $this->getJson("/api/posts/{$post->id}");

        $response->assertStatus(404);
    }

    public function test_owner_can_view_own_private_post(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $user->id,
            'display_name' => $user->name,
            'is_public' => false,
        ]);

        $post = Post::factory()->create([
            'user_id' => $user->id,
            'body' => '自分の非公開投稿',
            'is_public' => false,
        ]);

        $response = $this->actingAs($user)->getJson("/api/posts/{$post->id}");

        $response
            ->assertOk()
            ->assertJsonPath('data.body', '自分の非公開投稿');
    }

    public function test_other_user_cannot_view_private_post(): void
    {
        /** @var \App\Models\User $owner */
        $owner = User::factory()->create();

        /** @var \App\Models\User $other */
        $other = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $owner->id,
            'display_name' => $owner->name,
            'is_public' => false,
        ]);

        $post = Post::factory()->create([
            'user_id' => $owner->id,
            'is_public' => false,
        ]);

        $response = $this->actingAs($other)->getJson("/api/posts/{$post->id}");

        $response->assertStatus(403);
    }
}