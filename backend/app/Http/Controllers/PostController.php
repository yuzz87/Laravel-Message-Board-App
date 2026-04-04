<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostSummaryResource;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $posts = Post::with(['user.profile'])
            ->where('is_public', true)
            ->whereHas('user.profile', function ($query) {
                $query->where('is_public', true);
            })
            ->withCount('likes')
            ->latest()
            ->get();

        $posts->each(function ($post) use ($authUser) {
            $post->is_liked = $authUser
                ? $post->likes()->where('user_id', $authUser->id)->exists()
                : false;
        });

        return response()->json([
            'success' => true,
            'data' => PostSummaryResource::collection($posts),
        ]);
    }

    public function show(Request $request, Post $post)
    {
        $post->load(['user.profile']);
        $post->loadCount('likes');

        if ($request->user()) {
            $this->authorize('view', $post);
        } else {
            $profile = $post->user?->profile;

            if (! $profile || ! $profile->is_public || ! $post->is_public) {
                return response()->json([
                    'success' => false,
                    'message' => '投稿が見つかりません',
                ], 404);
            }
        }

        $authUser = $request->user();

        $post->is_liked = $authUser
            ? $post->likes()->where('user_id', $authUser->id)->exists()
            : false;

        return response()->json([
            'success' => true,
            'data' => new PostSummaryResource($post),
        ]);
    }

    public function myPosts(Request $request)
    {
        $user = $request->user();

        $posts = Post::with(['user.profile'])
            ->where('user_id', $user->id)
            ->withCount('likes')
            ->latest()
            ->get();

        $posts->each(function ($post) use ($user) {
            $post->is_liked = $post->likes()->where('user_id', $user->id)->exists();
        });

        return response()->json([
            'success' => true,
            'data' => PostSummaryResource::collection($posts),
        ]);
    }

    public function userPosts(Request $request, User $user)
    {
        $user->load('profile');

        $profile = $user->profile;

        if (! $profile) {
            return response()->json([
                'success' => false,
                'message' => 'プロフィールが見つかりません',
            ], 404);
        }

        $authUser = $request->user();

        if ($authUser && $authUser->id === $user->id) {
            $posts = $user->posts()
                ->with(['user.profile'])
                ->withCount('likes')
                ->latest()
                ->get();

            $posts->each(function ($post) use ($authUser) {
                $post->is_liked = $post->likes()->where('user_id', $authUser->id)->exists();
            });

            return response()->json([
                'success' => true,
                'data' => PostSummaryResource::collection($posts),
            ]);
        }

        if (! $profile->is_public) {
            return response()->json([
                'success' => false,
                'message' => 'ユーザーの投稿が見つかりません',
            ], 404);
        }

        $posts = $user->posts()
            ->with(['user.profile'])
            ->where('is_public', true)
            ->withCount('likes')
            ->latest()
            ->get();

        $posts->each(function ($post) use ($authUser) {
            $post->is_liked = $authUser
                ? $post->likes()->where('user_id', $authUser->id)->exists()
                : false;
        });

        return response()->json([
            'success' => true,
            'data' => PostSummaryResource::collection($posts),
        ]);
    }

    public function store(StorePostRequest $request)
    {
        $this->authorize('create', Post::class);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'body' => $request->validated()['body'],
            'is_public' => $request->validated()['is_public'],
        ]);

        $post->load(['user.profile']);
        $post->loadCount('likes');
        $post->is_liked = false;

        return response()->json([
            'success' => true,
            'data' => new PostSummaryResource($post),
        ], 201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());

        $post->load(['user.profile']);
        $post->loadCount('likes');

        $authUser = $request->user();
        $post->is_liked = $authUser
            ? $post->likes()->where('user_id', $authUser->id)->exists()
            : false;

        return response()->json([
            'success' => true,
            'data' => new PostSummaryResource($post),
        ]);
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => '投稿を削除しました',
        ]);
    }
}