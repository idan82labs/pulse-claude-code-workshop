# Capstone עצמאי — מערכת full-stack משלכם

אחרי הסדנה בחרו בעיה אמיתית שמעניינת אתכם ובנו מערכת full-stack שאדם אחר יכול לפתוח, להשתמש בה ולבדוק. היא יכולה להגיע מעולם ה-QA, ה-DevOps, ה-Backend, ה-Full-stack, המוצר או מהחיים האישיים שלכם.

המוצר לא חייב להשתמש ב-AI. המטרה היא להשתמש ב-Claude ובמערכת העבודה שלמדנו כדי להוביל מוצר אמיתי מהרעיון עד URL חי.

חזרו ל-Hub לאורך העבודה: ה-prompts, מדריך ה-Skills, ה-Spec canvas, ה-audit playbook וקישורי הפריסה נמצאים שם לפי אותו סדר שלמדנו.

## 1. בוחרים בעיה לפני שבוחרים stack

כתבו `PRODUCT-DIRECTION.md`:

```md
# Observation
מה ראיתי בעולם האמיתי שמבזבז זמן, יוצר סיכון או מקשה על החלטה?

# User
מי נתקל בבעיה ומתי?

# Workflow
איזו פעולה או החלטה המערכת תשפר?

# Value
מה יהיה קל, מהיר, ברור או בטוח יותר?

# Non-goals
מה לא נכנס לגרסה הראשונה?
```

אם צריך כיוון, אפשר לבנות triage ל-QA, incident tracker, change approvals, service health, workflow עם validation ו-audit log, operations dashboard, scheduling, feedback prioritization או כלי אישי שבאמת תרצו להשתמש בו. אלה רעיונות, לא רשימת נושאים סגורה.

## 2. דרישות המוצר המינימליות

המערכת חייבת לכלול:

1. UI responsive שאפשר להשתמש בו גם במסך צר.
2. server/API או server actions עם validation.
3. מסד נתונים מתמשך לבחירתכם.
4. לפחות פעולה אחת שמשנה state ועוברת מה-UI עד למסד הנתונים.
5. loading, empty, error ו-success states שאפשר להפעיל ולבדוק.
6. טיפול בכשל בצד השרת והודעה שימושית בצד המשתמש.
7. לפחות unit או domain test אחד ו-integration/API test אחד.
8. URL חי שאפשר לפתוח ללא סביבת הפיתוח שלכם.
9. README עם setup, architecture, environment variables והחלטות חשובות.
10. `.env.example` ללא secrets אמיתיים.

Authentication, תשלומים ושימוש ב-LLM API הם אופציונליים. אם הם לא חלק מהבעיה שבחרתם, אל תוסיפו אותם רק כדי שהפרויקט ייראה מורכב.

## 3. מערכת העבודה שצריך להראות

### Choose

- `PRODUCT-DIRECTION.md` — התצפית, שלוש חלופות, הבחירה שלכם ומה דחיתם.
- `GOAL.md` — outcome, non-goals, criteria, evidence ו-stop rules.

### Spec

- `FEATURE_SPEC.md` — המשתמש, ההתנהגות, states, constraints ו-acceptance criteria.
- fan-out ממוקד ל-Product, Design, Architecture ו-QA. Security מצטרף רק כשיש trigger.
- אתם נשארים product owner ומאשרים החלטות שמשנות את הכיוון.

### Plan

- פתחו Plan Mode וטענו את ה-Spec ואת ה-repo.
- `PLAN.md` צריך להכיל קבצים, interfaces, invariants, failure propagation, סדר עבודה ובדיקה לכל criterion.
- ה-Spec אומר מה ולמה; ה-Plan אומר איך ובאיזה סדר.

### Build

- כתבו Skill אחד לעבודה מקצועית שחוזרת בפרויקט שלכם.
- הפכו את ה-Plan לרשימת משימות עם task פעיל אחד.
- סמנו task כ-complete רק אחרי הבדיקה הקרובה והראיה שלו.
- השתמשו ב-subagents לשאלות ממוקדות ולביקורת, לא כדי להעביר להם את בעלות המוצר.
- אם מתגלה החלטת מוצר או architecture חדשה, חזרו ל-Plan במקום להחליק אותה לתוך הקוד.

### Prove

- `DECISIONS.md` — החלטות, חלופות והסיבה לבחירה.
- `EVIDENCE/` — test output, screenshots, API evidence, before/after ו-review.
- Reviewer ב-context נקי מנסה להפריך שסיימתם ומחזיר `PASS / REPAIR / REPLAN / HUMAN DECISION`.

## 4. לולאת איכות

1. שמרו baseline לפני הפעלת ה-Skill.
2. הגדירו rubric קבוע ל-functionality, correctness, UX ו-evidence.
3. הריצו את אותו workflow עם ה-Skill.
4. בקשו reviewer חדש לזהות את שלושת הפערים בעלי ההשפעה הגבוהה ביותר.
5. תקנו שינוי ממוקד והריצו שוב את אותה רובריקה.
6. עצרו ב-target, ב-blocker, בתקציב או אחרי שלושה סבבים.

## 5. Definition of Done

- URL חי.
- נתונים נשמרים במסד הנתונים.
- נתיב אחד עובד מה-UI עד למסד וחזרה.
- קיימים validation ומצב כשל שניתן להפעיל.
- הבדיקות עוברות.
- כל acceptance criterion ממופה לראיה שאדם אחר יכול לפתוח.
- reviewer עצמאי מחזיר verdict מנומק.
- README מאפשר לאדם אחר להבין ולהריץ את המערכת.
- תיק העבודה כולל Direction, Goal, Spec, Plan, Skill, decisions ו-evidence.

## 6. אפשרויות פריסה

- Vercel: https://vercel.com/docs/deployments
- Cloudflare Pages / Workers: https://developers.cloudflare.com/pages/
- Supabase Postgres: https://supabase.com/docs/guides/database/overview
- Neon Postgres: https://neon.com/docs/get-started/signing-up
- Railway: https://docs.railway.com/

הטכנולוגיה לבחירתכם. הבחירה אינה הציון; המוצר, קבלת ההחלטות, איכות הביצוע והראיות כן.

## 7. מה מביאים להצגה

הכינו walkthrough קצר:

1. הבעיה והמשתמש שבחרתם.
2. ה-product take המקורי ושלוש החלופות ששקלתם.
3. החלטה אחת שסגרתם ב-Spec לפני הקוד.
4. איך ה-Spec הפך ל-Plan ולרשימת משימות.
5. איזה Skill בניתם ומה הוא שינה.
6. כשל אחד שמצאתם ואיך תיקנתם אותו.
7. הראיות שמוכיחות שהמערכת עובדת.

הסיפור אינו "Claude בנה לי". הסיפור הוא איך השתמשתם ב-Claude כדי להוביל מערכת עבודה, לשמור בעלות על ההחלטות ולהגיע למוצר שאפשר להגן עליו.
