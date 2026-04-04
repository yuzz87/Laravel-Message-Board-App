<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => '入力内容に誤りがあります',
                'errors' => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $e, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => '認証が必要です',
            ], 401);
        });

        $exceptions->render(function (AuthorizationException $e, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'この操作は許可されていません',
            ], 403);
        });

        $exceptions->render(function (ModelNotFoundException $e, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            return response()->json([
                'success' => false,
                'message' => 'データが見つかりません',
            ], 404);
        });

        $exceptions->render(function (HttpExceptionInterface $e, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            $status = $e->getStatusCode();

            $message = match ($status) {
                404 => 'データが見つかりません',
                405 => '許可されていないメソッドです',
                429 => 'リクエストが多すぎます。しばらく待ってから再試行してください',
                default => 'リクエストを処理できませんでした',
            };

            return response()->json([
                'success' => false,
                'message' => $message,
            ], $status);
        });

        $exceptions->render(function (Throwable $e, $request) {
            if (! $request->expectsJson()) {
                return null;
            }

            report($e);

            return response()->json([
                'success' => false,
                'message' => 'サーバーエラーが発生しました',
            ], 500);
        });
    })->create();