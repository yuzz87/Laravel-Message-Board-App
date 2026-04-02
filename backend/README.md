# 環境構築

## backend

### mysqlをlaravelに導入するまでの流れ

`composer create-project laravel/laravel backend`

- .envの編集
- Mysqlを使用可能にする
- databaseのさくせい
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

### post tableの作成
