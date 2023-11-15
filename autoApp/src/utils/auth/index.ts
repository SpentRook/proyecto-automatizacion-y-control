import { createContext, useContext, useEffect, useState } from "react";

import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "../database/firebase";

const signUpWithEmailAndPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
};

const signInWithEmailAndPasswordF = (email: string, password: string) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

const logOut = () => {
  signOut(firebaseAuth);
};

const UserContext = createContext<User | null>(null);

const UserProvider = UserContext.Provider as React.Provider<User>;

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      return setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return currentUser;
};

const useUser = () => {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error("UserProvider not found.");
  }
  return ctx;
};

export {
  UserProvider,
  useUser,
  useAuth,
  signInWithEmailAndPasswordF,
  signUpWithEmailAndPassword,
  logOut,
};
