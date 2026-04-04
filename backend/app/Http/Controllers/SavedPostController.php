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

        $items = SavedPost::with(['post.user.profile'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => SavedPostResource::collection($items),
        ]);
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        Gate::authorize('save-post', $post);

        $exists = SavedPost::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'この投稿はすでに保存済みです',
            ], 422);
        }

        SavedPost::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => '投稿を保存しました',
        ], 201);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        $user = $request->user();

        $savedPost = SavedPost::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if (! $savedPost) {
            return response()->json([
                'success' => false,
                'message' => '保存データが見つかりません',
            ], 404);
        }

        $savedPost->delete();

        return response()->json([
            'success' => true,
            'message' => '保存を解除しました',
        ]);
    }
}