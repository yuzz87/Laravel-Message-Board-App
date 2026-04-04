# FormApp Backend

## 概要

Laravel で作成した FormApp のバックエンドです。  
ユーザー認証、プロフィール管理、投稿機能、保存機能、いいね機能を実装しています。

---

## 主な機能

- ユーザー登録
- ログイン / ログアウト
- 自分情報取得
- プロフィール表示 / 更新
- 投稿一覧 / 投稿詳細
- 自分の投稿一覧
- 他ユーザーの投稿一覧
- 投稿作成 / 更新 / 削除
- 投稿の保存 / 保存解除
- 保存一覧取得
- 投稿のいいね / いいね解除
- いいね一覧取得
- 公開 / 非公開プロフィール制御
- 公開 / 非公開投稿制御

---

## 使用技術

- PHP
- Laravel
- Laravel Sanctum
- MySQL
- Postman
- PHPUnit / Feature Test

---

## API 一覧

### Auth

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`

### Profile

- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/users/{user}`

### Post

- `GET /api/posts`
- `GET /api/posts/{post}`
- `GET /api/my/posts`
- `GET /api/users/{user}/posts`
- `POST /api/posts`
- `PATCH /api/posts/{post}`
- `DELETE /api/posts/{post}`

### SavedPost

- `GET /api/me/saved-posts`
- `POST /api/posts/{post}/save`
- `DELETE /api/posts/{post}/save`

### Like

- `GET /api/me/liked-posts`
- `POST /api/posts/{post}/like`
- `DELETE /api/posts/{post}/like`

---

## 認証

認証が必要な API は `auth:sanctum` を使用しています。  
ログイン後に発行されたトークンを Bearer Token として送信します。

例:

```http
Authorization: Bearer {token}
```

---

認可ルール
プロフィール
公開プロフィールは誰でも閲覧可能
非公開プロフィールは本人のみ閲覧可能
投稿
公開投稿は誰でも閲覧可能
非公開投稿は本人のみ閲覧可能
非公開プロフィールのユーザー投稿は、本人以外は閲覧不可
SavedPost / Like
本人の投稿は許可設定に応じて保存 / いいね可能
他人の投稿は、公開プロフィールかつ公開投稿のみ保存 / いいね可能
レスポンス形式
成功
{
"success": true,
"data": {}
}

または

{
"success": true,
"message": "完了メッセージ"
}
失敗
{
"success": false,
"message": "エラーメッセージ"
}
バリデーション失敗
{
"success": false,
"message": "入力内容に誤りがあります",
"errors": {
"field": [
"..."
]
}
}
ページネーション

一覧 API はページネーション対応です。

{
"data": [],
"links": {},
"meta": {},
"success": true
}
Resource 設計

主な Resource は以下です。

AuthUserResource
ProfileResource
UserSummaryResource
PostSummaryResource
SavedPostResource
LikeResource

これにより、投稿一覧・保存一覧・いいね一覧で post の返却形式をできるだけ統一しています。

テスト

Feature Test を作成し、主要機能を検証しています。

実行コマンド
php artisan test
主なテスト対象
ユーザー登録
ログイン
保護 API の認証
公開 / 非公開投稿の閲覧制御
SavedPost の保存 / 重複保存 / 解除 / 一覧
Like の付与 / 重複いいね / 解除 / 一覧
セットアップ手順

1. リポジトリ取得
   git clone <repository-url>
   cd backend
2. 依存関係インストール
   composer install
3. 環境ファイル作成
   cp .env.example .env
4. アプリケーションキー生成
   php artisan key:generate
5. DB 設定

.env の MySQL 設定を修正してください。

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=formapp
DB_USERNAME=root
DB_PASSWORD= 6. マイグレーション実行
php artisan migrate 7. サーバー起動
php artisan serve
テスト用環境

Feature Test は testing 環境で実行します。
MySQL のテスト用 DB を .env.testing で分離しています。

例:

APP_ENV=testing
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=formapp_test
DB_USERNAME=root
DB_PASSWORD=
今後の改善予定
フロントエンドの作成と接続
README の API 仕様詳細化
UI 実装
本番デプロイ
