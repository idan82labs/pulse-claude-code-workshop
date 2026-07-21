# מדריך למשתתף: שתי משימות, תהליך עבודה אחד

ההוראות המעודכנות, כל ה-prompts וקבצי ההורדה נמצאים גם ב-Hub:

`https://labs82-claude-code-workshop.idan-t927194.chatgpt.site/#practice`

## לפני שמתחילים

```bash
claude --version
npm install
npm run verify
npm run dev
```

פתחו את `http://localhost:4310`. בתוך Claude Code בדקו:

```text
/model sonnet
/effort high
/permissions
/context
```

בשלב התכנון עובדים ב-Plan Mode עם effort גבוה. רק אחרי שאדם מאשר את `PLAN.md` עוברים ל-Accept Edits: עריכת הקבצים תאושר אוטומטית, ופעולות terminal אחרות עדיין יבקשו אישור. אז מורידים ל-effort בינוני ומבצעים יחידות עבודה תחומות.

## מצבי ההרשאה שצריך להכיר

| מצב | מה הוא מאפשר | מתי נשתמש בו |
|---|---|---|
| `default` | קריאה ללא עצירה; עריכה ופקודות שדורשות הרשאה עוצרות לאישור | היכרות ראשונה או עבודה רגישה |
| `acceptEdits` | מאשר עריכת קבצים ופעולות filesystem שכיחות; פעולות terminal אחרות עדיין עשויות לעצור | מצב הביצוע בסדנה, אחרי אישור ה-Plan |
| `plan` | מאפשר לחקור ולתכנן בלי לערוך את קוד המקור | תמיד לפני משימה 01 ולפני שינוי כיוון |
| `auto` | מאפשר רצף עבודה בלי prompt לכל פעולה, עם בדיקות בטיחות ברקע | מצב תלוי חשבון וסביבת עבודה; מכירים אותו, אבל לא משתמשים בו בסדנה |
| `bypassPermissions` | עוקף את שכבת ההרשאות | רק ב-container או VM מבודדים וזמניים, בלי credentials ובלי גישה למחשב המארח |

`bypassPermissions` והדגל המקביל `--dangerously-skip-permissions` אינם קיצור דרך. לא מפעילים אותם על המחשב האישי, ב-repo אמיתי או בסביבה שמחוברת ל-secrets, לחשבונות או ל-production.

## הקבצים שנשמור

```text
workshop-output/
├── PRODUCT-MAP.md
├── GOAL.md
├── FEATURE_SPEC.md
├── PLAN.md
├── DECISIONS.md
├── REVIEW.md
├── CHANGE-WALKTHROUGH.md
└── EVIDENCE/
```

## משימה 01 — מבקשה עמומה לתוכנית שאפשר לבצע

במשימה הזאת עדיין לא עורכים קוד.

1. קוראים את בריף המוצר ואת ה-repo וממפים את המסלול הקיים דרך UI, API, domain ו-tests.
2. כותבים Goal עם non-goals, שלושה קריטריונים וראיה לכל קריטריון.
3. מפעילים Product, Design, Architecture ו-QA כ-subagents לקריאה בלבד. כל מומחה מחזיר שתי המלצות, סיכון ושאלה פתוחה.
4. ה-main agent נשאר owner: הוא פותר סתירות וכותב `FEATURE_SPEC.md` אחד, לא ארבעה memos מחוברים.
5. נכנסים ל-Plan Mode וכותבים את החתך השלם הקטן ביותר: קבצים מדויקים, contracts, invariants, מצבי כשל, בדיקה לכל criterion ותנאי עצירה.

שומרים `PRODUCT-MAP.md`, `GOAL.md`, `FEATURE_SPEC.md` ו-`PLAN.md` בתוך `workshop-output/`.

סיימתם כשאפשר להעביר את `PLAN.md` ל-session חדש והוא יכול להתחיל לבצע בלי לפתוח מחדש החלטת מוצר או ארכיטקטורה.

## משימה 02 — Skill, חתך עובד והוכחת איכות

ה-Spec מתאר את הפיצ׳ר המסוים: מה בונים, למי, מה הגבולות ואיך בודקים אותו. ה-Skill אורז שיקול דעת שחוזר גם במשימות אחרות: אילו שאלות לשאול, באיזה סדר לעבוד, מה לבדוק ומה נחשב תוצאה טובה. דרישות של Pulse נשארות ב-Spec; כללי עבודה מקצועיים שחוזרים עוברים ל-Skill.

בסדנה נבנה `pulse-decision-ui`. הוא מופעל כשמתכננים או מבקרים ממשק שעוזר למשתמש לקבל החלטה. הוא מגדיר היררכיה, states, נגישות, workflow ורובריקה. אסור לו להמציא עובדות על Pulse או לקבע layout אחד מראש.

1. מריצים את אותו brief בלי Skill, שומרים baseline ונותנים לו ציון.
2. כותבים `.claude/skills/pulse-decision-ui/SKILL.md` עם trigger, inputs, workflow, boundaries, states, accessibility ורובריקה.
3. מאשרים את ה-Plan, עוברים ל-Accept Edits, מורידים ל-effort בינוני ומבצעים את `PLAN.md` בצעדים תחומים.
4. משלימים מסלול אחד דרך UI, API, domain ו-test, כולל loading, empty, error ו-recovery רלוונטיים.
5. מריצים `npm run verify`, משווים לפני ואחרי מול אותה רובריקה ונותנים ל-reviewer עם context נקי לנסות להפריך את טענת הסיום.

שומרים את ה-Skill, ה-diff, `EVIDENCE/before-after.md`, `REVIEW.md` ו-`CHANGE-WALKTHROUGH.md`.

סיימתם כשמסלול אחד עובד מקצה לקצה, כל שיפור מול ה-baseline קשור לכלל ב-Skill, וה-reviewer מחזיר PASS או blocker מדויק.

## כש-context מתפזר

```text
/compact Keep the goal, approved decisions, current blocker, evidence and exact next step.
```

אחר כך קוראים מחדש את `GOAL.md`, את `FEATURE_SPEC.md`, את `PLAN.md` ואת `REVIEW.md` אם הוא כבר קיים. למשימה לא קשורה משתמשים ב-`/clear` ומתחילים מ-context נקי.

## המשך בבית

ה-Capstone לוקח בעיה מהעולם שלכם ומריץ עליה את אותו רצף:

`Goal → Spec → Skill → Plan → Execute → Review → Evidence`

התוצר לראיון אינו רק URL חי. הוא כולל את הבעיה, ההחלטות, מה האצלתם, איך שמרתם את ה-Agent על המסלול ואיזו ראיה מוכיחה שהמערכת עובדת.
