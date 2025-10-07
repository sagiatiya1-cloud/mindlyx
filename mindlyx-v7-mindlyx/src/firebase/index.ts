
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(){
  return await signInWithPopup(auth, googleProvider);
}

export async function signOutUser(){
  return await signOut(auth);
}

export function onAuthChange(cb: (user:any)=>void){
  return onAuthStateChanged(auth, cb);
}

export async function signUpEmail(email:string, password:string){
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), { email, createdAt: Date.now() });
  return userCred;
}

export async function signInEmail(email:string, password:string){
  return await signInWithEmailAndPassword(auth, email, password);
}
