# AI-Agentic Scrum Dashboard

## Rules

### General Principles

1. **Single Source of Truth**: This dashboard is the only place for Scrum artifacts. All agents read from and write to this file.
2. **Git as History**: Do not add timestamps. Git tracks when changes were made.
3. **Order is Priority**: Items higher in lists have higher priority. No separate priority field needed.

### Product Backlog Management

1. **User Story Format**: Every PBI must have a `story` block with `role`, `capability`, and `benefit`.
2. **Ordering**: Product Owner reorders by moving items up/down in the YAML array.
3. **Refinement**: Change status from `draft` -> `refining` -> `ready` as stories mature.

### Definition of Ready (AI-Agentic)

**Ready = AI can complete it without asking humans.**

| Status | Meaning |
|--------|---------|
| `draft` | Initial idea. Needs elaboration. |
| `refining` | Being refined. AI may be able to make it `ready`. |
| `ready` | All information available. AI can execute autonomously. |

**Refinement process**:
1. AI attempts to refine `draft`/`refining` items autonomously (explore codebase, propose acceptance criteria, identify dependencies)
2. If AI can fill in all gaps -> change status to `ready`
3. If story is too big or unclear -> try to split it
4. If unsplittable item still needs human help -> keep as `refining` and document the question

**Prioritization**: Prefer `ready` items. Work on refinement when no `ready` items exist or while waiting for human input.

### Sprint Structure (AI-Agentic)

**1 Sprint = 1 PBI**

Unlike human Scrum where Sprints are time-boxed to amortize event overhead, AI agents have no such constraint. Scrum events are instant for AI, so we maximize iterations by:

- Each Sprint delivers exactly one PBI
- Sprint Planning = select top `ready` item from backlog
- Sprint Review/Retro = run after every PBI completion
- No fixed duration - Sprint ends when PBI is done

**Benefits**: Faster feedback, simpler planning, cleaner increments, easier rollback.

### Sprint Execution (TDD Workflow)

1. **One PBI per Sprint**: Select the top `ready` item. That's the Sprint Backlog.
2. **TDD Subtask Breakdown**: Break the PBI into subtasks. Each subtask produces commits through Red-Green-Refactor:
   - `test`: What behavior to verify (becomes the Red phase test)
   - `implementation`: What to build to make the test pass (Green phase)
   - `type`: `behavioral` (new functionality) or `structural` (refactoring only)
   - `status`: Current TDD phase (`pending` | `red` | `green` | `refactoring` | `completed`)
   - `commits`: Array tracking each commit made for this subtask
3. **TDD Cycle Per Subtask (Commit-Based)**:
   - **Red**: Write a failing test, commit it (`phase: red`), status becomes `red`
   - **Green**: Implement minimum code to pass, commit it (`phase: green`), status becomes `green`
   - **Refactor**: Make structural improvements, commit each one separately (`phase: refactor`), status becomes `refactoring`
   - **Complete**: All refactoring done, status becomes `completed`
4. **Multiple Refactor Commits**: Following Tidy First, make small, frequent structural changes. Each refactor commit should be a single logical improvement (rename, extract method, etc.).
5. **Commit Discipline**: Each commit represents one TDD phase step. Never mix behavioral and structural changes in the same commit.
6. **Full Event Cycle**: After PBI completion, run Review -> Retro -> next Planning.

### Impediment Handling

1. **Log Immediately**: When blocked, add to `impediments.active` right away.
2. **Escalation Path**: Developer -> Scrum Master -> Human.
3. **Resolution**: Move resolved impediments to `impediments.resolved`.

### Definition of Done

1. **All Criteria Must Pass**: Every required DoD criterion must be verified.
2. **Executable Verification**: Run the verification commands, don't just check boxes.
3. **No Partial Done**: An item is either fully Done or still in_progress.

### Status Transitions

```
PBI Status (in Product Backlog):
  draft -> refining -> ready

Sprint Status (1 PBI per Sprint):
  in_progress -> done
       |
    blocked

Subtask Status (TDD Cycle with Commits):
  pending ─┬─> red ─────> green ─┬─> refactoring ─┬─> completed
           │   (commit)  (commit) │    (commit)    │
           │                      │       ↓        │
           │                      │   (more refactor commits)
           │                      │       ↓        │
           │                      └───────┴────────┘
           │
           └─> (skip to completed if no test needed, e.g., pure structural)

Each status transition produces a commit:
  pending -> red:        commit(test: ...)
  red -> green:          commit(feat: ... or fix: ...)
  green -> refactoring:  commit(refactor: ...)
  refactoring -> refactoring: commit(refactor: ...) [multiple allowed]
  refactoring -> completed:   (no commit, just status update)
  green -> completed:    (no commit, skip refactor if not needed)

Sprint Cycle:
  Planning -> Execution -> Review -> Retro -> (next Planning)
```

### Agent Responsibilities

| Agent | Reads | Writes |
|-------|-------|--------|
| Product Owner | Full dashboard | Product Backlog, Product Goal, Sprint acceptance |
| Scrum Master | Full dashboard | Sprint config, Impediments, Retrospective, Metrics |
| Developer | Sprint Backlog, DoD | Subtask status, Progress, Notes, Impediments |
| Event Agents | Relevant sections | Event-specific outputs |

---

## Quick Status

```yaml
sprint:
  number: 1
  pbi: PBI-001
  status: in_progress
  subtasks_completed: 6
  subtasks_total: 6
  impediments: 0
```

---

## 1. Product Backlog

### Product Goal

```yaml
product_goal:
  statement: "ラーメン愛好家が訪問したお店のレビューを簡単に記録・共有できる"
  success_metrics:
    - "レビュー作成数"
    - "URL解析成功率"
    - "ユーザー満足度"
  owner: "@scrum-team-product-owner"
```

### Backlog Items

```yaml
product_backlog:
  - id: PBI-001
    story:
      role: "ラーメン愛好家"
      capability: "食べログなどのURLを入力して、店舗の基本情報（住所、電話番号など）を自動で取得する"
      benefit: "手動で情報を入力する手間を省き、素早くレビューを作成できる"
    technical_approach:
      adr: "docs/adr/001-jina-reader-for-url-parsing.md"
      summary: |
        1. ユーザーが URL を入力
        2. Jina Reader API (r.jina.ai/[URL]) で HTML → Markdown 変換
        3. Markdown を AI に送信して店舗情報（JSON）を抽出
        4. 抽出した情報をフォームに自動入力
      dependencies:
        - "Jina Reader API (外部サービス)"
        - "AI API (店舗情報抽出用)"
    acceptance_criteria:
      - criterion: "URL入力フィールドにURLを入力できる"
        verification: "pnpm test -- --run tests/url-input.test.tsx"
      - criterion: "Jina Reader API で URL から Markdown を取得できる"
        verification: "pnpm test -- --run tests/jina-reader.test.ts"
      - criterion: "Markdown から AI が店舗情報（店名、住所、電話番号）を抽出できる"
        verification: "pnpm test -- --run tests/shop-info-extractor.test.ts"
      - criterion: "解析された情報がレビューフォームに自動入力される"
        verification: "pnpm test -- --run tests/auto-fill.test.tsx"
      - criterion: "Jina Reader API がエラーを返した場合はエラーメッセージが表示される"
        verification: "pnpm test -- --run tests/jina-reader-error.test.tsx"
      - criterion: "AI が情報を抽出できなかった場合は手動入力に切り替わる"
        verification: "pnpm test -- --run tests/fallback-manual-input.test.tsx"
    dependencies: []
    status: ready
```

### Definition of Ready

```yaml
definition_of_ready:
  criteria:
    - criterion: "AI can complete this story without human input"
      required: true
      note: "If human input needed, split or keep as refining"
    - criterion: "User story has role, capability, and benefit"
      required: true
    - criterion: "At least 3 acceptance criteria with verification commands"
      required: true
    - criterion: "Dependencies are resolved or not blocking"
      required: true
```

---

## 2. Current Sprint

```yaml
sprint:
  number: 1
  pbi_id: PBI-001
  story: "ラーメン愛好家として、食べログなどのURLを入力して、店舗の基本情報（住所、電話番号など）を自動で取得したい"
  status: in_progress

  subtasks:
    - test: "URL入力フィールドにURLを入力できる"
      implementation: "ReviewFormにURL入力フィールドを追加し、入力状態を管理する"
      type: behavioral
      status: completed
      commits:
        - phase: red
          sha: eeff615
          message: "test: URL解析フィールドの表示をテスト"
        - phase: green
          sha: b7e6044
          message: "feat: URL解析フィールドを追加"

    - test: "Jina Reader API で URL から Markdown を取得できる"
      implementation: "fetchJinaReader関数を作成し、r.jina.ai APIを呼び出してMarkdownを返す"
      type: behavioral
      status: completed
      commits:
        - phase: red
          sha: 2f00453
          message: "test: Jina Reader APIからMarkdown取得をテスト"
        - phase: green
          sha: 8ddd50f
          message: "feat: Jina Reader APIでURL→Markdown変換を実装"

    - test: "Markdown から AI が店舗情報（店名、住所、電話番号）を抽出できる"
      implementation: "extractShopInfo関数を作成し、AIに店舗情報抽出を依頼する"
      type: behavioral
      status: completed
      commits:
        - phase: red
          sha: 2766933
          message: "test: Markdownから店舗情報を抽出する機能をテスト"
        - phase: green
          sha: f6a0e7c
          message: "feat: 店舗情報抽出機能の基本実装を追加"

    - test: "解析された情報がレビューフォームに自動入力される"
      implementation: "URL解析後に店名、住所をフォームに自動入力する"
      type: behavioral
      status: completed
      commits:
        - phase: red
          sha: a2a96b1
          message: "test: URL解析後のフォーム自動入力をテスト"
        - phase: green
          sha: f8f55b0
          message: "feat: URL解析による店舗情報の自動入力を実装"

    - test: "Jina Reader API がエラーを返した場合はエラーメッセージが表示される"
      implementation: "APIエラー時にユーザーフレンドリーなエラーメッセージを表示する"
      type: behavioral
      status: completed
      commits:
        - phase: red
          sha: 9347faa
          message: "test: Jina Reader APIエラー時のエラーメッセージ表示をテスト"
        - phase: green
          sha: ff71858
          message: "feat: URL解析エラー時のエラーメッセージ表示を実装"

    - test: "AI が情報を抽出できなかった場合は手動入力に切り替わる"
      implementation: "抽出失敗時にフォールバックUIを表示し、手動入力を促す"
      type: behavioral
      status: completed
      commits:
        - phase: red
          sha: 69fa32f
          message: "test: AI抽出失敗時の手動入力フォールバックをテスト"
        - phase: green
          sha: 75cbcaf
          message: "feat: AI抽出失敗時のフォールバックメッセージを実装"
  # TDD Subtask Format - Each subtask tracks commits through Red-Green-Refactor:
  #
  # - test: "User model has email and hashed_password fields"
  #   implementation: "Create User SQLAlchemy model with fields"
  #   type: behavioral  # behavioral | structural
  #   status: completed  # pending | red | green | refactoring | completed
  #   commits:
  #     - phase: red
  #       message: "test: User model has email and hashed_password fields"
  #     - phase: green
  #       message: "feat: Create User SQLAlchemy model"
  #     - phase: refactor
  #       message: "refactor: Extract field definitions to constants"
  #     - phase: refactor
  #       message: "refactor: Add docstring to User model"
  #
  # - test: "hash_password returns bcrypt hash"
  #   implementation: "Implement hash_password utility function"
  #   type: behavioral
  #   status: green  # Test passing, no refactor needed yet
  #   commits:
  #     - phase: red
  #       message: "test: hash_password returns bcrypt hash"
  #     - phase: green
  #       message: "feat: Implement hash_password utility"
  #
  # - test: "verify_password returns True for matching passwords"
  #   implementation: "Implement verify_password utility function"
  #   type: behavioral
  #   status: red  # Failing test committed, implementation pending
  #   commits:
  #     - phase: red
  #       message: "test: verify_password returns True for matching"
  #
  # - test: "Extract password validation to separate module"
  #   implementation: "Move validation logic to validators.py"
  #   type: structural  # Refactoring - no new behavior, no red phase
  #   status: pending
  #   commits: []
  #
  # Status meanings:
  #   pending    -> Not started, no commits yet
  #   red        -> Failing test committed, ready for implementation
  #   green      -> Passing implementation committed, ready for refactoring
  #   refactoring -> One or more refactor commits done, more may come
  #   completed  -> All commits done, subtask finished
  #
  # Commit tracking:
  #   - Each TDD phase produces exactly one commit (except refactoring which may have many)
  #   - phase: red | green | refactor
  #   - message: The actual commit message used
  #   - Multiple refactor commits are encouraged (Tidy First = small structural changes)

  notes: |
    Sprint 1 開始。PBI-001「URL から店舗情報自動取得」を実装。
    TDDでRed-Green-Refactorサイクルを回す。
```

### Impediment Registry

```yaml
impediments:
  active: []
  # Example impediment format:
  # - id: IMP-001
  #   reporter: "@scrum-team-developer"
  #   description: "Redis connection timeout in test environment"
  #   impact: "Blocks rate limiting tests"
  #   severity: high  # low | medium | high | critical
  #   affected_items:
  #     - PBI-003
  #   resolution_attempts:
  #     - attempt: "Increased connection timeout to 30s"
  #       result: "Still failing"
  #   status: investigating  # new | investigating | escalated | resolved
  #   escalated_to: null
  #   resolution: null

  resolved: []
  # Example resolved impediment format:
  # - id: IMP-000
  #   reporter: "@scrum-team-developer"
  #   description: "Missing pytest-asyncio dependency"
  #   impact: "Async tests could not run"
  #   severity: medium
  #   resolution: "Added pytest-asyncio to dev dependencies"
```

---

## 3. Definition of Done

```yaml
definition_of_done:
  # Run all verification commands from the PBI's acceptance_criteria
  # Plus these baseline checks:
  checks:
    - name: "Tests pass"
      run: "pnpm test -- --run"
    - name: "Lint clean"
      run: "pnpm lint"
    - name: "Types valid"
      run: "pnpm type-check"
    - name: "Build succeeds"
      run: "pnpm build"
```

---

## 4. Completed Sprints

```yaml
# Log of completed PBIs (one per sprint)
completed: []
# Example completed sprint format:
# - sprint: 1
#   pbi: PBI-001
#   story: "As registered user, I can log in..."
#   verification: passed
#   notes: "Clean implementation"
```

---

## 5. Retrospective Log

```yaml
# After each sprint, record what to improve
retrospectives: []
# Example retrospective format:
# - sprint: 1
#   worked_well:
#     - "Clear acceptance criteria"
#   to_improve:
#     - "Better subtask breakdown"
#   actions:
#     - "Add more specific verification commands"
```

---

## 6. Agents

```yaml
agents:
  product_owner: "@scrum-team-product-owner"
  scrum_master: "@scrum-team-scrum-master"
  developer: "@scrum-team-developer"

events:
  planning: "@scrum-event-sprint-planning"
  review: "@scrum-event-sprint-review"
  retrospective: "@scrum-event-sprint-retrospective"
  refinement: "@scrum-event-backlog-refinement"
```
