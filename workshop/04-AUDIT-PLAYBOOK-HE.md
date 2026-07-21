# Fan-out, Fan-in ו-Audit

## מתי עושים Fan-out

Fan-out מתאים כשאפשר לשאול כמה שאלות עצמאיות על אותו brief. כל מומחה מקבל:

- מטרה ושאלה אחת.
- קבצים או מקורות מדויקים.
- כלים והרשאות מצומצמים.
- חוזה פלט קבוע.
- תנאי עצירה.

בסדנה מפעילים Product, Design, Architecture ו-QA ברצף כדי לשמור usage. בסביבה מתאימה אפשר להריץ אותם במקביל מפני שאין תלות בין התשובות. Security מצטרף רק כשהשינוי חוצה גבול אמון: הרשאות, מידע רגיש, input חיצוני, dependency, MCP, CLI, Browser, SSH או deploy.

לא עושים fan-out כשהעבודה קטנה, כשהענפים תלויים זה בזה או כששני agents צפויים לבדוק את אותו דבר. יותר agents אינם מייצרים יותר מידע מעצמם.

## Fan-in

ה-Agent הראשי נשאר owner:

1. מסיר המלצות כפולות.
2. מסמן סתירות אמיתיות.
3. בוחר ומנמק tradeoff אחד.
4. שומר חלופות שנדחו והסיבה.
5. כותב Spec, Plan או verdict אחד — לא אוסף memos.

## שלוש נקודות Audit

| שלב | מה בודקים | תוצאה |
|---|---|---|
| לפני ביצוע | Goal, Spec, Plan, הרשאות וגבולות | `PASS / REPAIR / REPLAN / HUMAN DECISION` |
| במהלך ביצוע | diff מול Plan, בדיקה קרובה, scope, גבול אמון וראיה חדשה | להמשיך, לתקן או לחזור לתכנון |
| לפני מסירה | functionality, product/UX, architecture, security/privacy ו-evidence | Review עצמאי ללא עריכת קוד |

## חוזה Audit להעתקה

```text
AUDIT TARGET
Stage: PRE-FLIGHT | IN-FLIGHT | RELEASE
Claim being tested:
Acceptance criterion:

FINDING
Severity: BLOCKER | WARNING | PASS
Evidence: exact file, line, test, screenshot, log or reproduction
Impact: what can fail and who is affected
Action: smallest repair, replan or human decision required

VERDICT
PASS | REPAIR | REPLAN | HUMAN DECISION

Do not edit files. Do not praise or summarize generally.
If evidence is missing, the claim does not pass.
```

Audit טוב לא אומר רק שמשהו לא בסדר. הוא מחבר טענה לקריטריון, מציג ראיה שאפשר לפתוח ומבהיר מה צריך לקרות עכשיו.
