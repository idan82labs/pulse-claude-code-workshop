# מדריך למשתתף: Pulse עם Sonnet 5

המדריך הזה הוא עותק offline של שתי המשימות שב-Hub. ההוראות המעודכנות וה-prompts להעתקה נמצאים גם ב:

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

Sonnet 5 הוא מודל העבודה בשתי המשימות. ב-Plan Mode עובדים עם effort גבוה. רק אחרי שאדם מאשר את `PLAN.md` עוברים ל-Accept Edits, מורידים ל-effort בינוני ומבצעים יחידות עבודה תחומות.

אל תחברו production, אל תדביקו secrets ותנו רק את ההרשאות שנחוצות לתרגיל.

## מה ה-Bootstrap התקין ואיך משתמשים בזה

- ה-Plugin הגלובלי מוסיף את `/82labs-workshop:bootstrap`. זאת פקודת setup; לא עובדים דרכה על הפיצ׳ר.
- `CLAUDE.md` נטען אוטומטית כשפותחים Claude Code מתוך ה-repo.
- `.claude/skills/` מכילה workflows חוזרים. לדוגמה: `/write-feature-spec`, ‏`/architecture-plan` ו-`/ui-ux-review`.
- `.claude/agents/` מכילה מומחי Product, Design, Architecture, QA, Security ו-Review. Security מופעל רק כשיש גבול אמון, מידע רגיש או גישה חיצונית.
- `workshop/templates/` היא נקודת הפתיחה; `workshop-output/` היא תיקיית התוצרים והראיות.

```bash
cd ~/pulse-claude-code-workshop
claude
```

את Pulse מריצים עם `npm run dev`. אחרי שינוי מריצים `npm run verify`.

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
├── PRODUCT-DIRECTION.md
├── PRODUCT-MAP.md
├── GOAL.md
├── FEATURE_SPEC.md
├── PLAN.md
├── DECISIONS.md
├── REVIEW.md
├── CHANGE-WALKTHROUGH.md
└── EVIDENCE/
```

כל קובץ שומר את ההחלטות שצריך לשלב הבא. אחרי compaction, handoff או session חדש קוראים אותם מחדש במקום לסמוך על היסטוריית הצ׳אט.

## איך משתמשים ברשימת המשימות של Claude

ה-Goal הוא היעד הקבוע; ה-Plan שומר את החלטות הביצוע; רשימת המשימות מציגה את המסלול הנוכחי. Claude יכול להוסיף, לפצל או לסדר מחדש tasks כשמתגלה מידע חדש, אבל הוא לא משנה דרישה או מסמן `done` בלי ראיה.

בדקו לאורך הריצה:

1. יש רק task אחד שמסומן כמתבצע כרגע.
2. כל task קטן מספיק כדי להסתיים בבדיקה ברורה.
3. blocker או החלטה פתוחה נכתבים במפורש ולא נעלמים בתוך task כללי.
4. לפני מעבר ל-task הבא נשמרת ראיה: test, screenshot, log או diff שנבדק.
5. אחרי replan הרשימה מתעדכנת, אבל `GOAL.md` נשאר מקור האמת לתוצאה ולתנאי העצירה.

## משימה 01 — מבקשה עמומה לתוכנית שאפשר לבצע

לא עורכים קוד במשימה הזאת. קודם מריצים את Pulse ופותחים אותו בדפדפן. כל משתתף כותב take אישי: מה הוא ראה, למי הוא רוצה לעזור, איזו החלטה או פעולה הוא רוצה לשפר ומה לא ייכנס לגרסה הראשונה.

Claude ממפה את המסלול הקיים דרך UI, API, domain ו-tests ומציע שלושה כיוונים שמבוססים על המוצר והמידע שכבר קיימים. המשתתף בוחר, משלב או משנה אחד ושומר את ההחלטה ב-`PRODUCT-DIRECTION.md`. ה-Agent אינו בוחר את הפיצ׳ר במקום המשתתף.

אחר כך כותבים Goal עם non-goals, שלושה קריטריונים וראיה לכל אחד.

אחר כך עושים fan-out לקריאה בלבד: Product, Design, Architecture ו-QA מקבלים אותו brief, שאלה שונה וחוזה פלט קבוע. בסדנה מריצים אותם ברצף כדי לשמור usage. Security מצטרף רק כשהשינוי נוגע להרשאות, מידע רגיש, input חיצוני, dependency, MCP, CLI, browser, SSH או deploy; אחרת מתעדים `SECURITY NOT TRIGGERED` והסיבה.

ה-main agent עושה fan-in: מסיר כפילויות ומציג החלטות שמשנות את הכיוון. המשתתף נשאר product owner, מאשר או דוחה, ורק אז נכתב `FEATURE_SPEC.md` אחד.

לבסוף נכנסים ל-Plan Mode עם effort גבוה, טוענים את ה-Spec ואת ה-repo וכותבים את החתך השלם הקטן ביותר: קבצים מדויקים, contracts, invariants, failure propagation, בדיקה לכל criterion ותנאי עצירה.

ההבדל חשוב: ה-Spec אומר מה המוצר יעשה ולמה; ה-Plan אומר איך לממש אותו ובאיזה סדר; רשימת המשימות נוצרת מה-Plan בזמן הביצוע.

שומרים:

- `workshop-output/PRODUCT-DIRECTION.md`
- `workshop-output/PRODUCT-MAP.md`
- `workshop-output/GOAL.md`
- `workshop-output/FEATURE_SPEC.md`
- `workshop-output/PLAN.md`

סיימתם כשאפשר להעביר את חמשת הקבצים ל-session חדש והוא יכול להתחיל לבצע בלי לפתוח מחדש החלטת מוצר או ארכיטקטורה.

## משימה 02 — Skill, חתך עובד והוכחת איכות

ה-Spec מתאר את הפיצ׳ר המסוים: מה בונים, למי, מה הגבולות ואיך בודקים אותו. ה-Skill אורז שיקול דעת שחוזר גם במשימות אחרות: אילו שאלות לשאול, באיזה סדר לעבוד, מה לבדוק ומה נחשב תוצאה טובה. דרישות של Pulse נשארות ב-Spec; כללי עבודה מקצועיים שחוזרים עוברים ל-Skill.

`pulse-decision-ui` מופעל כשמתכננים או מבקרים decision-support UI. הקלט שלו הוא Goal, Spec, המסך הקיים והראיות. אסור לו להמציא עובדות על Pulse או לקבע layout אחד מראש.

מה עושים:

1. מריצים את אותו brief בלי Skill, שומרים baseline ונותנים לו ציון.
2. כותבים `.claude/skills/pulse-decision-ui/SKILL.md` עם trigger, inputs, workflow, boundaries, states, accessibility ורובריקה.
3. מאשרים את ה-Plan, עוברים ל-Accept Edits, מורידים ל-effort בינוני ומבצעים את `PLAN.md` בצעדים תחומים.
4. מריצים `npm run verify`, משווים לפני ואחרי מול אותה רובריקה ונותנים ל-reviewer עם context נקי לנסות להפריך את טענת הסיום.
5. כל finding מציין severity, criterion, ראיה מדויקת, impact, action ו-verdict אחד: `PASS / REPAIR / REPLAN / HUMAN DECISION`.

שומרים:

- `.claude/skills/pulse-decision-ui/SKILL.md`
- ה-diff והמסלול העובד
- `workshop-output/EVIDENCE/before-after.md`
- `workshop-output/REVIEW.md`
- `workshop-output/CHANGE-WALKTHROUGH.md`

סיימתם כשמסלול אחד עובד דרך UI, API, domain ו-test; כל שיפור מול ה-baseline קשור לכלל ב-Skill; וה-reviewer מחזיר PASS או blocker מדויק.

## Audit בשלוש נקודות

- לפני ביצוע: Goal, Spec, Plan, הרשאות וגבולות.
- במהלך ביצוע: diff מול Plan, בדיקה קרובה, scope, trust boundary וראיה חדשה.
- לפני מסירה: Reviewer נקי בודק functionality, product/UX, architecture, security/privacy ו-evidence בלי לערוך קוד.

התבנית המלאה נמצאת ב-`workshop/templates/AUDIT-CONTRACT.md` וב-Hub תחת Fan-out, Fan-in ו-Audit.

## כש-context מתפזר

```text
/compact Keep the goal, approved decisions, current blocker, evidence and exact next step.
```

אחר כך קוראים מחדש את `GOAL.md`, את `FEATURE_SPEC.md`, את `PLAN.md` ואת `REVIEW.md` אם הוא כבר קיים. למשימה לא קשורה משתמשים ב-`/clear` ומתחילים מ-context נקי.

## המשך בבית

ה-Capstone הוא מערכת full-stack עצמאית שבונים אחרי הסדנה. בוחרים כל בעיה אמיתית מהעולם שלכם ומריצים עליה את אותו רצף:

`Direction → Goal → Spec → Plan → Skill → Task list → Execute → Review → Evidence`

התוצר כולל UI responsive, server/API, מסד נתונים, write אמיתי, states, tests ו-URL חי. הוא כולל גם את הבעיה, ההחלטות, מה האצלתם, איך שמרתם את ה-Agent על המסלול ואיזו ראיה מוכיחה שהמערכת עובדת. הדרישות המלאות וקישורי הפריסה נמצאים ב-Hub וב-`homework.md`.
