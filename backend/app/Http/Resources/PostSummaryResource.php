<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'is_public' => $this->is_public,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'likes_count' => $this->when(isset($this->likes_count), $this->likes_count),
            'is_liked' => $this->when(isset($this->is_liked), $this->is_liked),
            'user' => new UserSummaryResource($this->whenLoaded('user')),
        ];
    }
}