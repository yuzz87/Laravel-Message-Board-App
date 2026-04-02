<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // 一覧取得
    public function index()
    {
        $posts = Post::latest()->get();

        return response()->json($posts);
    }

    // 1件取得
    public function show($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        return response()->json($post);
    }

    // 作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'body' => ['required', 'string'],
            'is_public' => ['required', 'boolean'],
        ]);

        $post = Post::create([
            'user_id' => null,
            'body' => $validated['body'],
            'is_public' => $validated['is_public'],
        ]);

        return response()->json($post, 201);
    }

    // 削除
    public function destroy($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ]);
    }
}