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

- 簡単にroutes/web.phpの画面を変更

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

- model,migrationsにPostを作成

```
php artisan make:model Post -m
```

---

- migrationの中身を変更
- まずは認証なしで作成

```
$table->id();
$table->foreignId('user_id')->nullable();
$table->text('body');
$table->boolean('is_public')->default(true);
$table->timestamps();
```

---

- Post.phpの編集

```
protected $fillable = [
    'user_id',
    'body',
    'is_public',
];
```

---

- Controllerの作成

```
php artisan make:controller PostController
```

- または`php artisan make:controller PostController --resource`

- PostController.phpの編集

---

- routes/api.phpの作成

```
php artisan install:api
```

- `bootstrap/app.php`がインストールされているか確認

---

### Postmanで確認

- 前提条件
- routeが定義されているか確認
  `php artisan route:list`

---

- されていない場合実行

```
php artisan optimize:clear
```

- 個別に行う方法

```
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### 確認例

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
