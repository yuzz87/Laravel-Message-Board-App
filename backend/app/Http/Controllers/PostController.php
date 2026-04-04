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
            ->paginate(10);

        $likedPostIds = $authUser
            ? $authUser->likes()->pluck('post_id')->all()
            : [];

        $likedPostIdsMap = array_flip($likedPostIds);

        $posts->getCollection()->transform(function ($post) use ($likedPostIdsMap) {
            $post->is_liked = isset($likedPostIdsMap[$post->id]);
            return $post;
        });

        return $this->paginatedResponse(
            PostSummaryResource::collection($posts)
        );
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
                return $this->errorResponse('投稿が見つかりません', 404);
            }
        }

        $authUser = $request->user();

        $post->is_liked = $authUser
            ? $authUser->likes()->where('post_id', $post->id)->exists()
            : false;

        return $this->successResponse(new PostSummaryResource($post));
    }

    public function myPosts(Request $request)
    {
        $user = $request->user();

        $posts = Post::with(['user.profile'])
            ->where('user_id', $user->id)
            ->withCount('likes')
            ->latest()
            ->paginate(10);

        $likedPostIds = $user->likes()->pluck('post_id')->all();
        $likedPostIdsMap = array_flip($likedPostIds);

        $posts->getCollection()->transform(function ($post) use ($likedPostIdsMap) {
            $post->is_liked = isset($likedPostIdsMap[$post->id]);
            return $post;
        });

        return $this->paginatedResponse(
            PostSummaryResource::collection($posts)
        );
    }

    public function userPosts(Request $request, User $user)
    {
        $user->load('profile');

        $profile = $user->profile;

        if (! $profile) {
            return $this->errorResponse('プロフィールが見つかりません', 404);
        }

        $authUser = $request->user();

        if ($authUser && $authUser->id === $user->id) {
            $posts = $user->posts()
                ->with(['user.profile'])
                ->withCount('likes')
                ->latest()
                ->paginate(10);

            $likedPostIds = $authUser->likes()->pluck('post_id')->all();
            $likedPostIdsMap = array_flip($likedPostIds);

            $posts->getCollection()->transform(function ($post) use ($likedPostIdsMap) {
                $post->is_liked = isset($likedPostIdsMap[$post->id]);
                return $post;
            });

            return $this->paginatedResponse(
                PostSummaryResource::collection($posts)
            );
        }

        if (! $profile->is_public) {
            return $this->errorResponse('このユーザーの投稿は見つかりません', 404);
        }

        $posts = $user->posts()
            ->with(['user.profile'])
            ->where('is_public', true)
            ->withCount('likes')
            ->latest()
            ->paginate(10);

        $likedPostIds = $authUser
            ? $authUser->likes()->pluck('post_id')->all()
            : [];

        $likedPostIdsMap = array_flip($likedPostIds);

        $posts->getCollection()->transform(function ($post) use ($likedPostIdsMap) {
            $post->is_liked = isset($likedPostIdsMap[$post->id]);
            return $post;
        });

        return $this->paginatedResponse(
            PostSummaryResource::collection($posts)
        );
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

        return $this->successResponse(new PostSummaryResource($post), null, 201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());

        $post->load(['user.profile']);
        $post->loadCount('likes');

        $authUser = $request->user();
        $post->is_liked = $authUser
            ? $authUser->likes()->where('post_id', $post->id)->exists()
            : false;

        return $this->successResponse(new PostSummaryResource($post));
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return $this->successResponse(null, '投稿を削除しました');
    }
}