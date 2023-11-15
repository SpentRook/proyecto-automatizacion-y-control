import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkvHgujIpsuGJ-1IPw2MApUx26aHFw_jI",
  authDomain: "authsmartgreenhouses-auto.firebaseapp.com",
  projectId: "authsmartgreenhouses-auto",
  storageBucket: "authsmartgreenhouses-auto.appspot.com",
  messagingSenderId: "991929850078",
  appId: "1:991929850078:web:27b8f36030c5b49ccd8a4f",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export { app, firebaseAuth };
