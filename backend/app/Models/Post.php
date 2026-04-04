<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'body',
        'is_public',
    ];
    protected $casts = [
        'is_public'=>'boolean',
    ];
    // Eloquent のリレーション定義
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function savedPosts(){
        return $this->hasMany(SavedPost::class);
    }
    public function savedByUsers()
    {
    return $this->belongsToMany(User::class,'saved_posts')->withTimestamps();
    }
    public function likes()
    {
    return $this->hasMany(Like::class);
    }

    public function likedByUsers()
    {
    return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }
}
