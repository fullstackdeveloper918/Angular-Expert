
import { initializeApp } from "firebase/app";
import { getAuth,setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    //   apiKey: "de4b09f9baf093a3c58697c2dd13c032ad6af5d9",
    //   authDomain: "your-auth-domain",
    //   projectId: "dcbapi",
    //   storageBucket: "your-storage-bucket",
    //   messagingSenderId: "your-messaging-sender-id",
    //   appId: "your-app-id"
    // apiKey: "AIzaSyDznGk-xz-YEpNs1Beu01_VIMv41jt-k_4",
    // authDomain: "dcbapi.firebaseapp.com",
    // projectId: "dcbapi",
    // storageBucket: "dcbapi.appspot.com",
    // messagingSenderId: "894447567184",
    // appId: "1:894447567184:web:1805a6ee1a39c1adb0ec55",
    // measurementId:"G-SVKFM6CS7M"

    // apiKey: "AIzaSyD4PKeu6LFooeb0A_O2EppvgQoBxbv8AB4",
    // authDomain: "craftsmen-cadd2.firebaseapp.com",
    // projectId: "craftsmen-cadd2",
    // storageBucket: "craftsmen-cadd2.appspot.com",
    // messagingSenderId: "461827832880",
    // appId: "1:461827832880:web:c26433472e5ac6202ac1f5",
    // measurementId: "G-WLPH62WMN0",

    apiKey: "AIzaSyD4PKeu6LFooeb0A_O2EppvgQoBxbv8AB4",
    authDomain: "craftsmen-cadd2.firebaseapp.com",
    databaseURL: "https://craftsmen-cadd2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "craftsmen-cadd2",
    storageBucket: "craftsmen-cadd2.appspot.com",
    messagingSenderId: "461827832880",
    appId: "1:461827832880:web:c26433472e5ac6202ac1f5",
    measurementId: "G-WLPH62WMN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth,setPersistence, browserLocalPersistence, signInWithEmailAndPassword };
