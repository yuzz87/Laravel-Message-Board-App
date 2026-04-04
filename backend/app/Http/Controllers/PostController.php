<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user:id,name', 'user.profile:id,user_id,is_public'])
            ->where('is_public', true)
            ->whereHas('user.profile', function ($query) {
                $query->where('is_public', true);
            })
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }

    public function show(Request $request, Post $post)
    {
        $post->load(['user:id,name', 'user.profile:id,user_id,is_public']);

        if ($request->user()) {
            $this->authorize('view', $post);
        } else {
            $profile = $post->user?->profile;

            if (! $profile || ! $profile->is_public || ! $post->is_public) {
                return response()->json([
                    'success' => false,
                    'message' => 'Post not found',
                ], 404);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $post,
        ]);
    }

    public function myPosts(Request $request)
    {
        $posts = Post::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }

    public function userPosts(Request $request, User $user)
    {
        $user->load('profile');

        $profile = $user->profile;

        if (! $profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found',
            ], 404);
        }

        $authUser = $request->user();

        // 本人なら公開/非公開すべて見られる
        if ($authUser && $authUser->id === $user->id) {
            $posts = $user->posts()
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $posts,
            ]);
        }

        // 他人・Guest はプロフィール公開が前提
        if (! $profile->is_public) {
            return response()->json([
                'success' => false,
                'message' => 'User posts not found',
            ], 404);
        }

        $posts = $user->posts()
            ->where('is_public', true)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $posts,
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

        return response()->json([
            'success' => true,
            'data' => $post,
        ], 201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $post,
        ]);
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully',
        ]);
    }
}