# ADR-001: URL 解析に Jina Reader API を採用

## Status

Accepted

## Context

PBI-001「食べログなどの URL から店舗情報を AI で自動取得する」機能を実装するにあたり、HTML をどのように処理して AI に渡すかを決定する必要がある。

### 課題

- 食べログなどのページは HTML が膨大（広告、ナビゲーション、スクリプト等）
- そのまま AI に渡すとコンテキストがオーバーフローする
- トークンコストが増大し、処理速度も低下する

### 検討した選択肢

| 選択肢 | 概要 | Vercel 適性 |
|--------|------|:-----------:|
| Jina Reader API | `r.jina.ai/[URL]` で Markdown を取得 | ◎ |
| Readability + Turndown | Mozilla 製本文抽出 + MD 変換 | △（jsdom が重い） |
| Cheerio + 独自パーサー | 軽量 DOM パーサーで構造抽出 | ○ |
| Playwright | ヘッドレスブラウザで JS 実行後取得 | ✗（動作不可） |

## Decision

**Jina Reader API** を採用する。

## Rationale

1. **Vercel サーバーレス環境との相性が最良**
   - fetch 1回で完結、バンドルサイズへの影響なし
   - 実行時間制限（10秒/60秒）に余裕で収まる

2. **実装がシンプル**
   - 外部ライブラリ不要
   - エラーハンドリングが単純

3. **出力品質が高い**
   - 広告・ナビ・フッターを自動除去
   - 構造化された Markdown を返す
   - トークン数が HTML の 1/10 以下に削減

4. **無料枠で十分**
   - 20 リクエスト/分は個人プロジェクトに十分

## Consequences

### Positive

- 実装コストが低い
- メンテナンスコストが低い
- AI へのトークン数が大幅削減
- 処理速度向上

### Negative

- 外部サービスへの依存（Jina がダウンすると機能停止）
- 高頻度利用時は有料プランが必要
- Jina が対応していないサイトでは精度が落ちる可能性

### Mitigation

- エラー時のフォールバック UI を用意（手動入力に切り替え）
- Jina の障害時に備えて、将来的に Cheerio ベースのフォールバックを検討

## References

- [Jina Reader](https://jina.ai/reader/)
- [Jina Reader API Documentation](https://jina.ai/reader#api)
