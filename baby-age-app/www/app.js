/* ==============================================
   APP.JS – Hebrew Age App
   ============================================== */

const STORAGE_KEY       = 'baby_birthday';
const STORAGE_NAME_KEY  = 'baby_name';
const STORAGE_PITCH_KEY = 'baby_pitch';
const STORAGE_PHOTO_KEY = 'baby_photo';

let currentPitch = 1.0; // Default: קול אישה (קול טבעי מקורי ללא פילטר)

/* ------------------------------------------
   SCREEN NAVIGATION
   ------------------------------------------ */
function showMain() {
  document.getElementById('mainScreen').classList.remove('hidden');
  document.getElementById('settingsScreen').classList.add('hidden');
}

function showSettings() {
  document.getElementById('settingsScreen').classList.remove('hidden');
  document.getElementById('mainScreen').classList.add('hidden');
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) document.getElementById('birthdayInput').value = saved;
  const savedName = localStorage.getItem(STORAGE_NAME_KEY);
  if (savedName) document.getElementById('nameInput').value = savedName;
  populateVoiceList();
  // Restore pitch buttons
  const savedPitch = parseFloat(localStorage.getItem(STORAGE_PITCH_KEY));
  if (!isNaN(savedPitch)) {
    currentPitch = savedPitch < 0.9 ? 0.75 : 1.0;
  } else {
    currentPitch = 1.0;
  }
  document.querySelectorAll('.pitch-btn').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.pitch) === currentPitch);
  });
  // Restore photo preview in settings
  const savedPhoto = localStorage.getItem(STORAGE_PHOTO_KEY);
  if (savedPhoto) {
    document.getElementById('photoPreviewImg').src = savedPhoto;
    document.getElementById('photoPreviewImg').classList.remove('hidden');
    document.getElementById('photoPlaceholder').style.display = 'none';
    document.getElementById('photoRemoveBtn').classList.remove('hidden');
  } else {
    document.getElementById('photoPreviewImg').classList.add('hidden');
    document.getElementById('photoPlaceholder').style.display = '';
    document.getElementById('photoRemoveBtn').classList.add('hidden');
  }
}

/* ------------------------------------------
   INPUT: AUTO-FORMAT  DD/MM/YYYY
   ------------------------------------------ */
const birthdayInput = document.getElementById('birthdayInput');

birthdayInput.addEventListener('input', function (e) {
  let val = e.target.value.replace(/\D/g, '');
  let formatted = '';
  if (val.length >= 1) formatted = val.substring(0, 2);
  if (val.length >= 3) formatted += '/' + val.substring(2, 4);
  if (val.length >= 5) formatted += '/' + val.substring(4, 8);
  e.target.value = formatted;
  document.getElementById('inputError').classList.add('hidden');
});

birthdayInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') saveBirthday();
});

/* ------------------------------------------
   VALIDATE DATE STRING  DD/MM/YYYY
   ------------------------------------------ */
function parseDate(str) {
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;
  if (yyyy < 1900 || yyyy > new Date().getFullYear()) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  if (d > new Date()) return null; // future date not allowed
  return d;
}

/* ------------------------------------------
   CALCULATE AGE  →  { years, months, days }
   ------------------------------------------ */
function calcAge(birthday) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let years  = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth()    - birthday.getMonth();
  let days   = today.getDate()     - birthday.getDate();

  // Adjust days
  if (days < 0) {
    months--;
    // Days in the previous month from today's perspective
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Adjust months
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/* ------------------------------------------
   HEBREW NUMBER HELPERS
   ------------------------------------------ */
const MASC_UNITS = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
const MASC_TEENS = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
const FEM_UNITS = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע'];
const FEM_TEENS = ['עשר', 'אחת עשרה', 'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה', 'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה'];
const TENS = ['', 'עשר', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];

function numberToHebrewMasc(n) {
  if (n <= 0) return '';
  if (n < 10) return MASC_UNITS[n];
  if (n < 20) return MASC_TEENS[n - 10];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (u === 0) return TENS[t];
  return TENS[t] + ' ו' + MASC_UNITS[u];
}

function numberToHebrewFem(n) {
  if (n <= 0) return '';
  if (n < 10) return FEM_UNITS[n];
  if (n < 20) return FEM_TEENS[n - 10];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (u === 0) return TENS[t];
  return TENS[t] + ' ו' + FEM_UNITS[u];
}

// Hebrew numerals 1-31 for days (display format)
function hebrewDays(n) {
  if (n === 1)  return 'יום';
  if (n === 2)  return 'יומיים';
  if (n === 7)  return 'שבוע';
  if (n === 14) return 'שבועיים';
  return n + ' ימים';
}

function hebrewMonths(n) {
  if (n === 1)  return 'חודש';
  if (n === 2)  return 'חודשיים';
  return n + ' חודשים';
}

function hebrewYears(n) {
  if (n === 1)  return 'שנה';
  if (n === 2)  return 'שנתיים';
  return n + ' שנים';
}

// Spoken helpers with correct grammatical gender (ימים & חודשים = זכר, שנים = נקבה)
function hebrewDaysSpoken(n) {
  if (n === 1)  return 'יום אחד';
  if (n === 2)  return 'יומיים';
  if (n === 7)  return 'שבוע';
  if (n === 14) return 'שבועיים';
  return numberToHebrewMasc(n) + ' ימים';
}

function hebrewMonthsSpoken(n) {
  if (n === 1)  return 'חודש';
  if (n === 2)  return 'חודשיים';
  return numberToHebrewMasc(n) + ' חודשים';
}

function hebrewYearsSpoken(n) {
  if (n === 1)  return 'שנה';
  if (n === 2)  return 'שנתיים';
  return numberToHebrewFem(n) + ' שנים';
}

/* Vav conjunction (ו/ו) before next word. */
function vav(word) {
  return 'ו' + word;
}

function vavSpoken(word) {
  if (word.startsWith('ו')) return word;
  return 'ו' + word;
}

/* ------------------------------------------
   FORMAT AGE IN HEBREW (DISPLAY & SPOKEN)
   ------------------------------------------ */
function formatAgeHebrew(years, months, days) {
  const parts = [];

  if (years  > 0) parts.push(hebrewYears(years));
  if (months > 0) parts.push(hebrewMonths(months));
  if (days   > 0) parts.push(hebrewDays(days));

  if (parts.length === 0) return 'היום יום הולדת! 🎂';
  if (parts.length === 1) return parts[0];

  // Last part gets a vav prefix, rest joined with ", "
  const last  = parts.pop();
  const rest  = parts.join(', ');
  return rest + ' ' + vav(last);
}

function formatAgeHebrewSpoken(years, months, days) {
  const parts = [];

  if (years  > 0) parts.push(hebrewYearsSpoken(years));
  if (months > 0) parts.push(hebrewMonthsSpoken(months));
  if (days   > 0) parts.push(hebrewDaysSpoken(days));

  if (parts.length === 0) return 'היום יום הולדת!';
  if (parts.length === 1) return parts[0];

  const last  = parts.pop();
  const rest  = parts.join(', ');
  return rest + ' ' + vavSpoken(last);
}

/* ------------------------------------------
   DAYS UNTIL NEXT BIRTHDAY
   ------------------------------------------ */
function daysUntilNextBirthday(birthday) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let next = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
  }

  const diff = Math.round((next - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function nextBirthdayText(birthday) {
  const diff = daysUntilNextBirthday(birthday);
  if (diff === 0) return '🎂 היום יום הולדת! מזל טוב!!! 🥳';
  if (diff === 1) return 'עוד יום אחד ליום ההולדת! 🎁';
  if (diff <= 7)  return `עוד ${diff} ימים ליום ההולדת! 🎈`;
  if (diff <= 30) return `עוד ${diff} ימים ליום ההולדת 🌸`;
  const weeks   = Math.floor(diff / 7);
  const months  = Math.round(diff / 30);
  if (diff < 60)  return `עוד כחודש ליום ההולדת ✨`;
  return `עוד כ-${months} חודשים ליום ההולדת 🌟`;
}

function getGreeting(name) {
  const h = new Date().getHours();
  const prefix = name ? `שלום ${name}!` : 'שלום!';
  if (h < 6)  return `${prefix} 🌙`;
  if (h < 12) return `${prefix} ☀️`;
  if (h < 17) return `${prefix} 🌸`;
  if (h < 21) return `${prefix} 🌙`;
  return `${prefix} ⭐`;
}

/* ------------------------------------------
   SAVE BIRTHDAY
   ------------------------------------------ */
function saveBirthday() {
  const val   = birthdayInput.value.trim();
  const name  = document.getElementById('nameInput').value.trim();
  const date  = parseDate(val);
  const errorEl = document.getElementById('inputError');

  if (!date) {
    errorEl.classList.remove('hidden');
    birthdayInput.focus();
    return;
  }

  errorEl.classList.add('hidden');
  localStorage.setItem(STORAGE_KEY, val);
  if (name) localStorage.setItem(STORAGE_NAME_KEY, name);
  else      localStorage.removeItem(STORAGE_NAME_KEY);

  localStorage.setItem(STORAGE_PITCH_KEY, currentPitch);

  launchConfetti();
  setTimeout(() => { renderMainScreen(date, name); showMain(); }, 600);
}

let currentAgeData = { years: 0, months: 0, days: 0 };

/* ------------------------------------------
   RENDER MAIN SCREEN
   ------------------------------------------ */
function renderMainScreen(birthday, name) {
  name = name ?? localStorage.getItem(STORAGE_NAME_KEY) ?? '';
  const { years, months, days } = calcAge(birthday);
  currentAgeData = { years, months, days };

  document.getElementById('ageText').textContent  = formatAgeHebrew(years, months, days);
  document.getElementById('greeting').textContent = getGreeting(name);

  // Birthday date
  const dd   = String(birthday.getDate()).padStart(2, '0');
  const mm   = String(birthday.getMonth() + 1).padStart(2, '0');
  const yyyy = birthday.getFullYear();
  document.getElementById('birthdayDate').textContent = `${dd}/${mm}/${yyyy}`;

  // Name badge
  const nameEl = document.getElementById('birthdayName');
  if (name) { nameEl.textContent = name; nameEl.style.display = ''; }
  else       { nameEl.textContent = ''; nameEl.style.display = 'none'; }

  // Photo avatar
  const savedPhoto = localStorage.getItem(STORAGE_PHOTO_KEY);
  setAvatarPhoto(savedPhoto || null);

  document.getElementById('nextBirthdayText').textContent = nextBirthdayText(birthday);
}

/* ------------------------------------------
   PHOTO HANDLING
   ------------------------------------------ */
function handlePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    // Resize to max 400px to save space in localStorage
    resizeImage(dataUrl, 400, (resized) => {
      localStorage.setItem(STORAGE_PHOTO_KEY, resized);
      // Update settings preview
      document.getElementById('photoPreviewImg').src = resized;
      document.getElementById('photoPreviewImg').classList.remove('hidden');
      document.getElementById('photoPlaceholder').style.display = 'none';
      document.getElementById('photoRemoveBtn').classList.remove('hidden');
    });
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  localStorage.removeItem(STORAGE_PHOTO_KEY);
  document.getElementById('photoPreviewImg').classList.add('hidden');
  document.getElementById('photoPlaceholder').style.display = '';
  document.getElementById('photoRemoveBtn').classList.add('hidden');
  document.getElementById('photoInput').value = '';
  // Update avatar if on main screen
  setAvatarPhoto(null);
}

function resizeImage(dataUrl, maxSize, callback) {
  const img = new Image();
  img.onload = () => {
    const scale  = Math.min(maxSize / img.width, maxSize / img.height, 1);
    const canvas = document.createElement('canvas');
    canvas.width  = img.width  * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL('image/jpeg', 0.82));
  };
  img.src = dataUrl;
}

function setAvatarPhoto(dataUrl) {
  const avatarEl = document.getElementById('avatar');
  const photoEl  = document.getElementById('avatarPhoto');
  if (!avatarEl || !photoEl) return;
  if (dataUrl) {
    photoEl.src = dataUrl;
    photoEl.classList.remove('hidden');
    avatarEl.style.display = 'none';
  } else {
    photoEl.classList.add('hidden');
    avatarEl.style.display = '';
  }
}

/* ------------------------------------------
   VOICE MANAGEMENT
   ------------------------------------------ */
let allVoices = [];

function populateVoiceList() {
  allVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}

function getSelectedVoice() {
  // No voice picker in the UI (just the male/female pitch toggle) —
  // always prefer a Hebrew voice.
  return allVoices.find(v => v.lang.startsWith('he')) || allVoices[0] || null;
}

/* ------------------------------------------
   TTS HELPER — native Android or Web fallback
   ------------------------------------------ */
async function ttsSpeak(text) {
  // Try Capacitor native TTS first (works in WebView)
  try {
    const { NativeTTS } = window.Capacitor?.Plugins || {};
    if (NativeTTS) {
      await NativeTTS.speak({
        text:  text,
        pitch: currentPitch,
        rate:  0.88
      });
      return true;
    }
  } catch(e) { /* fall through */ }

  // Fallback: Web Speech API (works in Chrome)
  if (!window.speechSynthesis) return false;
  const voice = getSelectedVoice();
  const utt   = new SpeechSynthesisUtterance(text);
  utt.lang    = voice?.lang || 'he-IL';
  utt.pitch   = currentPitch;
  utt.rate    = 0.88;
  utt.volume  = 1;
  if (voice) utt.voice = voice;
  return new Promise(resolve => {
    utt.onend   = () => resolve(true);
    utt.onerror = () => resolve(false);
    speechSynthesis.speak(utt);
  });
}

function ttsStop() {
  try { window.Capacitor?.Plugins?.NativeTTS?.stop({}); } catch(e) {}
  try { window.speechSynthesis?.cancel(); } catch(e) {}
}

function selectPitch(el) {
  currentPitch = parseFloat(el.dataset.pitch);
  document.querySelectorAll('.pitch-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  ttsStop();
  setTimeout(() => {
    const text = currentPitch < 0.9 ? 'שלום! זהו קול גבר' : 'שלום! זהו קול אישה';
    ttsSpeak(text);
  }, 100);
}

/* ------------------------------------------
   TEXT TO SPEECH  🔊
   ------------------------------------------ */
function speakAge() {
  const btn  = document.getElementById('speakBtn');
  const icon = document.getElementById('speakIcon');

  if (btn.classList.contains('speaking')) {
    ttsStop();
    btn.classList.remove('speaking');
    icon.textContent = '🔊';
    return;
  }

  const spokenAge = formatAgeHebrewSpoken(currentAgeData.years, currentAgeData.months, currentAgeData.days);
  if (!spokenAge) return;

  const sentence = `הגיל שלי הוא ${spokenAge}`;
  btn.classList.add('speaking');
  icon.textContent = '🔇';

  ttsSpeak(sentence).then(() => {
    btn.classList.remove('speaking');
    icon.textContent = '🔊';
  });
}


/* ------------------------------------------
   CONFETTI BURST  🎉
   ------------------------------------------ */
function launchConfetti() {
  const emojis = ['🌸', '⭐', '💖', '✨', '🌟', '🦋', '🎀', '💕'];
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.classList.add('confetti');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist  = 120 + Math.random() * 160;
      el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--ty', Math.sin(angle) * dist - 80 + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    }, i * 60);
  }
}

/* ------------------------------------------
   INIT
   ------------------------------------------ */
function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const date = parseDate(saved);
    if (date) {
      renderMainScreen(date);
      showMain();
      return;
    }
  }
  // First time: show settings
  showSettings();
}

// Start
document.addEventListener('DOMContentLoaded', init);

// Capacitor device ready support (also fires on plain web)
if (typeof window !== 'undefined') {
  document.addEventListener('deviceready', init, false);
}
