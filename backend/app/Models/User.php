<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 認証用 
use App\Models\Profile;
use App\Models\Post;
use App\Models\SavedPost;
use App\Models\Like;
// 簡単な書き方(attribute形式)
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    protected function casts(): array{
        return [
            'email_verified_at'=> 'datetime',
            'password'=> 'hashed',
        ];
    }
    // 一対多
    public function posts(){
        return $this->hasMany(Post::class);
    }
    // 一対一
    public function profile(){
        return $this->hasOne(Profile::class);
    }
    public function savedPosts(){
        return $this->hasMany(SavedPost::class);
    }
    public function savedPostItems(){
        return $this-> belongsToMany(Post::class,'saved_posts')->withTimestamps();
    }
    public function likes()
    {
    return $this->hasMany(Like::class);
    }

    public function likedPosts()
    {
    return $this->belongsToMany(Post::class, 'likes')->withTimestamps();
    }

}
