# Runbook: Agentic Execution Loops

לולאת ביצוע חוזרת על ארבע פעולות ברורות:

```text
Goal → Observe → Decide → Act → Verify
                         ↘ PASS / REPAIR / ESCALATE
```

כל סיבוב צריך לייצר ראיה חדשה. אם לא למדנו משהו חדש, אין סיבה לצפות שהסיבוב הבא יהיה טוב יותר.

הכלים הרחיבו את סוג ה-observation שה-agent יכול לקבל. API מחזיר נתונים מובנים, CLI ו-MCP משנים state, Browser מפעיל flow אמיתי, ו-computer use מחזיר screenshots גם כשאין API ייעודי. Vision מכניס את התוצאה החזותית לתוך הלולאה:

```text
Render → Screenshot → Critique → Revise → Re-render
```

צילום מסך לבדו לא מספיק. צרפו כשאפשר DOM, console, network, test output וה-state שהוביל למסך.

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

## 0.5. מצב ההרשאה הוא חלק מחוזה הביצוע

| מצב | מה קורה | שימוש נכון |
|---|---|---|
| `default` | קריאה עובדת; עריכות ופקודות שדורשות הרשאה עוצרות לאישור | התחלה בטוחה ועבודה רגישה |
| `acceptEdits` | עריכת קבצים ופעולות filesystem שכיחות מאושרות; פעולות terminal אחרות עדיין עשויות לעצור | מצב הביצוע בסדנה, אחרי אישור ה-Plan |
| `plan` | Claude חוקר ומתכנן בלי לערוך את קוד המקור | לפני שינוי משמעותי ובכל replan |
| `auto` | פעולות רצות בלי prompt לכל צעד, עם classifier בטיחות ברקע | תלוי חשבון וסביבה; מכירים, אך לא משתמשים בסדנה |
| `bypassPermissions` | שכבת ההרשאות נעקפת | רק ב-container או VM מבודדים וזמניים, בלי credentials ובלי גישה למחשב המארח |

הזרימה בסדנה היא:

```text
PLAN mode → human approval → ACCEPT EDITS → bounded execution → verify
```

אם במהלך הביצוע נפתחת החלטת מוצר, ארכיטקטורה, scope או permission חדשה, חוזרים ל-Plan Mode. `bypassPermissions` והדגל המקביל `--dangerously-skip-permissions` אינם דרך להיפטר מהפרעות; בלי בידוד אמיתי הם מסירים את שכבת ההגנה הלא נכונה.

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

## 1.5. מפרידים בין done לבין איכות

`done` אומר שהקריטריונים הפונקציונליים עברו. הוא לא אומר שהתוצאה ברורה, חזקה או מוכנה למסירה.

1. הגדירו rubric לפני הריצה: functionality, correctness, UX ו-evidence.
2. כתבו anchors: מה נראה כמו 5/10 ומה נראה כמו 10/10 בכל ממד.
3. שמרו ציון baseline.
4. בקשו critique על שלושת הפערים בעלי ההשפעה הגבוהה ביותר.
5. תקנו שינוי ממוקד והריצו את אותו rubric עם reviewer טרי.
6. עצרו ב-target, ב-blocker, בתקציב או אחרי שלושה סבבים.

אל תשנו את הרובריקה באמצע כדי לעבור. הציון אינו אמת אובייקטיבית; הוא חוזה שמכריח את הצוות להגדיר מה פירוש ״טוב״ ולשמור ראיות לשיפור.

## 1.75. עושים Fan-out רק לשאלות עצמאיות

```text
SHARED BRIEF
  ├─ Product
  ├─ Design
  ├─ Architecture
  ├─ QA
  └─ Security — conditional
          ↓
OWNER: dedupe → resolve conflicts → one decision
```

כל branch מקבל שאלה אחת, מקורות מדויקים, כלים צרים, פורמט תשובה ותנאי עצירה. בסדנה מריצים ברצף כדי לשמור usage. במערכת עם תקציב מתאים אפשר להריץ במקביל רק ענפים שאין ביניהם תלות.

Security מופעל כשהשינוי נוגע להרשאות, מידע רגיש, input חיצוני, dependency, MCP, CLI, Browser, SSH או deploy. אם אין trigger, מתעדים זאת ולא צורכים Agent רק כדי למלא רשימה.

ה-owner עושה fan-in: מסיר כפילויות, פותר סתירות, מתעד חלופות שנדחו ומוציא Spec או verdict אחד. לא מחברים memos.

לא עושים fan-out למשימה קטנה, לעבודה שיש בה סדר תלות קשיח או לשאלות חופפות. עוצרים ענף שלא מחזיר מידע חדש.

## 2. נותנים גישה לפי המשימה

| משימה | משטח | Access | Guardrail | Evidence |
|---|---|---|---|---|
| קוד וקבצים מקומיים | CLI | repo + branch/worktree + פקודות build/test | בלי secrets ובלי production credentials | diff + test output |
| נתונים או פעולה חיצונית | MCP | connector ספציפי + OAuth scope צר | להפריד read מ-write | record ID + audit trail |
| flow חזותי | Browser | test account + environment מוגדר | states ו-completion criterion | screenshot + DOM/state |
| execution מרוחק הכרחי | SSH | משתמש מוגבל + staging + allowlist | timeout, logs, rollback; לא prod-first | command log + health check |
| parallel, background או deploy | CI / Cloud | sandbox/worktree/branch לכל agent | approval gate לפני פעולה בלתי הפיכה | checks + artifact + status |

SSH הוא לא קיצור דרך. אם CI, API או MCP יכולים לבצע פעולה מוגדרת ומבוקרת, העדיפו אותם על shell חופשי.

## 2.5. Audit קורה לפני, במהלך ואחרי

| נקודה | בודקים | תוצאה |
|---|---|---|
| Pre-flight | Goal, Spec, Plan, permissions וגבולות | `PASS / REPAIR / REPLAN / HUMAN DECISION` |
| In-flight | diff מול Plan, בדיקה קרובה, scope, trust boundary וראיה חדשה | ממשיכים, מתקנים או חוזרים לתכנון |
| Release | functionality, product/UX, architecture, security/privacy ו-evidence | Reviewer נקי, בלי עריכת קוד |

כל finding חייב לכלול severity, criterion, ראיה מדויקת, impact ו-action. אם אין ראיה, הטענה אינה עוברת. התבנית נמצאת ב-`workshop/templates/AUDIT-CONTRACT.md`.

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

### תמונת מצב של המודלים, 20.07.2026

המחירים הבאים הם מחירי API בדולר למיליון tokens, input / output. הם נועדו להמחיש את כלכלת הניתוב; אין צורך ב-API כדי לבצע את תרגילי הסדנה.

| Tier | מודלים לדוגמה | מחיר | מתי לבחור |
|---|---|---:|---|
| Frontier | Claude Fable 5 | $10 / $50 | תכנון ארוך, migration מורכב, ambiguity גבוהה וביקורת סופית |
| Frontier | GPT-5.6 Sol | $5 / $30 | תכנון, בעיות מקצועיות מורכבות ו-verification |
| Workhorse | Claude Sonnet 5 | $2 / $10 עד 31.08.2026 | רוב עבודת ההנדסה והביצוע היומיומי |
| Workhorse | GPT-5.6 Terra | $2.50 / $15 | איזון בין יכולת לעלות |
| Fast | GPT-5.6 Luna | $1 / $6 | משימות תחומות, חזרתיות ו-latency נמוך |
| Open frontier | Kimi K3 | $3 / $15; cached input $0.30 | agentic coding, long context ושליטה ב-deployment |

מקורות: [Anthropic Fable](https://www.anthropic.com/claude/fable), [OpenAI model tiers](https://developers.openai.com/api/docs/models/compare), [Kimi K3](https://www.kimi.com/fr-fr/blog/kimi-k3).

### למה max אינו ברירת מחדל

ב-DeepSWE v1.1, מעבר של Fable 5 מ-`high` ל-`max` שיפר את Pass@1 בכ-1.1 נקודות בלבד, מ-68.6% ל-69.7%, בזמן שהעלות הממוצעת למשימה עלתה מ-$9.18 ל-$21.63, פי 2.36. זה בדיוק ההבדל בין "הכי חזק" לבין "הכי נכון למשימה".

השתמשו ב-`max` כשעלות הכשל גבוהה והמשימה באמת דורשת exploration ארוך. בשאר המקרים התחילו ב-`medium` או `high`, מדדו מול eval קבוע והעלו effort רק אם השיפור מצדיק את העלות. מקור: [DeepSWE v1.1](https://deepswe.datacurve.ai/).

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
