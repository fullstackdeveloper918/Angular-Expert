
import { initializeApp } from "firebase/app";
import { getAuth,setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {

    // apiKey: "AIzaSyD4PKeu6LFooeb0A_O2EppvgQoBxbv8AB4",
    // authDomain: "craftsmen-cadd2.firebaseapp.com",
    // databaseURL: "https://craftsmen-cadd2-default-rtdb.asia-southeast1.firebasedatabase.app",
    // projectId: "craftsmen-cadd2",
    // storageBucket: "craftsmen-cadd2.appspot.com",
    // messagingSenderId: "461827832880",
    // appId: "1:461827832880:web:c26433472e5ac6202ac1f5",
    // measurementId: "G-WLPH62WMN0"


    apiKey: "AIzaSyA7GpxmHUqofA_rSTAsOJJNsxTCK6YdTEU",
  authDomain: "new-craftsmen.firebaseapp.com",
  databaseURL: "https://new-craftsmen-default-rtdb.firebaseio.com",
  projectId: "new-craftsmen",
  storageBucket: "new-craftsmen.firebasestorage.app",
  messagingSenderId: "395444933967",
  appId: "1:395444933967:web:f710a557b45bc787c2613a",
  measurementId: "G-L5M5S24N54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth,setPersistence, browserLocalPersistence, signInWithEmailAndPassword };
