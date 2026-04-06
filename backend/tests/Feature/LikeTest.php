<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_like_post(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        /** @var \App\Models\User $owner */
        $owner = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $owner->id,
            'display_name' => $owner->name,
            'is_public' => true,
        ]);

        $post = Post::factory()->create([
            'user_id' => $owner->id,
            'is_public' => true,
        ]);

        $response = $this->actingAs($user)->postJson("/api/posts/{$post->id}/like");

        $response
            ->assertStatus(201)
            ->assertJsonPath('message', 'いいねしました');

        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_user_cannot_like_same_post_twice(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        /** @var \App\Models\User $owner */
        $owner = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $owner->id,
            'display_name' => $owner->name,
            'is_public' => true,
        ]);

        $post = Post::factory()->create([
            'user_id' => $owner->id,
            'is_public' => true,
        ]);

        $this->actingAs($user)->postJson("/api/posts/{$post->id}/like");

        $response = $this->actingAs($user)->postJson("/api/posts/{$post->id}/like");

        $response
            ->assertStatus(422)
            ->assertJsonPath('message', 'この投稿にはすでにいいね済みです');
    }

    public function test_user_can_unlike_post(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        /** @var \App\Models\User $owner */
        $owner = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $owner->id,
            'display_name' => $owner->name,
            'is_public' => true,
        ]);

        $post = Post::factory()->create([
            'user_id' => $owner->id,
            'is_public' => true,
        ]);

        $this->actingAs($user)->postJson("/api/posts/{$post->id}/like");

        $response = $this->actingAs($user)->deleteJson("/api/posts/{$post->id}/like");

        $response
            ->assertOk()
            ->assertJsonPath('message', 'いいねを解除しました');

        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_user_can_get_liked_posts(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        /** @var \App\Models\User $owner */
        $owner = User::factory()->create();

        Profile::factory()->create([
            'user_id' => $owner->id,
            'display_name' => $owner->name,
            'is_public' => true,
        ]);

        $post = Post::factory()->create([
            'user_id' => $owner->id,
            'body' => 'いいね対象投稿',
            'is_public' => true,
        ]);

        $this->actingAs($user)->postJson("/api/posts/{$post->id}/like");

        $response = $this->actingAs($user)->getJson('/api/me/liked-posts');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.body', 'いいね対象投稿')
            ->assertJsonPath('data.0.is_liked', true);
    }
}
