
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


    apiKey: "AIzaSyDqYgP14ixdD2V5GKxEi-wiiV7qiMNmSLI",
    authDomain: "nabh-41663.firebaseapp.com",
    databaseURL: "https://nabh-41663-default-rtdb.firebaseio.com",
    projectId: "nabh-41663",
    storageBucket: "nabh-41663.appspot.com",
    messagingSenderId: "720960124468",
    appId: "1:720960124468:web:2e85c1f341f10a5461bc61",
    measurementId: "G-YNTENEH3KR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth,setPersistence, browserLocalPersistence, signInWithEmailAndPassword };
