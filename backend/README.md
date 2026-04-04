# 環境構築

## backend

### mysqlをlaravelに導入するまでの流れ

`composer create-project laravel/laravel backend`

- .envの編集
- Mysqlを使用可能にする
- databaseの作成
- php artisan config:clear
- php artisan migrate
- database/migrationsで作成されているか確認
- laravelの開発が始められる

---

```
php artisan serve
```

---

```
http://127.0.0.1:8000
```

---

### phpの初期画面を変更

#### routes/web.phpの画面を変更

```
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message'=>'backend is running',
        ]);
});

```

---

### post tableの作成

#### model,migrationsにPostを作成

```
php artisan make:model Post -m
```

---

#### migrationの中身を変更

- まずは認証なしで作成

```
$table->id();
$table->foreignId('user_id')->nullable();
$table->text('body');
$table->boolean('is_public')->default(true);
$table->timestamps();
```

---

#### Post.phpの編集

```
protected $fillable = [
    'user_id',
    'body',
    'is_public',
];
```

---

#### Controllerの作成

```
php artisan make:controller PostController
```

- または`php artisan make:controller PostController --resource`

#### PostController.phpの編集

- 割愛

---

#### routes/api.phpの作成

```
php artisan install:api
```

- `bootstrap/app.php`がインストールされているか確認

---

### Postmanで確認

#### 前提条件

- routeが定義されているか確認
  `php artisan route:list`

---

#### されていない場合実行

```
php artisan optimize:clear
```

- 個別に行う方法

```
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

#### 確認例

- GET
  `http://127.0.0.1:8000/api/posts`
  `[]`

---

- POST

```
{
  "body": "Test",
  "is_public": true
}
```

---

- DELETE
  `http://127.0.0.1:8000/api/posts/1`

```
{
  "message": "Post deleted successfully"
}
```

### APIを追加

- patchを追加

### 認証設定の追加

#### Sanctumを導入する

- installされているか確認
- `composer show laravel/sanctum`
- `Test-Path .\config\sanctum.php`
- `php artisan migrate:status`

##### Sanctumの導入方法

```
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

#### Posts tableを認証設定に変更

#### user_idを必須にする

- /migrationを編集
- 一度リセット`php artisan migrate:fresh`(学習段階用のみ使用)
- /Modelを編集
- Sanctumは、認証トークン管理を提供するが、登録やログイン用の画面・ルートそのものは提供しない

#### controllerの追加

- 例：`php artisan make:controller AuthController --resource`：（合わなかったので、別の方法を模索中）
- 使用するもの

```
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
```

---

- routes/api.phpにまとめる

---

#### 責務分離

- rules(),policy()

```
php artisan make:request StorePostRequest
php artisan make:request UpdatePostRequest
php artisan make:policy PostPolicy --model=Post
```

---

- エラー・警告が出るとき：`$this->authorize('view', $post)`
- /Controller.php => `use AuthorizesRequests`

---

### アカウントの公開/非公開 & 投稿公開/非公開の2段階の設定を追加

#### profile tableの作成

```
php artisan make:model Profile -m
php artisan make:controller ProfileController
php artisan make:policy ProfilePolicy --model=Profile
php artisan make:request UpdateProfileRequest
```

---

- UserとProfileは一対一で作成
- Profile用に内容を変更する

---

#### 他USERの投稿一覧をみれるようにする

- `/api/users/{user}/posts`の機能を追加

---

#### register時にprofileを自動作成できるようにする

- `php artisan migrate:fresh`開発中なので、これでテーブルを空にする

### 保存機能を追加する

- `php artisan make:model SavedPost -m`
- `php artisan make:controller SavedPostController`
- `php artisan make:policy SavedPostPolicy --model=SavedPost`

---

### Like機能を作成する

- `php artisan make:model Like -m`
- `php artisan make:controller LikeController`
- `php artisan make:policy LikePolicy --model=Like`

#### loginとregisterのエラーを修正

#### JSON形式確認→形式統一

#### 責務分離(Resource)

- `php artisan make:resource UserSummaryResource`
- `php artisan make:resource PostSummaryResource`
- `php artisan make:resource SavedPostResource`
- `php artisan make:resource LikeResource`

---

### Feature Test

#### mysqlでtest環境を作る

- ex:`formapp_test` databaseの作成
- .env.testingの作成->`DB_DATABASE = formapp_test`にする
- 念のため、新しくkeyを作成 -> `php artisan key:generate --env=testing`
- mysqlを使用するので`phpunit.xml`に以下があれば、削除する

```
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

---

- 環境変数を変更したらキャッシュをクリアする

```
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
```

---

- testing環境でDBの接続を確認
  `php artisan tinker --env=testing`

---

```
config('database.default');
config('database.connections.mysql.database');
```

---

- 期待している出力

```
> config('database.default');

= "mysql"

> config('database.connections.mysql.database');

= "formapp_test"
```

---

- 正常であれば、migrationを作成
  `php artisan migrate --env=testing`

---

- mysql側でtableの確認

```
USE formapp_test;
SHOW TABLES;
```

---

- テストファイルの作成

```
php artisan make:test AuthTest
php artisan make:test PostTest
php artisan make:test SavedPostTest
php artisan make:test LikeTest
```

---

- 各testに追加

```
use Illuminate\Foundation\Testing\RefreshDatabase;
use RefreshDatabase;
```

- 一個ずつ実行していく
- `php artisan test --filter=AuthTest`
- Laravelでは、テストデータ作成にmodel factoryを使う

```
php artisan make:factory PostFactory --model=Post
php artisan make:factory ProfileFactory --model=Profile
```

---

- `php artisan test --filter=SavedPostTest`
- `php artisan test --filter=LikeTest`
- `php artisan test --filter=PostTest`
- 最後にすべて実行
- `php artisan test`

---

#### API Resorceの追加・整理

- php artisan make:resource ProfileResource
- php artisan make:resource AuthUserResource
