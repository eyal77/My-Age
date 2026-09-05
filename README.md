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

### 📱 הרצה וקימפול לאנדרואיד (Capacitor)

1. סנכרון קבצי ה-Web לפרויקט האנדרואיד:
   ```bash
   cd baby-age-app
   npx cap copy
   npx cap sync
   ```

2. פתיחת הפרויקט ב-Android Studio:
   ```bash
   npx cap open android
   ```

3. מתוך Android Studio ניתן להריץ ישירות על מכשיר מחובר או לבנות קובץ APK / AAB.

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
