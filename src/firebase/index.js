import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebaseConfig from "./config.json";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
