# הגיל שלי 🌸 (My Age)

> **אפליקציה מתוקה לחישוב והצגת גיל הילד/ה בעברית תקנית, עם הקראה קולית והתאמה אישית.**  
> *A delightful Hebrew age calculation & milestone tracking app for kids, featuring accurate Hebrew grammar, TTS voice narration, and Capacitor Android support.*

---

## ✨ תכונות עיקריות | Features

- 🎂 **חישוב גיל מדויק בעברית תקנית**:
  - מציג שנים, חודשים וימים בדיוק מרבי.
  - התאמה דקדוקית מלאה (זכר/נקבה, צורות זוגיות: יומיים, שבועיים, חודשיים, שנתיים, חיבור אותיות ו' ועוד).
- 🔊 **הקראה קולית (Text-to-Speech)**:
  - כפתור "הקריאי לי!" המקריא את גיל הילד/ה בעברית שוטפת.
  - תמיכה בבחירת קול / גובה צליל (קול אישה / קול גבר).
  - מותאם גם לדפדפן (Web Speech API) וגם ל-WebView / Native באנדרואיד.
- 🖼️ **התאמה אישית**:
  - הגדרת שם הילד/ה וברכת שלום דינמית לפי שעות היום (בוקר, צהריים, ערב, לילה).
  - העלאת תמונה אישית עם חיתוך וכיווץ אוטומטי לשמירה מהירה ב-`localStorage`.
- 🎉 **ספירה לאחור ליום ההולדת הבא**:
  - כרטיסייה חגיגית עם מספר הימים/החודשים שנותרו עד יום ההולדת הבא והתראת יום הולדת שמח.
- 📱 **מוכן למובייל (Android / Cross-Platform)**:
  - פותח ב-HTML5, Vanilla CSS ו-JavaScript נקי ללא ספריות כבדות.
  - עטוף באמצעות **Capacitor 6** עבור פלטפורמת Android.
- 🎨 **עיצוב מותאם לילדים (RTL)**:
  - ממשק מימין לשמאל מלא, צבעוניות עדינה ונעימה, אנימציות צפות ואפקט קונפטי חגיגי.

---

## 📁 מבנה הפרויקט | Project Structure

```text
My-Age/
├── README.md                      # מסמך התיעוד הראשי
├── children.png                   # תמונת המחשה / אייקון
└── baby-age-app/                  # תיקיית האפליקציה
    ├── package.json               # תלויות והגדרות פקודות
    ├── capacitor.config.json      # קובץ הגדרות Capacitor
    ├── android/                   # פרויקט Native לאנדרואיד (Gradle / Android Studio)
    └── www/                       # קבצי ה-Web הסטטיים
        ├── index.html             # שלד האפליקציה (מסך הגדרות ומסך ראשי)
        ├── style.css              # עיצוב מודרני, אנימציות, תמיכה ב-RTL
        ├── app.js                 # לוגיקת גיל, דקדוק עברי, TTS, שמירה מקומית
        └── children.png           # נכס גרפי
```

---

## 🚀 התקנה והרצה | Getting Started

### דרישות מוקדמות | Prerequisites
- [Node.js](https://nodejs.org/) (גרסה 18 ומעלה מומלצת)
- [Android Studio](https://developer.android.com/studio) (רק לצורך קימפול והרצה על מכשיר אנדרואיד / אמולטור)

---

### 🌐 הרצה מקומית בדפדפן (Web)

1. עברו אל תיקיית האפליקציה:
   ```bash
   cd baby-age-app
   ```

2. התקינו תלויות (במידת הצורך):
   ```bash
   npm install
   ```

3. הפעילו שרת מקומי:
   ```bash
   npm start
   ```
   *האפליקציה תפתח בכתובת המקומית (לרוב `http://localhost:3000` או פורט זמין אחר).*

---

### 📱 בנייה והתקנה על מכשיר אנדרואיד (Android Build & Install)

ניתן לבנות ולהתקין את קובץ ה-APK בשתי דרכים עיקריות: דרך **Android Studio** (ממשק גרפי) או ישירות מ**שורת הפקודה (CLI)**.

---

#### 🛠️ שלב 1: סנכרון קבצי ה-Web לפרויקט האנדרואיד
בכל פעם שמבצעים שינויים בקבצים שבתיקיית `www`, יש לעדכן את פרויקט ה-Native:
```bash
cd baby-age-app
npx cap copy
npx cap sync
```

---

#### 🔨 שלב 2: בניית קובץ ה-APK (Build APK)

##### אפשרות א': בנייה דרך Android Studio (מומלץ ופשוט)
1. פתחו את פרויקט האנדרואיד ב-Android Studio:
   ```bash
   npx cap open android
   ```
2. בתפריט העליון לחצו על:  
   **`Build`** ➔ **`Build Bundle(s) / APK(s)`** ➔ **`Build APK(s)`**
3. בסיום הבנייה, תקפוץ הודעה בפינה הימנית-תחתונה. לחצו על **`locate`** כדי לפתוח את התיקייה שבה נוצר הקובץ (`app-debug.apk`).

##### אפשרות ב': בנייה דרך שורת הפקודה (Terminal / Gradle)
בשורת הפקודה (PowerShell / CMD ב-Windows):
```bash
cd baby-age-app/android
.\gradlew assembleDebug
```
*(ב-Linux / Mac יש להריץ: `./gradlew assembleDebug`)*

📌 **מיקום הקובץ שנוצר:**  
`baby-age-app/android/app/build/outputs/apk/debug/app-debug.apk`

---

#### 📲 שלב 3: התקנת ה-APK במכשיר אנדרואיד (Install on Device)

##### שיטה 1: העברה ישירה למכשיר (הכי מהיר למשתמשים)
1. העבירו את הקובץ `app-debug.apk` לטלפון הנייד (דרך WhatsApp, Telegram, Google Drive, שליחה במייל לעצמכם, או חיבור כבל USB).
2. פתחו את הקובץ בטלפון ולחצו על **התקן (Install)**.
3. *הערה:* אם המערכת מתריעה על "התקנה ממקורות לא מוכרים" (Install from Unknown Sources), יש לאשר את ההרשאה בהגדרות המכשיר עבור מנהל הקבצים/האפליקציה שממנה פתחתם את הקובץ.

##### שיטה 2: התקנה מהירה באמצעות ADB (למפתחים)
1. חברו את הטלפון למחשב באמצעות כבל USB וודאו ש-**USB Debugging (ניפוי שגיאות)** מופעל בהגדרות המפתחים.
2. הריצו בטרמינל:
   ```bash
   adb install -r baby-age-app/android/app/build/outputs/apk/debug/app-debug.apk
   ```

##### שיטה 3: הרצה ישירה מתוך Android Studio
1. חברו את המכשיר ב-USB או הפעילו Emulator.
2. לחצו על כפתור ה-Play הירוק **Run 'app'** (`Shift + F10`) ב-Android Studio. האפליקציה תיבנה ותותקן ישירות במכשיר.

---

## 🧠 לוגיקה ופרטים טכניים | Technical Highlights

### 1. מנוע הדקדוק העברי
הפונקציות `formatAgeHebrew` ו-`formatAgeHebrewSpoken` ב-[app.js](file:///c:/MyRepositories/My-Age/baby-age-app/www/app.js) מתחשבות בחוקי השפה העברית:
- **שנים** – נספרות בנקבה (*שנה אחת, שנתיים, שלוש שנים*).
- **חודשים וימים** – נספרים בזכר (*יום אחד, יומיים, שלושה ימים; חודש אחד, חודשיים, שלושה חודשים*).
- הוספת **ו' החיבור** בצורה תקנית לאיבר האחרון בביטוי.

### 2. הקראה קולית (Text-to-Speech)
- מתבצע שימוש ב-`SpeechSynthesisUtterance` של הדפדפן עם מציאת קול עברי (`he-IL`).
- תמיכה בהתאמת Pitch לקול גברי / נשי.
- תמיכה בהרחבה לתוסף `NativeTTS` תחת מעטפת Capacitor במובייל.

### 3. אחסון נתונים (Persistence)
הנתונים נשמרים מקומית בדפדפן באמצעות `localStorage`:
- `baby_birthday`: תאריך הלידה (`DD/MM/YYYY`).
- `baby_name`: שם הילד/ה.
- `baby_pitch`: הגדרת גובה הצליל שנבחר.
- `baby_photo`: תמונת Base64 (מכווצת אוטומטית ל-400px לחיסכון במקום).

---

## 📄 רישיון | License

פרויקט זה נוצר לשימוש אישי ומשפחתי.
