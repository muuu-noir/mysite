/**
 * Site Configuration (Keep this file private)
 */
window.SITE_CONFIG = {
  // Google フォーム（スプレッドシート）のCSV公開URL
  newsSheetUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSv2LsjAJiTj68L-xjW483uo8dBOqgQ8WZOVbwvSII_zlvUcWhHoXO9DB_AUqwqfJaWGFA1YLKo8OMR/pub?gid=234492263&single=true&output=csv",

  // Twitter (X)
  twitterId: "mog147_2",

  // Instagram
  instagramId: "mogmog_atelier",
  instagramLink: "https://www.instagram.com/mogmog_atelier/",

  // Featured Content
  featuredTweet: {
    text: "論理と感性の交差点で、目に見えない価値を形にする。私のつくるものが、誰かの日常に静かな驚きと美しさを添えられますように。 #DesignEngineer #396FOLIO",
    date: "2026.02.11",
    link: "https://x.com/mog147_2/status/2021394354901020891"
  },

  // Visitor Counter
  counterTag: `<!-- Visitor Analytics Tag for https://momoko0402.web.fc2.com/ -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, doc, updateDoc, increment, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  const firebaseConfig = { apiKey: "AIzaSyCGzBYbY_OCBacDJ8x7F0M333oYGSqTJi8", projectId: "my-site-analytics-993dc", appId: "1:973356323774:web:b2797526ac35ca259c9fef" };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  signInAnonymously(auth).then(() => {
    const docRef = doc(db, 'artifacts', 'c_b9ec481a8a59586b_AnalyticsApp.jsx-224', 'public', 'data', 'analytics_sites', 'https___momoko0402_web_fc2_com_');
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    updateDoc(docRef, { count: increment(1), mobile: isMobile ? increment(1) : increment(0), desktop: !isMobile ? increment(1) : increment(0), lastUpdated: serverTimestamp() }).catch(() => {
      setDoc(docRef, { url: "https://momoko0402.web.fc2.com/", count: 1, mobile: isMobile ? 1 : 0, desktop: !isMobile ? 1 : 0, lastUpdated: serverTimestamp(), createdAt: serverTimestamp() });
    });
  }).catch(console.error);
<\/script>`
};
console.log("Config: Loaded SITE_CONFIG successfully.");
