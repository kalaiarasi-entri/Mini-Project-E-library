import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import initialUsers from "./data/initialUsers.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    const existing = localStorage.getItem("usersByRole");
    let updatedStorage = {};

    if (existing) {
      updatedStorage = JSON.parse(existing);

      Object.keys(initialUsers).forEach((role) => {
        if (!updatedStorage[role]) {
          updatedStorage[role] = [];
        }

        initialUsers[role].forEach((newUser, index) => {
          const exists = updatedStorage[role].some(
            (u) => u.email === newUser.email
          );
          if (!exists) {
            // Assign a userId if not present
            const existingCount = updatedStorage[role].length;
            newUser.userId = `${role[0].toUpperCase()}${existingCount + 1}`;
            updatedStorage[role].push(newUser);
          }
        });
      });
    } else {
      // First-time setup: create userId for all users
      updatedStorage = {};
      Object.keys(initialUsers).forEach((role) => {
        updatedStorage[role] = initialUsers[role].map((user, index) => ({
          ...user,
          userId: `${role[0].toUpperCase()}${index + 1}`,
        }));
      });
    }

    // Store in localStorage
    localStorage.setItem("usersByRole", JSON.stringify(updatedStorage));
    console.log("Final usersByRole:", updatedStorage);
  }, []);

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
