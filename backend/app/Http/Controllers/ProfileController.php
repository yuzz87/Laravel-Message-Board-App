<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        return $this->successResponse(
            new ProfileResource($request->user()->load('profile.user')->profile)
        );
    }

    public function updateMe(UpdateProfileRequest $request)
    {
        $profile = $request->user()->profile;

        $this->authorize('update', $profile);

        $profile->update($request->validated());
        $profile->load('user');

        return $this->successResponse(new ProfileResource($profile));
    }

    public function show(Request $request, User $user)
    {
        $profile = $user->profile;

        if (! $profile) {
            return $this->errorResponse('プロフィールが見つかりません', 404);
        }

        if ($request->user()) {
            $this->authorize('view', $profile);
        } elseif (! $profile->is_public) {
            return $this->errorResponse('プロフィールが見つかりません', 404);
        }

        $profile->load('user');

        return $this->successResponse(new ProfileResource($profile));
    }
}