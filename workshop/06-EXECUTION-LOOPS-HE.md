# Runbook: Agentic Execution Loops

לולאת ביצוע חוזרת על ארבע פעולות ברורות:

```text
Goal → Observe → Decide → Act → Verify
                         ↘ PASS / REPAIR / ESCALATE
```

כל סיבוב צריך לייצר ראיה חדשה. אם לא למדנו משהו חדש, אין סיבה לצפות שהסיבוב הבא יהיה טוב יותר.

## 0. בוחרים את המנגנון הנכון

| צורך | מנגנון | למה |
|---|---|---|
| כללי repo שתמיד צריכים להיות זמינים | `CLAUDE.md` | context קבוע; שמרו אותו קצר, ספציפי ולא סותר |
| ידע, רובריקה או workflow שחוזרים | Skill | נטען לפי צורך בתוך ה-context הראשי |
| משימת צד רועשת או מומחה ממוקד | subagent | context מבודד שמחזיר summary; לא מניחים שהוא ראה את כל השיחה |
| נתונים או פעולות מחוץ ל-repo | MCP | connector והרשאה צרה; מפרידים read מ-write |
| בדיקה או חסימה שחייבות לרוץ תמיד | hook | אוטומציה דטרמיניסטית באירוע כמו `PreToolUse` או `PostToolUse` |
| הפצה לצוות | plugin | חבילה של Skills, agents, hooks ו-MCP |

`CLAUDE.md` הוא הוראה התנהגותית, לא שכבת enforcement. חסימת כלים, paths או פקודות שייכת ל-permissions, sandbox או hook חוסם. לפי תיעוד Anthropic, קובץ קצר ומובנה, סביב 200 שורות לכל היותר, נוטה להישמר טוב יותר ב-context.

## 1. מגדירים מראש מה נחשב הצלחה

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

## 2. נותנים גישה לפי המשימה

| משימה | משטח | Access | Guardrail | Evidence |
|---|---|---|---|---|
| קוד וקבצים מקומיים | CLI | repo + branch/worktree + פקודות build/test | בלי secrets ובלי production credentials | diff + test output |
| נתונים או פעולה חיצונית | MCP | connector ספציפי + OAuth scope צר | להפריד read מ-write | record ID + audit trail |
| flow חזותי | Browser | test account + environment מוגדר | states ו-completion criterion | screenshot + DOM/state |
| execution מרוחק הכרחי | SSH | משתמש מוגבל + staging + allowlist | timeout, logs, rollback; לא prod-first | command log + health check |
| parallel, background או deploy | CI / Cloud | sandbox/worktree/branch לכל agent | approval gate לפני פעולה בלתי הפיכה | checks + artifact + status |

SSH הוא לא קיצור דרך. אם CI, API או MCP יכולים לבצע פעולה מוגדרת ומבוקרת, העדיפו אותם על shell חופשי.

## 3. מנתבים מודלים לפי שלב

```text
PLAN (strong) → EXECUTE (fast/cheap) → FALSIFY (strong)
```

- תנו למודל חזק לתכנן כשיש עמימות, tradeoffs, צורך לפרק עבודה או להגדיר interface contracts.
- העבירו את הביצוע למודל זול ומהיר רק כשהקבצים, הפקודות, ה-tests והיקף השינוי כבר ברורים.
- השתמשו שוב במודל חזק לביקורת עצמאית שמנסה להפריך את ההנחות ואת הראיות.
- חזרו מיד ל-planner כשיש architecture drift, דרישה עמומה, invariant שנכשל או צורך להרחיב הרשאה.
- נסו `/model opusplan`: מודל חזק מתכנן ומודל מהיר יותר מבצע, אם המסלול זמין בחשבון. אם הוא לא מופיע ב-`/model`, הישארו עם המודל הזמין ואל תבנו את התרגיל סביב שם מסוים.

Model delegation לא חוסך כסף מעצמו. Plan גרוע ו-retries יכולים למחוק את כל החיסכון.

## 4. מפרידים מודל, effort והרשאות

אלה שלוש החלטות שונות:

```text
MODEL  = מעטפת היכולת
EFFORT = כמה reasoning להקצות בתוך המעטפת
ACCESS = מה הסוכן רשאי לקרוא, לשנות ולהפעיל
```

ב-Claude Code הריצו `/effort` כדי לבחור רמה, או `/effort auto` כדי לחזור לברירת המחדל של המודל:

| רמה | שימוש נכון |
|---|---|
| `low` | משימה קצרה, תחומה, מהירה ולא רגישה לעומק שיקול הדעת |
| `medium` | עבודה ברורה שבה חיסכון בשימוש חשוב יותר מעוד מעט עומק |
| `high` | ברירת מחדל טובה לרוב עבודת הפיתוח; מינימום למשימה intelligence-sensitive |
| `xhigh` | עבודה סוכנית מורכבת, כשהמודל והחשבון תומכים ברמה |
| `max` | משימה קשה וחד-פעמית; התוספת לא תמיד מצדיקה את העלות ועלולה לגרום ל-overthinking |

אותו שם effort לא מייצג את אותו reasoning budget בכל מודל. התמיכה ברמות משתנה לפי מודל, חשבון וגרסה; בדקו `/model` ו-`/status` בבוקר הסדנה. `max` הוא session-only, אלא אם הוגדר דרך משתנה סביבה. המילה `ultrathink` מבקשת עומק נוסף לפנייה אחת, אבל לא משנה את רמת ה-effort שנשלחת ל-API.

תרגיל של 8 דקות:

1. הריצו `/effort low` ובקשו plan בלבד ל-feature, בלי לערוך קוד.
2. שמרו את התשובה.
3. הריצו `/effort high` ושלחו בדיוק את אותו prompt.
4. צרו `workshop-output/EFFORT-COMPARISON.md` והשוו: הנחות, קבצים ו-contracts, failure propagation, tests, שאלות פתוחות, latency ונטייה ל-overthink.
5. חזרו עם `/effort auto`.

המודל, ה-effort, אורך ה-context והפעלת כלים משפיעים על זמן ועלות. שמרו working set קטן והפעילו `max` רק כששיפור ההחלטה מצדיק את המחיר.

## 5. שומרים את מצב העבודה מחוץ לצ׳אט

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

Compaction מסכם את היסטוריית השיחה כדי לפנות מקום. Project-root `CLAUDE.md` ו-auto memory נטענים מחדש; הוראות שנשארו רק בשיחה, rules תלויות-path ו-`CLAUDE.md` מקונן עלולים להיעלם עד לקריאה מחדש. אל תשתמשו בצ׳אט כ-system of record.

## 6. מריצים שלושה סבבים לכל היותר

1. Inspect + spec + vertical-slice plan.
2. Implement + tests + screenshot.
3. Reviewer עצמאי מנסה להפריך; מבצעים repair אחד.

עדיין לא עבר? עוצרים וכותבים `workshop-output/HANDOFF.md`:

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

## 7. מבינים מה נכשל לפני שעושים retry

- transient tool/network failure → retry מוגבל עם backoff.
- deterministic code/test failure → repair ממוקד ואז rerun.
- ambiguous spec → stop + escalate; לא ממציאים requirement.
- permission/security boundary → human approval gate.
- invariant/architecture failure → חוזרים ל-planner חזק.

לכל פעולה מסוכנת צריך להיות checkpoint, rollback ו-log. פעולה שחוזרת צריכה להיות idempotent. בעבודה מקבילית, הגדירו worktree/branch ו-owner ברור לכל artifact.

תוכן חיצוני הוא data, לא authority. אל תכניסו secrets ל-context, ל-log או ל-Skill.
