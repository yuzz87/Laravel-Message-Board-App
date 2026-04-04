<?php
use App\Http\Controllers\LikeController;
use App\Http\Controllers\SavedPostController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 公開
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/users/{user}', [ProfileController::class, 'show']);
Route::get('/users/{user}/posts', [PostController::class, 'userPosts']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/profile', [ProfileController::class, 'me']);
    Route::patch('/profile', [ProfileController::class, 'updateMe']);

    Route::get('/my/posts', [PostController::class, 'myPosts']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::patch('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    Route::get('/me/saved-posts', [SavedPostController::class, 'index']);
    Route::post('/posts/{post}/save', [SavedPostController::class, 'store']);
    Route::delete('/posts/{post}/save', [SavedPostController::class, 'destroy']);
    Route::get('/me/liked-posts', [LikeController::class, 'index']);
    Route::post('/posts/{post}/like', [LikeController::class, 'store']);
    Route::delete('/posts/{post}/like', [LikeController::class, 'destroy']);
    
});