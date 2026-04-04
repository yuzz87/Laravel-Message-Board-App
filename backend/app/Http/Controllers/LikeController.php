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

        $items = Like::with([
                'post' => function ($query) {
                    $query->with(['user.profile'])->withCount('likes');
                },
            ])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        $items->getCollection()->each(function ($like) {
            if ($like->post) {
                $like->post->is_liked = true;
            }
        });

        return $this->paginatedResponse(
            LikeResource::collection($items)
        );
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('like-post', $post);

        $exists = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();

        if ($exists) {
            return $this->errorResponse('この投稿にはすでにいいね済みです', 422);
        }

        Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        return $this->successResponse(null, 'いいねしました', 201);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        $like = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if (! $like) {
            return $this->errorResponse('いいねが見つかりません', 404);
        }

        $like->delete();

        return $this->successResponse(null, 'いいねを解除しました');
    }
}