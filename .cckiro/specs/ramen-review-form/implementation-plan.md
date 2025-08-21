# ラーメンレビューフォーム - 実装計画書（TDD版）

## TDD開発方針
t_wadaのTDD（Test-Driven Development）の原則に従い、以下のサイクルで開発を進めます：

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限の実装を行う
3. **Refactor**: コードの品質を改善する

### テストの3原則
- **AAA Pattern**: Arrange（準備）、Act（実行）、Assert（検証）
- **テストは仕様書**: テストを読めば仕様が理解できる
- **独立性**: 各テストは独立して実行可能

## 実装順序とタスク一覧

### フェーズ0: ブランチ作成
```bash
# 開発用ブランチの作成
git checkout -b feat/add-ramen-review-form
```

### フェーズ1: 環境セットアップ（30分）

#### 1.1 CI/CD環境のセットアップ
1. **Lefthookの設定**
   - Lefthookのインストール
   - pre-commitフックの設定（lint/format）
   - pre-pushフックの設定（test実行）
   - lefthook.ymlの作成

2. **GitHub Actionsの設定**
   - CI workflowの作成
   - テスト自動実行
   - ビルドチェック
   - Vercelへの自動デプロイ

3. **Linter/Formatterの設定**
   - ESLintの設定更新
   - Prettierの設定
   - lint-stagedの設定

#### 1.2 テスト環境のセットアップ
1. **Vitestのインストールと設定**
   - Testing Libraryのインストール
   - vitest.config.tsの作成
   - setupTests.tsの作成

#### 1.3 必要なパッケージのインストール
1. **アプリケーション依存関係**
   - TanStack Form関連パッケージ
   - Valibot
   - Lucide React
   - next-themes
   - Shadcn/ui依存パッケージ

#### 1.4 プロジェクト基本設定
1. **Shadcn/uiのセットアップ**
   - Shadcn/ui初期設定（まだの場合）
   - 必要なコンポーネントの追加

2. **スタイル設定**
   - tailwind.config.jsの確認・更新
   - globals.cssにテーマ変数追加

### フェーズ2: 基盤コンポーネント実装（TDD）（40分）

#### 2.1 ユーティリティ関数（TDDサイクル）
1. **RED: テスト作成**
   - `/lib/utils.test.ts`: cn関数のテスト
   - `/lib/validations.test.ts`: スキーマのテスト

2. **GREEN: 実装**
   - `/lib/utils.ts`: cn関数の実装
   - `/lib/validations.ts`: Valibotスキーマ定義

3. **REFACTOR: リファクタリング**

#### 2.2 Shadcn/uiコンポーネントの追加
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
```

#### 2.3 テーマプロバイダー（TDDサイクル）
1. **RED: テスト作成**
   - `/hooks/useTheme.test.ts`: テーマフックのテスト

2. **GREEN: 実装**
   - `/providers/ThemeProvider.tsx`: next-themesを使用
   - `/hooks/useTheme.ts`: テーマ管理フック

3. **REFACTOR: リファクタリング**

### フェーズ3: レビューフォームコンポーネント実装（TDD）（60分）

#### 3.1 StarRatingコンポーネント（TDDサイクル）
1. **RED: テスト作成**
   - `/app/ramen-review/components/StarRating.test.tsx`
   - テストケース：
     - 初期表示の確認
     - クリックで評価値が変更される
     - ホバー時の表示変更
     - アクセシビリティ属性の確認

2. **GREEN: 実装**
   - `/app/ramen-review/components/StarRating.tsx`
   - 最小限の実装でテストを通す

3. **REFACTOR: リファクタリング**
   - コードの整理、最適化

#### 3.2 MessagePreviewコンポーネント（TDDサイクル）
1. **RED: テスト作成**
   - `/app/ramen-review/components/MessagePreview.test.tsx`
   - テストケース：
     - メッセージが正しく表示される
     - コピーボタンが動作する
     - コピー成功時のフィードバック

2. **GREEN: 実装**
   - `/app/ramen-review/components/MessagePreview.tsx`

3. **REFACTOR: リファクタリング**

#### 3.3 ReviewFormコンポーネント（TDDサイクル）
1. **RED: テスト作成**
   - `/app/ramen-review/components/ReviewForm.test.tsx`
   - テストケース：
     - 各フィールドの表示
     - 必須項目のバリデーション
     - メッセージ生成の正確性
     - リセット機能

2. **GREEN: 実装**
   - `/app/ramen-review/components/ReviewForm.tsx`
   - TanStack Form統合
   - Valibotバリデーション

3. **REFACTOR: リファクタリング**

### フェーズ4: メインページ実装（TDD）（30分）

#### 4.1 メインページ（TDDサイクル）
1. **RED: テスト作成**
   - `/app/ramen-review/page.test.tsx`
   - テストケース：
     - ページタイトルの表示
     - ReviewFormコンポーネントのレンダリング
     - テーマ切り替えボタンの存在

2. **GREEN: 実装**
   - `/app/layout.tsx`: ThemeProvider統合
   - `/app/ramen-review/page.tsx`: メインページ

3. **REFACTOR: スタイリング調整**
   - レスポンシブデザイン
   - ダークモード対応
   - View Transitions API実装

### フェーズ5: 統合テスト・調整（30分）

#### 5.1 統合テスト
1. **E2Eテストシナリオ**
   - フォームに全ての必須項目を入力
   - メッセージ生成を確認
   - コピー機能の動作確認
   - テーマ切り替えの動作確認

2. **テストカバレッジ確認**
   ```bash
   npm run test:coverage
   ```

#### 5.2 最終調整
1. **ブラウザ互換性確認**
   - View Transitions APIフォールバック
   - モバイル表示確認

2. **パフォーマンス最適化**
   - アクセシビリティ確認
   - Lighthouseスコア確認

## 実装時の注意点

### コンポーネント階層
```
<ThemeProvider>
  <Layout>
    <ReviewFormPage>
      <ReviewForm>
        <StarRating />
        <MessagePreview />
      </ReviewForm>
    </ReviewFormPage>
  </Layout>
</ThemeProvider>
```

### State管理の流れ
1. TanStack Formでフォーム全体の状態管理
2. 各フィールドの値はFormのstateで一元管理
3. バリデーションはValibotスキーマで定義
4. テーマ状態はnext-themesで管理

### ファイル構成
```
app/
├── layout.tsx                     # ルートレイアウト（ThemeProvider）
├── globals.css                    # グローバルスタイル
├── ramen-review/
│   ├── page.tsx                   # メインページ
│   └── components/
│       ├── ReviewForm.tsx         # フォーム本体
│       ├── StarRating.tsx         # 星評価
│       └── MessagePreview.tsx     # プレビュー
├── components/
│   └── ui/                        # Shadcn/uiコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       └── theme-toggle.tsx
├── hooks/
│   └── useTheme.ts                # テーマ管理フック
├── lib/
│   ├── utils.ts                   # ユーティリティ
│   └── validations.ts             # バリデーション定義
└── providers/
    └── ThemeProvider.tsx          # テーマプロバイダー
```

## テスト駆動開発のポイント

### テストファーストの原則
- テストを先に書くことで、仕様を明確にする
- テストがドキュメントとして機能する
- リファクタリングの安全性を保証

### テストの品質指標
- **F.I.R.S.T原則**
  - Fast: 高速に実行される
  - Independent: 独立して実行可能
  - Repeatable: 何度でも同じ結果
  - Self-Validating: 自動で成功/失敗を判定
  - Timely: コードより先に書く

## コマンド一覧

### 初期セットアップ
```bash
# CI/CD関連パッケージのインストール
npm install -D lefthook lint-staged prettier eslint-config-prettier

# テスト関連パッケージのインストール
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom @vitejs/plugin-react jsdom

# 必要なパッケージのインストール
npm install @tanstack/react-form @tanstack/valibot-form-adapter valibot lucide-react next-themes class-variance-authority clsx tailwind-merge

# Lefthookのセットアップ
npx lefthook install

# Shadcn/uiのセットアップ（未実施の場合）
npx shadcn-ui@latest init

# 各コンポーネントの追加
npx shadcn-ui@latest add button card input label textarea toast
```

### テストコマンド
```bash
# テストの実行
npm run test

# テストをウォッチモードで実行
npm run test:watch

# カバレッジレポートの生成
npm run test:coverage
```

### 開発サーバー起動
```bash
npm run dev
```

### ビルド・デプロイ
```bash
# ローカルビルド確認
npm run build
npm run start

# Vercelへのデプロイ
vercel --prod
```

## コミット戦略

### コミット粒度
- 各TDDサイクル（Red-Green-Refactor）ごとにコミット
- 機能単位での論理的なまとまり
- ビルドが通る状態を保つ

### コミットメッセージ規約（Conventional Commits）
```
<type>: <description>

[optional body]
```

#### Type一覧
- `feat`: 新機能追加
- `fix`: バグ修正
- `test`: テストの追加・修正
- `refactor`: リファクタリング
- `docs`: ドキュメント修正
- `style`: コードスタイルの修正
- `chore`: ビルド設定など
- `perf`: パフォーマンス改善

#### 例
```
test: add StarRating component tests
feat: implement StarRating component
refactor: optimize StarRating hover effect
```

## 完了条件
- [ ] 全てのテストがパスする
- [ ] テストカバレッジ80%以上
- [ ] すべての必須項目が入力可能
- [ ] バリデーションが正しく動作
- [ ] Slackメッセージが正しいフォーマットで生成
- [ ] コピー機能が動作
- [ ] ライト/ダークモード切り替えが動作
- [ ] localStorageにテーマが保存される
- [ ] View Transitions APIでスムーズな切り替え
- [ ] レスポンシブデザインが機能
- [ ] Vercelでのデプロイが成功

## Vitest設定ファイル

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '.next/',
        '*.config.*',
        'components/ui/**', // Shadcn/uiコンポーネントは除外
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### test/setup.ts
```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// 各テスト後にDOMをクリーンアップ
afterEach(() => {
  cleanup()
})

// localStorageのモック
const localStorageMock: Storage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

global.localStorage = localStorageMock

// matchMediaのモック（テーマ切り替え用）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// View Transitions APIのモック
if (!document.startViewTransition) {
  document.startViewTransition = vi.fn((callback) => {
    callback()
    return {
      ready: Promise.resolve(),
      finished: Promise.resolve(),
      updateCallbackDone: Promise.resolve(),
      skipTransition: vi.fn(),
    }
  })
}
```

### package.jsonに追加するスクリプト
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit"
  }
}
```

## 設定ファイル

### lefthook.yml
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: npx eslint {staged_files}
    format:
      glob: "*.{js,jsx,ts,tsx,json,css,md}"
      run: npx prettier --write {staged_files} && git add {staged_files}
    type-check:
      run: npm run type-check

pre-push:
  parallel: true
  commands:
    test:
      run: npm test -- --run
    build:
      run: npm run build

commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit
```

### .prettierrc.json
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### .github/workflows/ci.yml
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Check formatting
        run: npm run format:check
      
      - name: Type check
        run: npm run type-check
      
      - name: Run tests
        run: npm test -- --run --coverage
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```