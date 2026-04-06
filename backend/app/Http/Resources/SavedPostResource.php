<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SavedPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $post = $this->whenLoaded('post');

        return [
            'id' => $post?->id,
            'body' => $post?->body,
            'is_public' => $post?->is_public,
            'created_at' => $post?->created_at,
            'updated_at' => $post?->updated_at,
            'likes_count' => $post?->likes_count,
            'is_liked' => (bool) ($post?->is_liked ?? false),
            'user' => $post && $post->relationLoaded('user')
                ? new UserSummaryResource($post->user)
                : null,
            'saved_at' => $this->created_at,
        ];
    }
}
