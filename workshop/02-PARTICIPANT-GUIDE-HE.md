# מדריך למשתתף

## לפני שמתחילים

```bash
npm install
npm run verify
npm run dev
```

פתחו את `http://localhost:4310`, עברו על המסכים ובדקו את `/status` ב-Claude Code.

## שלב 0 — מיפוי וניסוי effort

לפני כתיבת ה-Spec, מפו את המוצר: מסכים, API, domain, tests וזרימת הנתונים. שמרו את המפה ב-`workshop-output/PRODUCT-MAP.md`.

לאחר מכן הריצו את אותו prompt של plan פעם אחת עם `/effort low` ופעם אחת עם `/effort high`. השוו לפי הנחות, קבצים, contracts, מצבי כשל ובדיקות; שמרו את המסקנה ב-`workshop-output/EFFORT-COMPARISON.md`, ואז החזירו `/effort auto`. אל תממשו קוד בניסוי.

Checkpoint: קיימים `PRODUCT-MAP.md` ו-`EFFORT-COMPARISON.md`, והחלטתם איזו רמת effort מספיקה למשימה.

## שלב 1 — מחקר ואפיון

הפעילו את `/write-feature-spec` על הבריף שב-`workshop/01-PROJECT-BRIEF-HE.md`.

בקשו מהסוכן הראשי להתייעץ עם ארבעת המומחים, אחד בכל פעם, ולסנתז מסמך אחד. אל תעבירו את ההחלטה למומחים.

Checkpoint: קיים `workshop-output/FEATURE-SPEC.md` עם יעד, non-goals, קריטריונים ותוכנית אימות.

## שלב 2 — packaged expertise

פתחו `http://localhost:4310/design-demo` והשוו בין שני התוצרים.

שאלו:

- מה התוצר הגנרי לא הבין על החלטת המשתמש?
- מה השתנה לאחר שימוש ב-UI/UX וב-design taste כ-Skills?
- אילו כללים ניתן להפוך ל-Skill חוזר בעולם המקצועי שלכם?

העתיקו את `workshop/templates/my-skill/` אל `.claude/skills/my-skill/`, מלאו את `SKILL.md` והריצו את ה-Skill על האפיון שלכם. שמרו את שתי ההרצות וההשוואה ב-`EVIDENCE/before-after.md`.

Checkpoint: `EVIDENCE/before-after.md` מראה לפחות שלוש החלטות שהשתפרו בגלל ידע או שיפוט שנארזו ב-Skill.

## שלב 3 — ארכיטקטורה ותוכנית

הפעילו `/architecture-plan`. בקשו רשימת קבצים מדויקת, זרימת נתונים, מצבי כשל ובדיקות. הציגו את התוכנית לפני ביצוע.

Checkpoint: ניתן להסביר מדוע זהו החתך הקטן ביותר שמייצר ערך מלא.

## שלב 4 — בנייה

ממשו את הפיצ׳ר לפי התוכנית. השתמשו במומחים רק למשימות ממוקדות. שמרו את הסשן הראשי להחלטות ולסינתזה.

Checkpoint: הפיצ׳ר עובד בנתיב אחד מקצה לקצה.

## שלב 5 — Loop Engineering

הפעילו `/loop-engineering`:

לפני הריצה, עברו על [`06-EXECUTION-LOOPS-HE.md`](06-EXECUTION-LOOPS-HE.md), נעלו Goal ובחרו את משטח ה-access הצר שמתאים למשימה.

1. בדיקה צרה.
2. `npm run verify`.
3. Review עצמאי באמצעות `change-reviewer`.
4. תיקון blockers בלבד.
5. עד שלושה סבבים.

Checkpoint: לכל קריטריון יש ראיה, או שיש blocker מתועד.

## שלב 6 — סיפור מקצועי

התכוננו להסביר בשלוש דקות:

- איזו בעיה זיהיתם.
- כיצד הרחבתם את המבט מעבר ל-ticket.
- מה האצלתם ולמי.
- איזו החלטה נשארה שלכם.
- מה נכשל וכיצד שיניתם את הלולאה.
- אילו ראיות תומכות בתוצאה.
