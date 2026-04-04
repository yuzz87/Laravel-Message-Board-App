<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

abstract class Controller
{
    use AuthorizesRequests;

    protected function successResponse(
        mixed $data = null,
        ?string $message = null,
        int $status = 200
    ): JsonResponse {
        $response = [
            'success' => true,
        ];

        if (! is_null($data)) {
            $response['data'] = $data;
        }

        if (! is_null($message)) {
            $response['message'] = $message;
        }

        return response()->json($response, $status);
    }

    protected function errorResponse(
        string $message,
        int $status = 400,
        ?array $errors = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (! is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    protected function paginatedResponse(
        AnonymousResourceCollection $resource,
        int $status = 200
    ): JsonResponse {
        $response = $resource->response()->getData(true);
        $response['success'] = true;

        return response()->json($response, $status);
    }
}