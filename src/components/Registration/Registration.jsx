"use client";
import { useState } from "react";
import "firebase/firestore";

import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  serverTimestamp,
  storage,
} from "../../firebase/FirebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

export default function Registration({
  setIsRegistrationOpen,
  setIsLoginOpen,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Separate state for confirm password
  const [displaySignupError, setDisplaySignupError] = useState(false);
  const [username, setUsername] = useState(""); // Initialize username with claimString
  const [signupErrorMessage, setSignupErrorMessage] = useState(""); // New state for specific error messages

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setSignupErrorMessage("Passwords do not match");
      setDisplaySignupError(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload the default profile image to Firebase Storage
      const profileImageRef = ref(
        storage,
        `profile-images/${user.uid}/profile-image.png`
      );

      // Use the src property to get the URL string for the image
      const response = await fetch("/images/blank.png");
      const blob = await response.blob();
      await uploadBytes(profileImageRef, blob);

      // Set user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: serverTimestamp(),
        username: username,
        nameText: "Your name",
        bioText:
          "Tell the world about yourself. Here you can add a short paragraph about yourself, your skills, and your experience.",
        titleText: "Your expert title",
        socialLinks: ["example link"],
        drops: ["full-time", "available for hire", "uk-based"],
        skills: ["unreal engine", "c++", "shader graph", "blueprints"],
        projects: [
          {
            projectID: "Project A",
            projectTitle: "Awesome project #1",
            projectDescription:
              "This is an example project. You can add your own projects to your profile.",
            projectLink: "https://google.com",
            projectTags: ["unity", "c#", "game development"],
            projectImage: response.url,
          },
        ],
        videos: [],
      });

      window.location.href = "/editprofile";
    } catch (error) {
      console.error("Error signing up:", error);
      setSignupErrorMessage(error.message || "An error occurred during signup");
      setDisplaySignupError(true);
    }
  };

  const handleUsernameChange = (event) => {
    const formattedUsername = event.target.value
      .replace(/\s+/g, "-")
      .toLowerCase();
    setUsername(formattedUsername);
  };

  const closeRegistration = () => {
    setIsRegistrationOpen(false);
  };

  const handleLoginClick = () => {
    setIsRegistrationOpen(false);
    setIsLoginOpen(true);
    setDisplaySignupError(false);
  };

  return (
    <div
      className="fixed w-full h-full sm:bg-none bg-purple-400 bg-opacity-70 top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-purple-400 via-pink-400 to-blue-500 opacity-100"
      style={{ zIndex: "9999" }}
    >
      <div className="w-[90%] absolute top-1/2 left-1/2 sm:max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-white border-opacity-20 border-2 shadow-2xl z-10">
        <div className="border-white border-opacity-20 border-b-2 w-full p-4 bg-white bg-opacity-10 rounded-t-3xl flex items-center">
          <button
            onClick={() => closeRegistration()}
            className="text-white z-20 w-8 h-8"
          ></button>
        </div>
        <div className="p-4 w-full h-full">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center mt-4 flex-col">
              <p className="text-3xl text-Kanit font-extrabold text-white">
                Sign Up
              </p>
            </div>
            <form
              className="flex flex-col items-center mt-6 w-full px-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="px-6 py-4 bg-rose-50 text-black rounded-full w-full placeholder-purple-300 text-center"
                type="text"
                placeholder="Space Name"
                value={username} // Bind input value to username state
                onChange={handleUsernameChange}
              />
              <p className="text-sm mt-4">Your new URL: hireme.gg/{username}</p>
              <input
                className="px-6 py-4 bg-rose-50 text-black rounded-full w-full mt-4 placeholder-purple-300 text-center"
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
              <input
                className="px-6 py-4 bg-rose-50 text-black rounded-full mt-4 w-full placeholder-purple-300 text-center"
                type="password"
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {displaySignupError && (
                <p className="text-red-400 mt-4">{signupErrorMessage}</p>
              )}

              <>
                <button
                  type="submit"
                  onClick={handleSignup}
                  className="p-4 px-10 border-white border-opacity-20 border-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all mt-6"
                >
                  Let&apos;s Go
                </button>
                <p className="cursor-pointer mt-6 text-sm mb-2">
                  Already have an account?{" "}
                  <span onClick={handleLoginClick} className="underline">
                    Login
                  </span>
                </p>
              </>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
