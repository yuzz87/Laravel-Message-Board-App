<?php

namespace App\Http\Controllers;

use App\Http\Resources\SavedPostResource;
use App\Models\Post;
use App\Models\SavedPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SavedPostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $items = SavedPost::with([
                'post' => function ($query) {
                    $query->with(['user.profile'])->withCount('likes');
                },
            ])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        $likedPostIds = $user->likes()->pluck('post_id')->all();
        $likedPostIdsMap = array_flip($likedPostIds);

        $items->getCollection()->each(function ($savedPost) use ($likedPostIdsMap) {
            if ($savedPost->post) {
                $savedPost->post->is_liked = isset($likedPostIdsMap[$savedPost->post->id]);
            }
        });

        return $this->paginatedResponse(
            SavedPostResource::collection($items)
        );
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('save-post', $post);

        $exists = SavedPost::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();

        if ($exists) {
            return $this->errorResponse('この投稿はすでに保存済みです', 422);
        }

        SavedPost::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        return $this->successResponse(null, '投稿を保存しました', 201);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        $savedPost = SavedPost::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if (! $savedPost) {
            return $this->errorResponse('保存データが見つかりません', 404);
        }

        $savedPost->delete();

        return $this->successResponse(null, '保存を解除しました');
    }
}