<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavedPostTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_save_post(): void
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

        $response = $this->actingAs($user)->postJson("/api/posts/{$post->id}/save");

        $response
            ->assertStatus(201)
            ->assertJsonPath('message', '投稿を保存しました');

        $this->assertDatabaseHas('saved_posts', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_user_cannot_save_same_post_twice(): void
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

        $this->actingAs($user)->postJson("/api/posts/{$post->id}/save");

        $response = $this->actingAs($user)->postJson("/api/posts/{$post->id}/save");

        $response
            ->assertStatus(422)
            ->assertJsonPath('message', 'この投稿はすでに保存済みです');
    }

    public function test_user_can_unsave_post(): void
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

        $this->actingAs($user)->postJson("/api/posts/{$post->id}/save");

        $response = $this->actingAs($user)->deleteJson("/api/posts/{$post->id}/save");

        $response
            ->assertOk()
            ->assertJsonPath('message', '保存を解除しました');

        $this->assertDatabaseMissing('saved_posts', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_user_can_get_saved_posts(): void
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
            'body' => '保存対象投稿',
            'is_public' => true,
        ]);

        $this->actingAs($user)->postJson("/api/posts/{$post->id}/save");

        $response = $this->actingAs($user)->getJson('/api/me/saved-posts');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.body', '保存対象投稿')
            ->assertJsonPath('data.0.is_liked', false);
    }
}
