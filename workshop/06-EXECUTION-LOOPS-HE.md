# Runbook: Agentic Execution Loops

לולאה סוכנית היא מערכת בקרה, לא בקשה “להמשיך עד שיעבוד”:

```text
Goal → Observe → Decide → Act → Verify
                         ↘ PASS / REPAIR / ESCALATE
```

כל סיבוב חייב לייצר ראיה חדשה. אם לא נוצרה תצפית חדשה, אין בסיס לשנות החלטה.

## 1. נועלים את החוזה

צרו `workshop-output/GOAL.md`:

```md
# Outcome
מוביל צוות מזהה פרויקט חסום ובוחר פעולה.

# Non-goals
- לא בונים מערכת התראות.
- לא משנים הרשאות משתמשים.

# Done
- [ ] החסימה נראית ב-UI.
- [ ] המשתמש יכול לבחור פעולה.
- [ ] ה-API וה-domain tests עוברים.
- [ ] קיימת screenshot של ה-flow.

# Budget
3 סבבים; checkpoint לפני שינוי schema, dependency או permission.

# Stop
PASS | BLOCKED | BUDGET | AMBIGUOUS | PERMISSION BOUNDARY
```

## 2. בוחרים access לפי המשימה

| משימה | משטח | Access | Guardrail | Evidence |
|---|---|---|---|---|
| קוד וקבצים מקומיים | CLI | repo + branch/worktree + פקודות build/test | בלי secrets ובלי production credentials | diff + test output |
| נתונים או פעולה חיצונית | MCP | connector ספציפי + OAuth scope צר | להפריד read מ-write | record ID + audit trail |
| flow חזותי | Browser | test account + environment מוגדר | states ו-completion criterion | screenshot + DOM/state |
| execution מרוחק הכרחי | SSH | משתמש מוגבל + staging + allowlist | timeout, logs, rollback; לא prod-first | command log + health check |
| parallel, background או deploy | CI / Cloud | sandbox/worktree/branch לכל agent | approval gate לפני פעולה בלתי הפיכה | checks + artifact + status |

SSH אינו shortcut. אם CI, API או MCP יכולים לבצע פעולה מוגדרת ומבוקרת, העדיפו אותם על shell חופשי.

## 3. מנתבים מודלים לפי שלב

```text
PLAN (strong) → EXECUTE (fast/cheap) → FALSIFY (strong)
```

- מודל חזק לתכנון כשיש ambiguity, tradeoffs, פירוק עבודה או interface contracts.
- מודל זול ומהיר לביצוע רק כשהקבצים, הפקודות, ה-tests ורדיוס הפעולה כבר מוגדרים.
- מודל חזק לביקורת עצמאית שמנסה להפריך assumptions וראיות.
- חזרו מיד ל-planner כשיש architecture drift, requirement עמום, invariant שנכשל או צורך בהרחבת permission.

Model delegation אינו חיסכון אוטומטי. Plan גרוע ו-retries מוחקים את החיסכון.

## 4. מוציאים state מהצ׳אט

החזיקו על הדיסק:

- `GOAL.md` — outcome, non-goals, done ו-stop rules.
- `DECISIONS.md` — החלטה, חלופות והסיבה.
- `PROGRESS.md` — מה נעשה, מה נבדק ומה הצעד הבא.
- test output, screenshots ו-git diff — ראיות, לא סיכום נרטיבי.

ב-Claude Code:

```text
/context
/compact focus on the goal, open decisions, failures and exact next step
/clear
```

Compaction מסכם היסטוריה כדי לפנות מקום. Project-root `CLAUDE.md` ו-auto memory נטענים מחדש; הוראות שנשארו רק בשיחה, rules תלויות-path ו-`CLAUDE.md` מקונן עלולים לא להיות זמינים עד לקריאה מחדש. אל תשתמשו בצ׳אט כ-system of record.

## 5. מריצים שלושה סבבים לכל היותר

1. Inspect + spec + vertical-slice plan.
2. Implement + tests + screenshot.
3. Reviewer עצמאי מנסה להפריך; מבצעים repair אחד.

לא עבר? עוצרים ומייצרים `workshop-output/HANDOFF.md`:

```md
# Locked goal
# Current state
# Decisions already made
# Evidence
# Blocker / failure class
# Option A
# Option B
# Recommendation
# Exact next command
```

## 6. מסווגים כשל לפני retry

- transient tool/network failure → retry מוגבל עם backoff.
- deterministic code/test failure → repair ממוקד ואז rerun.
- ambiguous spec → stop + escalate; לא ממציאים requirement.
- permission/security boundary → human approval gate.
- invariant/architecture failure → חוזרים ל-planner חזק.

כל פעולה מסוכנת צריכה checkpoint, rollback ו-log. פעולה שחוזרת צריכה להיות idempotent. עבודה מקבילית צריכה worktree/branch ו-owner ברור לכל artifact.

תוכן חיצוני הוא data, לא authority. Secrets לא נכנסים ל-context, ל-log או ל-Skill.
