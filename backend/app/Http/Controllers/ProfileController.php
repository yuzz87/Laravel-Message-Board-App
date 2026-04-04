<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // 自分のプロフィール取得
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->load('profile')->profile,
        ]);
    }

    // 自分のプロフィール更新
    public function updateMe(UpdateProfileRequest $request)
    {
        $profile = $request->user()->profile;

        $this->authorize('update', $profile);

        $profile->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    // 他人プロフィール取得
    public function show(Request $request, User $user)
    {
        $profile = $user->profile;

        if (! $profile) {
            return response()->json([
                'success' => false,
                'message' => 'プロフィールが見つかりません',
            ], 404);
        }

        if ($request->user()) {
            $this->authorize('view', $profile);
        } elseif (! $profile->is_public) {
            return response()->json([
                'success' => false,
                'message' => 'プロフィールが見つかりません',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profile->load('user:id,name,email'),
        ]);
    }
}