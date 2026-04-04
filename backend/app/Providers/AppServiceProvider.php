<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('save-post', function (User $user, Post $post) {
            // 自分の投稿も保存できる仕様
            if ($post->user_id === $user->id) {
                return true;
            }

            $post->loadMissing('user.profile');

            return optional($post->user->profile)->is_public === true
                && $post->is_public === true;
        });

        Gate::define('like-post', function (User $user, Post $post) {
            // 自分の投稿にもいいねできる仕様
            if ($post->user_id === $user->id) {
                return true;
            }

            $post->loadMissing('user.profile');

            return optional($post->user->profile)->is_public === true
                && $post->is_public === true;
        });
    }
}