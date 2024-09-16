"use client";
import { useState } from "react";
import "firebase/firestore";
import { getDoc } from "firebase/firestore";

import {
  auth,
  signInWithEmailAndPassword,
  db,
  doc,
  updateDoc,
  serverTimestamp,
} from "../../firebase/FirebaseConfig";

export default function Login({ setLoginOpen, setIsRegistrationOpen }) {
  const [email, setEmail] = useState(""); // Changed from username to email for Firebase auth
  const [password, setPassword] = useState("");
  const [displayLoginError, setDisplayLoginError] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in:", userCredential.user);

      const lastLoginRef = doc(db, "users", userCredential.user.uid);
      const lastLoginSnap = await getDoc(lastLoginRef);
      if (lastLoginSnap.exists()) {
        const lastLogin = lastLoginSnap.data()?.lastLogin; // Add null check here
        if (lastLogin) {
          console.log("Last login:", lastLogin.toDate());
          console.log(
            "Time since last login in minutes:",
            (Date.now() - lastLogin.toDate().getTime()) / 1000 / 60
          );
        } else {
          console.log(
            "No last login data found for user:",
            userCredential.user.uid
          );
        }
      } else {
        console.log(
          "No last login data found for user:",
          userCredential.user.uid
        );
      }

      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: serverTimestamp(),
      });

      setLoginOpen(false);
    } catch (error) {
      console.error("Error logging in:", error);
      setDisplayLoginError(true);
    }
  };

  const handleCloseClick = () => {
    setLoginOpen(false);
  };

  const handleSignup = () => {
    setIsRegistrationOpen(true);
    setLoginOpen(false);
  };

  return (
    <div className="fixed w-full h-full sm:bg-none bg-purple-400 bg-opacity-70 top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-purple-400 via-pink-400 to-blue-500">
      <div className="absolute w-[90%] sm:w-full max-w-96  top-1/2 left-1/2 rounded-3xl border-white border-opacity-20 border-2 shadow-2xl z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="border-white border-opacity-20 border-b-2  w-full p-4 bg-white bg-opacity-10 rounded-t-3xl flex items-center">
          {" "}
          <button
            onClick={handleCloseClick}
            className="  text-white z-20 w-8 h-8"
          ></button>
        </div>
        <div className="p-4 w-full h-full">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mt-4 flex flex-col">
              <p className="text-3xl text-Kanit font-extrabold text-white">
                login
              </p>
            </div>
            <form
              className="flex flex-col items-center mt-6 w-full px-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="px-6 py-4 bg-rose-50 text-black rounded-full w-full placeholder-purple-300 text-center"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="px-6 py-4 bg-rose-50 text-black rounded-full mt-4 w-full placeholder-purple-300 text-center"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {displayLoginError && (
                <p className="text-red-400 mt-4">
                  Incorrect login credentials!
                </p>
              )}

              <>
                <button
                  onClick={handleLogin}
                  type="submit"
                  className="p-4 px-10 border-white border-opacity-20 border-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all mt-6"
                >
                  Let&apos;s Go
                </button>
                <p className="cursor-pointer mt-6 text-xs mb-2">
                  Need an account?{" "}
                  <span onClick={handleSignup} className="underline">
                    Sign Up
                  </span>{" "}
                  (it&apos;s free)
                </p>
              </>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
