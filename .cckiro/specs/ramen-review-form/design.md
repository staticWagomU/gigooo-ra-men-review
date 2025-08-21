# ラーメンレビューフォーム - 設計書

## 1. アーキテクチャ設計

### 技術スタック
- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **UIライブラリ**: Shadcn/ui
- **フォーム管理**: TanStack Form
- **バリデーション**: Valibot
- **スタイリング**: Tailwind CSS (Shadcn/uiのテーマシステム)
- **アイコン**: Lucide React (Shadcn/ui標準)
- **テスティング**: Vitest + @testing-library/react
- **開発手法**: TDD (Test-Driven Development)
- **デプロイ**: Vercel

### ディレクトリ構成
```
app/
├── ramen-review/
│   ├── page.tsx           # メインページ
│   └── components/
│       ├── ReviewForm.tsx      # レビューフォームコンポーネント
│       ├── StarRating.tsx      # 星評価コンポーネント
│       └── MessagePreview.tsx  # メッセージプレビューコンポーネント
├── components/
│   └── ui/                    # Shadcn/uiコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       └── theme-toggle.tsx
├── hooks/
│   └── useTheme.ts             # テーマ管理カスタムフック
├── lib/
│   ├── utils.ts               # ユーティリティ関数
│   └── validations.ts         # Valibotスキーマ定義
└── providers/
    └── ThemeProvider.tsx       # テーマコンテキストプロバイダー
```

## 2. コンポーネント設計

### 2.1 ReviewForm コンポーネント
**責務**: フォーム全体の管理とデータの収集

**Valibotスキーマ定義**:
```typescript
import * as v from 'valibot';

const ReviewSchema = v.object({
  shopName: v.pipe(
    v.string(),
    v.minLength(1, '店名は必須です')
  ),
  location: v.pipe(
    v.string(),
    v.minLength(1, '場所は必須です')
  ),
  shopUrl: v.pipe(
    v.string(),
    v.url('有効なURLを入力してください')
  ),
  menuName: v.pipe(
    v.string(),
    v.minLength(1, 'メニュー名は必須です')
  ),
  price: v.pipe(
    v.string(),
    v.regex(/^\d+$/, '数値を入力してください')
  ),
  tasteRating: v.pipe(
    v.number(),
    v.minValue(1),
    v.maxValue(5)
  ),
  atmosphereRating: v.pipe(
    v.number(),
    v.minValue(1),
    v.maxValue(5)
  ),
  overallRating: v.pipe(
    v.number(),
    v.minValue(1),
    v.maxValue(5)
  ),
  review: v.pipe(
    v.string(),
    v.minLength(1, '感想は必須です')
  )
});

type ReviewData = v.InferOutput<typeof ReviewSchema>;
```

**TanStack Form統合**:
```typescript
import { useForm } from '@tanstack/react-form';
import { valibotValidator } from '@tanstack/valibot-form-adapter';

const form = useForm({
  defaultValues: {
    shopName: '',
    location: '',
    shopUrl: '',
    menuName: '',
    price: '',
    tasteRating: 0,
    atmosphereRating: 0,
    overallRating: 0,
    review: ''
  },
  onSubmit: async ({ value }) => {
    // メッセージ生成処理
  },
  validatorAdapter: valibotValidator()
});
```

**機能**:
- Valibotによるスキーマバリデーション
- TanStack Formによるフォーム状態管理
- メッセージ生成ロジック
- リセット機能

### 2.2 StarRating コンポーネント
**責務**: 星評価の表示と入力

**Props**:
```typescript
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  required?: boolean;
}
```

**機能**:
- クリックで評価値を設定
- ホバー時のプレビュー表示
- タッチデバイス対応

### 2.3 MessagePreview コンポーネント
**責務**: Slack用メッセージのプレビューとコピー機能

**Props**:
```typescript
interface MessagePreviewProps {
  message: string;
  onCopy: () => void;
}
```

**機能**:
- フォーマット済みメッセージの表示
- クリップボードへのコピー
- コピー成功のフィードバック

### 2.4 ThemeToggle コンポーネント
**責務**: テーマの切り替えボタン

**機能**:
- ライト/ダークモードの切り替え
- 現在のテーマ状態の表示（アイコンで表現）
- View Transitions APIを使用したアニメーション

### 2.5 ThemeProvider コンポーネント
**責務**: テーマ状態の管理と提供

**State管理**:
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**機能**:
- localStorageからのテーマ読み込み
- テーマ変更時のlocalStorage保存
- HTMLのクラス属性管理（dark クラスの付与/削除）

## 3. データフロー設計

1. **入力フェーズ**
   - ユーザーが各フィールドに入力
   - StarRatingコンポーネントが評価値を親に伝達
   - ReviewFormがすべてのデータを集約

2. **バリデーション**
   - 必須項目のチェック（すべての項目が必須）
   - リアルタイムバリデーション表示

3. **メッセージ生成**
   - テンプレートに基づいてメッセージを構築
   - 星評価を★☆形式に変換
   - すべての項目を含めて出力

4. **プレビュー＆コピー**
   - MessagePreviewコンポーネントで表示
   - Clipboard APIを使用してコピー

## 4. UI/UXデザイン

### レイアウト
- モバイルファースト設計
- カード形式のフォームレイアウト
- セクション分けで視覚的な整理

### 入力フィールド
- **テキスト入力**: Shadcn/uiのInputコンポーネント
- **星評価**: カスタムコンポーネント（Lucideアイコン使用）
- **テキストエリア**: Shadcn/uiのTextareaコンポーネント
- **ボタン**: Shadcn/uiのButtonコンポーネント
- **カード**: Shadcn/uiのCardコンポーネント

### カラースキーム

Shadcn/uiのテーマシステムを使用：
- CSS変数による色管理
- `globals.css`でテーマ変数を定義
- `dark`クラスによるダークモード切り替え

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* 他のテーマ変数 */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* 他のテーマ変数 */
  }
}
```

### レスポンシブ対応
- sm: モバイル（1カラム）
- md: タブレット（適切なパディング調整）
- lg: デスクトップ（最大幅制限）

## 5. ユーティリティ関数

### convertRatingToStars
評価値を星表示に変換
```typescript
function convertRatingToStars(rating: number): string {
  const filled = '★'.repeat(rating);
  const empty = '☆'.repeat(5 - rating);
  return filled + empty;
}
```

### generateSlackMessage
入力データからSlackメッセージを生成
```typescript
function generateSlackMessage(data: ReviewData): string {
  // テンプレートに基づいてメッセージを構築
}
```

### useTheme カスタムフック
テーマ管理のロジック
```typescript
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // localStorageから初期値を読み込み
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  const toggleTheme = () => {
    // View Transitions API を使用
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark');
      });
    } else {
      // フォールバック
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark');
    }
  };
  
  return { theme, toggleTheme };
}
```

## 6. エラーハンドリング

- Valibotによるリアルタイムバリデーション
- TanStack Formのエラー表示機能
- Shadcn/uiのToastコンポーネントでフィードバック表示
- コピー失敗時のフォールバック（手動選択を促す）

## 7. アクセシビリティ考慮

- Shadcn/uiコンポーネントの標準アクセシビリティ機能
- TanStack Formによる適切なARIA属性の管理
- フォームラベルの適切な設定
- キーボードナビゲーション対応
- フォーカス管理

## 8. 必要なパッケージ

### 依存関係
```json
{
  "@tanstack/react-form": "latest",
  "@tanstack/valibot-form-adapter": "latest",
  "valibot": "latest",
  "lucide-react": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "@radix-ui/react-label": "latest",
  "@radix-ui/react-slot": "latest",
  "@radix-ui/react-toast": "latest",
  "next-themes": "latest"
}
```

### 開発依存関係
```json
{
  "vitest": "latest",
  "@testing-library/react": "latest",
  "@testing-library/user-event": "latest",
  "@testing-library/jest-dom": "latest",
  "@vitejs/plugin-react": "latest",
  "jsdom": "latest"
}
```

### Shadcn/uiコンポーネント
- Button
- Card
- Input
- Label
- Textarea
- Toast
- Theme Toggle（カスタマイズ版）

## 9. Vercelデプロイ考慮事項

### 環境変数
- 本プロジェクトでは環境変数は不要（すべてクライアントサイド）

### ビルド設定
- Framework Preset: Next.js
- Build Command: `npm run build` または `yarn build`
- Output Directory: `.next`

### パフォーマンス最適化
- 静的生成（SSG）を活用
- クライアントコンポーネントの適切な使用（'use client'）
- View Transitions APIのブラウザサポート検出

### Edge Runtime対応
- 必要に応じてEdge Runtimeを検討（現状不要）