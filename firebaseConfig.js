// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvw5OYUU3fQ68u-JDZkQ-OaZOIOTyTfrE",
  authDomain: "thuchanhreactnative.firebaseapp.com",
  databaseURL:
    "https://thuchanhreactnative-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thuchanhreactnative",
  storageBucket: "thuchanhreactnative.appspot.com",
  messagingSenderId: "1070531932324",
  appId: "1:1070531932324:web:54aa5a8d9c6d8bb14bb631",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth, Database và Storage
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };
