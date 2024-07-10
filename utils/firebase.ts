
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    //   apiKey: "de4b09f9baf093a3c58697c2dd13c032ad6af5d9",
    //   authDomain: "your-auth-domain",
    //   projectId: "dcbapi",
    //   storageBucket: "your-storage-bucket",
    //   messagingSenderId: "your-messaging-sender-id",
    //   appId: "your-app-id"
    apiKey: "AIzaSyDznGk-xz-YEpNs1Beu01_VIMv41jt-k_4",
    authDomain: "dcbapi.firebaseapp.com",
    projectId: "dcbapi",
    storageBucket: "dcbapi.appspot.com",
    messagingSenderId: "894447567184",
    appId: "1:894447567184:web:228bccea31529dc2b0ec55",
    measurementId: "G-29W6FL91KM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
