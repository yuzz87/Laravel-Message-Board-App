<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Post $post): bool
    {
        if ($user && $user->id === $post->user_id) {
            return true;
        }

        $post->loadMissing('user.profile');

        $profile = $post->user?->profile;

        if (! $profile) {
            return false;
        }

        return $profile->is_public === true
            && $post->is_public === true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}