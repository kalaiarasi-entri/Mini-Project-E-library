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

        initialUsers[role].forEach((newUser) => {
          const exists = updatedStorage[role].some(
            (u) => u.email === newUser.email
          );
          if (!exists) {
            updatedStorage[role].push(newUser);
          }
        });
      });
    } else {
      updatedStorage = initialUsers;
    }

    localStorage.setItem("usersByRole", JSON.stringify(updatedStorage));
    // Debug log
    console.log('Final usersByRole:', updatedStorage);
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
