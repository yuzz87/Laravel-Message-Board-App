# AGENTS.md

## TASKS

### TASK-001: API契約統一とフロント連携修正（Saved/Liked中心）

**背景（README反映）**
- `LikeResource` が `parent::toArray()` を返しており、レスポンス形状が不統一。
- `SavedPostResource` が `post` ネストを返す一方、frontend がフラット構造を期待している箇所がある。
- Save/Like/Delete のUI操作は未接続または不十分。
- 次マイルストーンは「契約統一 → フロント連携 → 品質強化」。

**目的**
1. backend の saved/liked 系レスポンスを明確に定義・固定化する。  
2. frontend のデータパース/UI操作を契約に合わせて統一する。  
3. 主要フローに対してテストを追加し、再発を防止する。

**完了条件（Definition of Done）**
- [x] `LikeResource` を明示的フィールド返却へ変更し、`SavedPostResource` と整合の取れた仕様書（READMEまたはAPIドキュメント）を更新。
- [x] frontend の `SavedPosts` / `LikedPosts` / 関連一覧で、契約に沿って正しく表示される（本文・投稿者・likes_countなど）。
- [x] Save/Unsave, Like/Unlike, Delete のUI操作が主要画面で実行可能。
- [ ] backend feature tests と frontend 側の最低限の動作検証（手動手順または自動テスト）を追加。※依存関係取得のネットワーク制約により自動テスト実行は未完。
- [x] 変更後の既知不備をREADMEに再反映。

**実装順（推奨）**
1. backend response contract を先に確定。  
2. frontend を contract に追従。  
3. テスト・ドキュメントを追加。
