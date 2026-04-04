<?php

namespace App\Http\Controllers;

use App\Http\Resources\LikeResource;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LikeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $items = Like::with(['post.user.profile'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $items->each(function ($like) {
            if ($like->post) {
                $like->post->likes_count = $like->post->likes()->count();
                $like->post->is_liked = true;
            }
        });

        return response()->json([
            'success' => true,
            'data' => LikeResource::collection($items),
        ]);
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('like-post', $post);

        $exists = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'この投稿にはすでにいいね済みです',
            ], 422);
        }

        Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'いいねしました',
        ], 201);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        $like = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if (! $like) {
            return response()->json([
                'success' => false,
                'message' => 'いいねが見つかりません',
            ], 404);
        }

        $like->delete();

        return response()->json([
            'success' => true,
            'message' => 'いいねを解除しました',
        ]);
    }
}